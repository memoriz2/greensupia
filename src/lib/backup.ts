// Edge Runtime 호환성을 위해 조건부 import
interface SafeLogger {
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

interface ExecAsyncFunction {
  (command: string, options?: { timeout?: number }): Promise<{
    stdout: string;
    stderr: string;
  }>;
}

let execAsync: ExecAsyncFunction | undefined;
let logger: SafeLogger | undefined;

// Edge Runtime이 아닌 경우에만 Node.js 전용 모듈 import
if (
  typeof (globalThis as Record<string, unknown>).EdgeRuntime === "undefined"
) {
  try {
    // 동적 import 사용
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    execAsync = promisify(exec);

    const loggerModule = await import("./logger");
    // Logger 타입을 SafeLogger로 변환
    logger = {
      info: (message: string, data?: unknown) =>
        loggerModule.logger.info(
          message,
          data as Record<string, unknown> | undefined
        ),
      warn: (message: string, data?: unknown) =>
        loggerModule.logger.warn(
          message,
          data as Record<string, unknown> | undefined
        ),
      error: (message: string, data?: unknown) =>
        loggerModule.logger.error(
          message,
          data as Record<string, unknown> | undefined
        ),
      debug: (message: string, data?: unknown) =>
        loggerModule.logger.debug(
          message,
          data as Record<string, unknown> | undefined
        ),
    };
  } catch (importError) {
    // logger가 없는 경우 기본 console 사용
    logger = {
      info: (message: string, data?: unknown) =>
        console.log(`[INFO] ${message}`, data || ""),
      warn: (message: string, data?: unknown) =>
        console.warn(`[WARN] ${message}`, data || ""),
      error: (message: string, data?: unknown) =>
        console.error(`[ERROR] ${message}`, data || ""),
      debug: (message: string, data?: unknown) =>
        console.log(`[DEBUG] ${message}`, data || ""),
    };
  }
}

export interface BackupConfig {
  databaseUrl: string;
  backupDir: string;
  maxBackups: number;
  backupInterval: number; // 밀리초
  retentionDays: number;
}

export interface BackupInfo {
  filename: string;
  filepath: string;
  size: number;
  createdAt: Date;
  status: "success" | "failed";
  error?: string;
}

export class BackupManager {
  private config: BackupConfig;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor(config: BackupConfig) {
    this.config = config;
  }

  /**
   * 백업 시작
   */
  public start(): void {
    // Edge Runtime에서는 백업 기능 비활성화
    if (
      typeof (globalThis as Record<string, unknown>).EdgeRuntime !== "undefined"
    ) {
      return;
    }

    if (this.isRunning) {
      logger?.warn("백업 매니저가 이미 실행 중입니다.");
      return;
    }

    this.isRunning = true;
    logger?.info("백업 매니저를 시작합니다.", { config: this.config });

    // 즉시 첫 백업 실행
    this.performBackup();

    // 정기 백업 스케줄링
    this.intervalId = setInterval(() => {
      this.performBackup();
    }, this.config.backupInterval);
  }

  /**
   * 백업 중지
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    logger?.info("백업 매니저를 중지했습니다.");
  }

  /**
   * 백업 실행
   */
  private async performBackup(): Promise<void> {
    try {
      logger?.info("데이터베이스 백업을 시작합니다.");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `backup-${timestamp}.sql`;
      const filepath = `${this.config.backupDir}/${filename}`;

      // 백업 디렉토리 생성
      await this.ensureBackupDirectory();

      // MySQL 백업 실행
      await this.createMySQLBackup(filepath);

      // 백업 정보 저장
      const backupInfo: BackupInfo = {
        filename,
        filepath,
        size: await this.getFileSize(filepath),
        createdAt: new Date(),
        status: "success",
      };

      logger?.info("데이터베이스 백업이 완료되었습니다.", { backupInfo });

      // 오래된 백업 정리
      await this.cleanupOldBackups();
    } catch (error) {
      logger?.error("데이터베이스 백업 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      const backupInfo: BackupInfo = {
        filename: `backup-${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.sql`,
        filepath: "",
        size: 0,
        createdAt: new Date(),
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      logger?.error("백업 실패 정보", { backupInfo });
    }
  }

  /**
   * MySQL 백업 생성
   */
  private async createMySQLBackup(filepath: string): Promise<void> {
    // Edge Runtime에서는 백업 기능 비활성화
    if (!execAsync) {
      throw new Error("백업 기능이 Edge Runtime에서 지원되지 않습니다.");
    }

    const { hostname, port, username, password, pathname } =
      this.parseDatabaseUrl();

    const command = `mysqldump -h ${hostname} -P ${port} -u ${username} -p${password} ${pathname.replace(
      "/",
      ""
    )} > ${filepath}`;

    try {
      const { stdout: stdoutResult, stderr } = await execAsync(command, {
        timeout: 300000,
      }); // 5분 타임아웃

      if (stderr && !stderr.includes("Warning")) {
        throw new Error(`mysqldump stderr: ${stderr}`);
      }

      logger?.debug("mysqldump 실행 완료", {
        stdout: stdoutResult.substring(0, 100),
      });
    } catch (error) {
      throw new Error(
        `MySQL 백업 명령 실행 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 데이터베이스 URL 파싱
   */
  private parseDatabaseUrl(): {
    hostname: string;
    port: string;
    username: string;
    password: string;
    pathname: string;
  } {
    try {
      const url = new URL(this.config.databaseUrl);
      return {
        hostname: url.hostname,
        port: url.port || "3306",
        username: url.username,
        password: url.password,
        pathname: url.pathname,
      };
    } catch (error) {
      throw new Error(`잘못된 데이터베이스 URL: ${this.config.databaseUrl}`);
    }
  }

  /**
   * 백업 디렉토리 생성
   */
  private async ensureBackupDirectory(): Promise<void> {
    try {
      const fs = await import("fs/promises");
      await fs.mkdir(this.config.backupDir, { recursive: true });
    } catch (error) {
      throw new Error(
        `백업 디렉토리 생성 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 파일 크기 조회
   */
  private async getFileSize(filepath: string): Promise<number> {
    try {
      const fs = await import("fs/promises");
      const stats = await fs.stat(filepath);
      return stats.size;
    } catch (error) {
      logger?.warn("파일 크기 조회 실패", {
        filepath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return 0;
    }
  }

  /**
   * 오래된 백업 정리
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      const files = await fs.readdir(this.config.backupDir);
      const backupFiles = files
        .filter((file) => file.startsWith("backup-") && file.endsWith(".sql"))
        .map((file) => ({
          name: file,
          path: path.join(this.config.backupDir, file),
          stats: null as { birthtime: Date } | null,
        }));

      // 파일 정보 수집
      for (const file of backupFiles) {
        try {
          file.stats = await fs.stat(file.path);
        } catch (error) {
          logger?.warn("백업 파일 정보 조회 실패", { file: file.name });
        }
      }

      // 생성일 기준으로 정렬
      backupFiles.sort((a, b) => {
        if (!a.stats || !b.stats) return 0;
        return a.stats.birthtime.getTime() - b.stats.birthtime.getTime();
      });

      // 최대 백업 수를 초과하는 오래된 파일 삭제
      if (backupFiles.length > this.config.maxBackups) {
        const filesToDelete = backupFiles.slice(
          0,
          backupFiles.length - this.config.maxBackups
        );

        for (const file of filesToDelete) {
          try {
            await fs.unlink(file.path);
            logger?.info("오래된 백업 파일 삭제", { file: file.name });
          } catch (error) {
            logger?.error("백업 파일 삭제 실패", {
              file: file.name,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }

      // 보존 기간을 초과하는 파일 삭제
      const cutoffDate = new Date(
        Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000
      );

      for (const file of backupFiles) {
        if (file.stats && file.stats.birthtime < cutoffDate) {
          try {
            await fs.unlink(file.path);
            logger?.info("보존 기간 초과 백업 파일 삭제", {
              file: file.name,
              createdAt: file.stats.birthtime,
              cutoffDate,
            });
          } catch (error) {
            logger?.error("백업 파일 삭제 실패", {
              file: file.name,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }
    } catch (error) {
      logger?.error("백업 정리 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * 백업 복구
   */
  public async restore(backupFile: string): Promise<void> {
    // Edge Runtime에서는 백업 기능 비활성화
    if (!execAsync) {
      throw new Error("백업 기능이 Edge Runtime에서 지원되지 않습니다.");
    }

    try {
      logger?.info("데이터베이스 복구를 시작합니다.", { backupFile });

      const { hostname, port, username, password, pathname } =
        this.parseDatabaseUrl();
      const filepath = `${this.config.backupDir}/${backupFile}`;

      const command = `mysql -h ${hostname} -P ${port} -u ${username} -p${password} ${pathname.replace(
        "/",
        ""
      )} < ${filepath}`;

      const { stderr } = await execAsync(command, { timeout: 600000 }); // 10분 타임아웃

      if (stderr && !stderr.includes("Warning")) {
        throw new Error(`mysql stderr: ${stderr}`);
      }

      logger?.info("데이터베이스 복구가 완료되었습니다.", { backupFile });
    } catch (error) {
      logger?.error("데이터베이스 복구 실패", {
        backupFile,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  /**
   * 백업 목록 조회
   */
  public async listBackups(): Promise<BackupInfo[]> {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      const files = await fs.readdir(this.config.backupDir);
      const backupFiles = files
        .filter((file) => file.startsWith("backup-") && file.endsWith(".sql"))
        .map((file) => ({
          name: file,
          path: path.join(this.config.backupDir, file),
        }));

      const backupInfos: BackupInfo[] = [];

      for (const file of backupFiles) {
        try {
          const stats = await fs.stat(file.path);
          backupInfos.push({
            filename: file.name,
            filepath: file.path,
            size: stats.size,
            createdAt: stats.birthtime,
            status: "success",
          });
        } catch (error) {
          logger?.warn("백업 파일 정보 조회 실패", { file: file.name });
        }
      }

      // 생성일 기준으로 정렬 (최신순)
      backupInfos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return backupInfos;
    } catch (error) {
      logger?.error("백업 목록 조회 실패", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * 백업 상태 확인
   */
  public getStatus(): {
    isRunning: boolean;
    lastBackup?: Date;
    nextBackup?: Date;
  } {
    const status: {
      isRunning: boolean;
      lastBackup?: Date;
      nextBackup?: Date;
    } = { isRunning: this.isRunning };

    if (this.intervalId) {
      // 다음 백업 시간 계산 (대략적)
      status.nextBackup = new Date(Date.now() + this.config.backupInterval);
    }

    return status;
  }
}

// 기본 백업 설정
const defaultBackupConfig: BackupConfig = {
  databaseUrl: process.env.DATABASE_URL || "",
  backupDir: process.env.BACKUP_DIR || "/home/greensupia/backups", // 절대 경로로 변경
  maxBackups: parseInt(process.env.MAX_BACKUPS || "10"),
  backupInterval: parseInt(process.env.BACKUP_INTERVAL || "86400000"), // 24시간
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || "30"),
};

// 전역 백업 매니저 인스턴스
export const backupManager = new BackupManager(defaultBackupConfig);

// Edge Runtime 환경에서는 백업 기능 비활성화
const isEdgeRuntime =
  typeof (globalThis as Record<string, unknown>).EdgeRuntime !== "undefined";

// 프로덕션 환경에서만 자동 시작 (Edge Runtime이 아닌 경우)
if (
  !isEdgeRuntime &&
  process.env.NODE_ENV === "production" &&
  process.env.ENABLE_AUTO_BACKUP === "true"
) {
  backupManager.start();
}
