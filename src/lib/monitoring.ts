import { logger } from "./logger";
// Edge Runtime 호환성을 위해 백업 시스템 import 제거
// import { backupManager } from "./backup";
import { rateLimiter } from "./rateLimit";
import os from "os";

// Edge Runtime 타입 정의
declare global {
  var EdgeRuntime: string | undefined;
}

export interface SystemMetrics {
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
    heapUsed: number;
    heapTotal: number;
    heapExternal: number;
    rss: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  database: {
    status: "connected" | "disconnected" | "unknown";
    responseTime: number;
  };
  requests: {
    total: number;
    active: number;
    blocked: number;
  };
  backups: {
    status: "running" | "stopped";
    lastBackup?: string;
    nextBackup?: string;
    totalBackups: number;
  };
  errors: {
    count: number;
    lastError?: string;
    lastErrorTime?: string;
  };
}

export interface PerformanceMetric {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
  userId?: string;
  ip?: string;
  requestId?: string;
}

// 모니터링 시스템 인터페이스 정의
export interface IMonitoringSystem {
  recordPerformanceMetric(metric: PerformanceMetric): void;
  recordError(error: Error, context?: string): void;
  getCurrentStatus(): SystemMetrics | null;
  getMetricsHistory(limit?: number): SystemMetrics[];
  getPerformanceHistory(limit?: number): PerformanceMetric[];
  getSystemSummary(): {
    status: "healthy" | "warning" | "critical" | "unknown";
    uptime: number;
    memoryUsage: number;
    errorRate: number;
    activeRequests: number;
    blockedIPs: number;
  };
  exportMetrics(): {
    system: SystemMetrics[];
    performance: PerformanceMetric[];
    summary: ReturnType<IMonitoringSystem["getSystemSummary"]>;
  };
  resetMetrics(): void;
  stopMonitoring(): void;
  checkAlerts(): void;
}

export class MonitoringSystem implements IMonitoringSystem {
  private static instance: MonitoringSystem;
  private metrics: SystemMetrics[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errorCount: number = 0;
  private lastError?: string;
  private lastErrorTime?: string;
  private requestCount: number = 0;
  private startTime: number = Date.now();
  private intervalId?: NodeJS.Timeout;
  private readonly MAX_METRICS = 50; // 100 → 50으로 감소하여 메모리 사용량 제한
  private readonly MAX_PERFORMANCE_METRICS = 25; // 500 → 25로 감소하여 메모리 사용량 제한
  private readonly MEMORY_CLEANUP_THRESHOLD = 0.8; // 메모리 정리 임계값

  private constructor() {
    // Edge Runtime 환경 체크
    if (this.isEdgeRuntime()) {
      logger.info("Edge Runtime 환경에서 모니터링 시스템을 비활성화합니다.");
      return;
    }
    this.startMonitoring();
  }

  public static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  /**
   * Edge Runtime 환경인지 확인
   */
  private isEdgeRuntime(): boolean {
    return (
      typeof globalThis.EdgeRuntime !== "undefined" ||
      process.env.NEXT_RUNTIME === "edge" ||
      process.env.NODE_ENV === "development"
    );
  }

  /**
   * 모니터링 시작
   */
  private startMonitoring(): void {
    // Edge Runtime 환경에서는 모니터링 비활성화
    if (this.isEdgeRuntime()) {
      logger.info("Edge Runtime 환경에서 모니터링을 비활성화합니다.");
      return;
    }

    logger.info("모니터링 시스템을 시작합니다.");

    // 5분마다 시스템 메트릭 수집 (1분 → 5분으로 증가하여 시스템 부하 감소)
    this.intervalId = setInterval(() => {
      this.collectSystemMetrics();
    }, 300000);
  }

  /**
   * 모니터링 중지
   */
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      logger.info("모니터링 시스템을 중지했습니다.");
    }
  }

  /**
   * 메모리 압박 시 자동 정리
   */
  private cleanupMemory(): void {
    if (
      this.metrics.length >
      this.MAX_METRICS * this.MEMORY_CLEANUP_THRESHOLD
    ) {
      const newLength = Math.floor(this.MAX_METRICS / 2);
      this.metrics = this.metrics.slice(-newLength);
      logger.warn(
        `메모리 압박으로 인해 메트릭을 ${newLength}개로 정리했습니다.`
      );
    }

    if (
      this.performanceMetrics.length >
      this.MAX_PERFORMANCE_METRICS * this.MEMORY_CLEANUP_THRESHOLD
    ) {
      const newLength = Math.floor(this.MAX_PERFORMANCE_METRICS / 2);
      this.performanceMetrics = this.performanceMetrics.slice(-newLength);
      logger.warn(
        `메모리 압박으로 인해 성능 메트릭을 ${newLength}개로 정리했습니다.`
      );
    }
  }

  /**
   * 시스템 메트릭 수집
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      // Edge Runtime 환경 체크
      if (this.isEdgeRuntime()) {
        return;
      }

      const metrics: SystemMetrics = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: this.getMemoryMetrics(),
        cpu: this.getCpuMetrics(),
        database: await this.getDatabaseMetrics(),
        requests: this.getRequestMetrics(),
        backups: await this.getBackupMetrics(),
        errors: {
          count: this.errorCount,
          lastError: this.lastError,
          lastErrorTime: this.lastErrorTime,
        },
      };

      this.metrics.push(metrics);

      // 최대 메트릭 수 제한
      if (this.metrics.length > this.MAX_METRICS) {
        this.metrics = this.metrics.slice(-this.MAX_METRICS);
      }

      // 메모리 정리 실행
      this.cleanupMemory();

      // 로그 레벨에 따른 메트릭 출력
      if (process.env.NODE_ENV === "development") {
        logger.debug("시스템 메트릭 수집 완료", { metrics });
      }
    } catch (error) {
      logger.error("시스템 메트릭 수집 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * 메모리 메트릭 수집
   */
  private getMemoryMetrics(): SystemMetrics["memory"] {
    const memUsage = process.memoryUsage();

    return {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapExternal: Math.round(memUsage.external / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024),
    };
  }

  /**
   * CPU 메트릭 수집
   */
  private getCpuMetrics(): SystemMetrics["cpu"] {
    const loadAvg = os.loadavg();

    return {
      usage: 0, // Node.js에서는 CPU 사용률을 직접 측정하기 어려움
      loadAverage: loadAvg,
    };
  }

  /**
   * 데이터베이스 메트릭 수집
   */
  private async getDatabaseMetrics(): Promise<SystemMetrics["database"]> {
    try {
      // Edge Runtime 환경에서는 데이터베이스 체크 건너뛰기
      if (this.isEdgeRuntime()) {
        return {
          status: "unknown",
          responseTime: 0,
        };
      }

      const startTime = Date.now();

      // Prisma 클라이언트를 동적으로 import
      const { prisma } = await import("./prisma");
      await prisma.$queryRaw`SELECT 1`;

      const responseTime = Date.now() - startTime;

      return {
        status: "connected",
        responseTime,
      };
    } catch (error) {
      logger.error("데이터베이스 메트릭 수집 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        status: "disconnected",
        responseTime: 0,
      };
    }
  }

  /**
   * 요청 메트릭 수집
   */
  private getRequestMetrics(): SystemMetrics["requests"] {
    try {
      const stats = rateLimiter.getStats();

      return {
        total: this.requestCount,
        active: stats.activeIPs,
        blocked: stats.blockedIPs,
      };
    } catch (error) {
      logger.error("요청 메트릭 수집 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        total: this.requestCount,
        active: 0,
        blocked: 0,
      };
    }
  }

  /**
   * 백업 메트릭 수집 (Edge Runtime 호환성을 위해 제거)
   */
  private async getBackupMetrics(): Promise<SystemMetrics["backups"]> {
    // Edge Runtime 호환성을 위해 백업 기능 제거
    return {
      status: "stopped" as const,
      lastBackup: undefined,
      nextBackup: undefined,
      totalBackups: 0,
    };
  }

  /**
   * 성능 메트릭 기록
   */
  public recordPerformanceMetric(metric: PerformanceMetric): void {
    // Edge Runtime 환경에서는 메트릭 기록 건너뛰기
    if (this.isEdgeRuntime()) {
      return;
    }

    this.performanceMetrics.push(metric);
    this.requestCount++;

    // 최대 성능 메트릭 수 제한
    if (this.performanceMetrics.length > this.MAX_PERFORMANCE_METRICS) {
      this.performanceMetrics = this.performanceMetrics.slice(
        -this.MAX_PERFORMANCE_METRICS
      );
    }

    // 메모리 정리 실행
    this.cleanupMemory();

    // 느린 요청 로깅 (1초 이상)
    if (metric.responseTime > 1000) {
      logger.warn("느린 요청 감지", {
        endpoint: metric.endpoint,
        method: metric.method,
        responseTime: metric.responseTime,
        statusCode: metric.statusCode,
      });
    }
  }

  /**
   * 에러 기록
   */
  public recordError(error: Error, context?: string): void {
    // Edge Runtime 환경에서는 에러 기록 건너뛰기
    if (this.isEdgeRuntime()) {
      return;
    }

    this.errorCount++;
    this.lastError = error.message;
    this.lastErrorTime = new Date().toISOString();

    logger.error("에러 발생", {
      error: error.message,
      context,
      stack: error.stack,
      errorCount: this.errorCount,
    });
  }

  /**
   * 현재 시스템 상태 반환
   */
  public getCurrentStatus(): SystemMetrics | null {
    if (this.isEdgeRuntime() || this.metrics.length === 0) {
      return null;
    }
    return this.metrics[this.metrics.length - 1];
  }

  /**
   * 메트릭 히스토리 반환
   */
  public getMetricsHistory(limit: number = 50): SystemMetrics[] {
    if (this.isEdgeRuntime()) {
      return [];
    }
    return this.metrics.slice(-Math.min(limit, this.MAX_METRICS));
  }

  /**
   * 성능 메트릭 히스토리 반환
   */
  public getPerformanceHistory(limit: number = 25): PerformanceMetric[] {
    if (this.isEdgeRuntime()) {
      return [];
    }
    return this.performanceMetrics.slice(
      -Math.min(limit, this.MAX_PERFORMANCE_METRICS)
    );
  }

  /**
   * 시스템 상태 요약 반환
   */
  public getSystemSummary(): {
    status: "healthy" | "warning" | "critical" | "unknown";
    uptime: number;
    memoryUsage: number;
    errorRate: number;
    activeRequests: number;
    blockedIPs: number;
  } {
    // Edge Runtime 환경에서는 기본값 반환
    if (this.isEdgeRuntime()) {
      return {
        status: "unknown",
        uptime: 0,
        memoryUsage: 0,
        errorRate: 0,
        activeRequests: 0,
        blockedIPs: 0,
      };
    }

    const current = this.getCurrentStatus();
    if (!current) {
      return {
        status: "unknown",
        uptime: 0,
        memoryUsage: 0,
        errorRate: 0,
        activeRequests: 0,
        blockedIPs: 0,
      };
    }

    const memoryUsage = (current.memory.used / current.memory.total) * 100;
    const errorRate = (this.errorCount / Math.max(this.requestCount, 1)) * 100;

    let status: "healthy" | "warning" | "critical" = "healthy";

    if (memoryUsage > 90 || errorRate > 10 || current.requests.blocked > 50) {
      status = "critical";
    } else if (
      memoryUsage > 70 ||
      errorRate > 5 ||
      current.requests.blocked > 20
    ) {
      status = "warning";
    }

    return {
      status,
      uptime: current.uptime,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      activeRequests: current.requests.active,
      blockedIPs: current.requests.blocked,
    };
  }

  /**
   * 알림 조건 확인
   */
  public checkAlerts(): void {
    // Edge Runtime 환경에서는 알림 확인 건너뛰기
    if (this.isEdgeRuntime()) {
      return;
    }

    const summary = this.getSystemSummary();

    if (summary.status === "critical") {
      logger.fatal("시스템 상태가 위험 수준입니다!", { summary });
      // TODO: Slack/이메일 알림 발송
    } else if (summary.status === "warning") {
      logger.warn("시스템 상태에 주의가 필요합니다", { summary });
    }
  }

  /**
   * 메트릭 내보내기 (외부 모니터링 시스템용)
   */
  public exportMetrics(): {
    system: SystemMetrics[];
    performance: PerformanceMetric[];
    summary: ReturnType<typeof MonitoringSystem.prototype.getSystemSummary>;
  } {
    if (this.isEdgeRuntime()) {
      return {
        system: [],
        performance: [],
        summary: this.getSystemSummary(),
      };
    }

    return {
      system: this.metrics,
      performance: this.performanceMetrics,
      summary: this.getSystemSummary(),
    };
  }

  /**
   * 메트릭 초기화
   */
  public resetMetrics(): void {
    if (this.isEdgeRuntime()) {
      return;
    }

    this.metrics = [];
    this.performanceMetrics = [];
    this.errorCount = 0;
    this.requestCount = 0;
    this.startTime = Date.now();
    logger.info("모니터링 메트릭을 초기화했습니다.");
  }
}

// Edge Runtime 환경에서 안전한 더미 모니터링 시스템 생성
const createDummyMonitoringSystem = (): IMonitoringSystem => ({
  recordPerformanceMetric: () => {},
  recordError: () => {},
  getCurrentStatus: () => null,
  getMetricsHistory: () => [],
  getPerformanceHistory: () => [],
  getSystemSummary: () => ({
    status: "unknown" as const,
    uptime: 0,
    memoryUsage: 0,
    errorRate: 0,
    activeRequests: 0,
    blockedIPs: 0,
  }),
  exportMetrics: () => ({
    system: [],
    performance: [],
    summary: {
      status: "unknown" as const,
      uptime: 0,
      memoryUsage: 0,
      errorRate: 0,
      activeRequests: 0,
      blockedIPs: 0,
    },
  }),
  resetMetrics: () => {},
  stopMonitoring: () => {},
  checkAlerts: () => {},
});

// 환경별 모니터링 시스템 인스턴스 생성
export const monitoringSystem: IMonitoringSystem = (() => {
  // Edge Runtime이나 개발 환경에서는 더미 모니터링 시스템 반환
  if (
    typeof globalThis.EdgeRuntime !== "undefined" ||
    process.env.NEXT_RUNTIME === "edge" ||
    process.env.NODE_ENV === "development"
  ) {
    logger.info(
      "Edge Runtime/개발 환경에서 더미 모니터링 시스템을 사용합니다."
    );
    return createDummyMonitoringSystem();
  }

  // 프로덕션 환경에서만 실제 모니터링 시스템 사용
  try {
    return MonitoringSystem.getInstance();
  } catch (error) {
    logger.error("모니터링 시스템 초기화 실패, 더미 시스템으로 대체", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return createDummyMonitoringSystem();
  }
})();

// 정기적인 알림 확인 (5분마다) - Edge Runtime 환경에서는 비활성화
if (
  typeof globalThis.EdgeRuntime === "undefined" &&
  process.env.NEXT_RUNTIME !== "edge" &&
  process.env.NODE_ENV === "production"
) {
  setInterval(() => {
    try {
      monitoringSystem.checkAlerts();
    } catch (error) {
      logger.error("알림 확인 중 오류 발생", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, 300000);
}

// 프로덕션 환경에서만 자동 시작
if (
  typeof globalThis.EdgeRuntime === "undefined" &&
  process.env.NEXT_RUNTIME !== "edge" &&
  process.env.NODE_ENV === "production"
) {
  logger.info("프로덕션 모니터링 시스템이 활성화되었습니다.");
}
