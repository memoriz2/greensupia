export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  meta?: Record<string, unknown>;
  error?: Error;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  logFilePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  private constructor() {
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableConsole: true,
      enableFile: process.env.NODE_ENV === "production",
      logFilePath: process.env.LOG_FILE_PATH || "./logs/app.log",
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    switch (level) {
      case "debug":
        return LogLevel.DEBUG;
      case "info":
        return LogLevel.INFO;
      case "warn":
        return LogLevel.WARN;
      case "error":
        return LogLevel.ERROR;
      case "fatal":
        return LogLevel.FATAL;
      default:
        return process.env.NODE_ENV === "production"
          ? LogLevel.INFO
          : LogLevel.DEBUG;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const context = entry.context ? `[${entry.context}]` : "";
    const requestId = entry.requestId ? `[${entry.requestId}]` : "";
    const userId = entry.userId ? `[User:${entry.userId}]` : "";

    let logMessage = `${timestamp} ${level} ${context}${requestId}${userId} ${entry.message}`;

    if (entry.meta && Object.keys(entry.meta).length > 0) {
      logMessage += ` ${JSON.stringify(entry.meta)}`;
    }

    if (entry.error) {
      logMessage += `\nError: ${entry.error.message}\nStack: ${entry.error.stack}`;
    }

    return logMessage;
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.config.enableFile || !this.config.logFilePath) return;

    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      // 로그 디렉토리 생성
      const logDir = path.dirname(this.config.logFilePath);
      await fs.mkdir(logDir, { recursive: true });

      const logLine = this.formatLogEntry(entry) + "\n";
      await fs.appendFile(this.config.logFilePath, logLine);

      // 파일 크기 체크 및 로테이션
      await this.rotateLogFileIfNeeded();
    } catch (error) {
      console.error("로그 파일 쓰기 실패:", error);
    }
  }

  private async rotateLogFileIfNeeded(): Promise<void> {
    if (!this.config.logFilePath) return;

    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      const stats = await fs.stat(this.config.logFilePath);

      if (stats.size > this.config.maxFileSize!) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const ext = path.extname(this.config.logFilePath);
        const base = path.basename(this.config.logFilePath, ext);
        const newName = `${base}.${timestamp}${ext}`;
        const newPath = path.join(
          path.dirname(this.config.logFilePath),
          newName
        );

        await fs.rename(this.config.logFilePath, newPath);

        // 오래된 로그 파일 정리
        await this.cleanupOldLogFiles();
      }
    } catch (error) {
      console.error("로그 파일 로테이션 실패:", error);
    }
  }

  private async cleanupOldLogFiles(): Promise<void> {
    if (!this.config.logFilePath) return;

    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      const logDir = path.dirname(this.config.logFilePath);
      const base = path.basename(
        this.config.logFilePath,
        path.extname(this.config.logFilePath)
      );
      const ext = path.extname(this.config.logFilePath);

      const files = await fs.readdir(logDir);
      const logFiles = files
        .filter(
          (file) =>
            file.startsWith(base) &&
            file.endsWith(ext) &&
            file !== path.basename(this.config.logFilePath!)
        )
        .sort()
        .reverse();

      // 최대 파일 수를 초과하는 오래된 파일 삭제
      if (logFiles.length > this.config.maxFiles!) {
        const filesToDelete = logFiles.slice(this.config.maxFiles!);
        for (const file of filesToDelete) {
          await fs.unlink(path.join(logDir, file));
        }
      }
    } catch (error) {
      console.error("오래된 로그 파일 정리 실패:", error);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      meta,
    };

    // 콘솔 출력
    if (this.config.enableConsole) {
      const formattedMessage = this.formatLogEntry(entry);
      switch (level) {
        case LogLevel.DEBUG:
        case LogLevel.INFO:
          console.log(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage);
          break;
      }
    }

    // 파일 출력 (비동기)
    if (this.config.enableFile) {
      this.writeToFile(entry).catch(console.error);
    }

    // 버퍼에 저장 (메모리 기반 로그)
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  public fatal(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, meta);
  }

  // HTTP 요청 로깅을 위한 편의 메서드
  public logRequest(
    req: {
      method: string;
      url: string;
      ip?: string;
      headers?: Record<string, string>;
    },
    meta?: Record<string, unknown>
  ): void {
    const requestMeta = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.headers?.["x-forwarded-for"] || "unknown",
      userAgent: req.headers?.["user-agent"] || "unknown",
      ...meta,
    };

    this.info(`${req.method} ${req.url}`, requestMeta);
  }

  public logError(
    error: Error,
    context?: string,
    meta?: Record<string, unknown>
  ): void {
    const errorMeta = {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...meta,
    };

    this.error(
      `Error in ${context || "unknown context"}: ${error.message}`,
      errorMeta
    );
  }

  // 로그 버퍼 조회
  public getRecentLogs(limit: number = 50): LogEntry[] {
    return this.logBuffer.slice(-limit);
  }

  // 로그 레벨 변경
  public setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }

  // 설정 변경
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 전역 인스턴스
export const logger = Logger.getInstance();

// 편의 함수들
export const logDebug = (message: string, meta?: Record<string, unknown>) =>
  logger.debug(message, meta);
export const logInfo = (message: string, meta?: Record<string, unknown>) =>
  logger.info(message, meta);
export const logWarn = (message: string, meta?: Record<string, unknown>) =>
  logger.warn(message, meta);
export const logError = (message: string, meta?: Record<string, unknown>) =>
  logger.error(message, meta);
export const logFatal = (message: string, meta?: Record<string, unknown>) =>
  logger.fatal(message, meta);
