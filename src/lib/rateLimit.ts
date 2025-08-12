interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry: number;
}

export class RateLimiter {
  private requests = new Map<string, RateLimitRecord>();
  private readonly WINDOW_MS = 60000; // 1분
  private readonly MAX_REQUESTS = 100; // 1분당 최대 요청 수
  private readonly BLOCK_DURATION = 300000; // 5분 차단

  /**
   * 요청이 허용되는지 확인
   */
  isAllowed(ip: string, customLimit?: number, customWindow?: number): boolean {
    const limit = customLimit || this.MAX_REQUESTS;
    const windowMs = customWindow || this.WINDOW_MS;
    const now = Date.now();

    const record = this.requests.get(ip);

    // IP가 차단된 상태인지 확인
    if (record?.blocked && now < record.blockExpiry) {
      return false;
    }

    // 차단이 만료되었으면 차단 상태 해제
    if (record?.blocked && now >= record.blockExpiry) {
      record.blocked = false;
      record.count = 0;
    }

    // 새로운 IP이거나 윈도우가 리셋된 경우
    if (!record || now > record.resetTime) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
        blockExpiry: 0,
      });
      return true;
    }

    // 요청 수가 제한을 초과한 경우
    if (record.count >= limit) {
      // IP 차단
      record.blocked = true;
      record.blockExpiry = now + this.BLOCK_DURATION;
      return false;
    }

    // 요청 수 증가
    record.count++;
    return true;
  }

  /**
   * IP의 현재 상태 정보 반환
   */
  getStatus(ip: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
    blockExpiry: number;
  } | null {
    const record = this.requests.get(ip);
    if (!record) {
      return {
        allowed: true,
        remaining: this.MAX_REQUESTS,
        resetTime: Date.now() + this.WINDOW_MS,
        blocked: false,
        blockExpiry: 0,
      };
    }

    const now = Date.now();
    const isBlocked = record.blocked && now < record.blockExpiry;

    return {
      allowed: !isBlocked && record.count < this.MAX_REQUESTS,
      remaining: Math.max(0, this.MAX_REQUESTS - record.count),
      resetTime: record.resetTime,
      blocked: isBlocked,
      blockExpiry: record.blockExpiry,
    };
  }

  /**
   * IP 차단 해제
   */
  unblock(ip: string): boolean {
    const record = this.requests.get(ip);
    if (record) {
      record.blocked = false;
      record.blockExpiry = 0;
      record.count = 0;
      return true;
    }
    return false;
  }

  /**
   * 오래된 레코드 정리 (메모리 누수 방지)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [ip, record] of this.requests.entries()) {
      if (now > record.resetTime + this.BLOCK_DURATION) {
        this.requests.delete(ip);
      }
    }
  }

  /**
   * 통계 정보 반환
   */
  getStats(): {
    totalIPs: number;
    blockedIPs: number;
    activeIPs: number;
  } {
    const now = Date.now();
    let blockedCount = 0;
    let activeCount = 0;

    for (const record of this.requests.values()) {
      if (record.blocked && now < record.blockExpiry) {
        blockedCount++;
      }
      if (now <= record.resetTime) {
        activeCount++;
      }
    }

    return {
      totalIPs: this.requests.size,
      blockedIPs: blockedCount,
      activeIPs: activeCount,
    };
  }
}

// 전역 인스턴스 생성
export const rateLimiter = new RateLimiter();

// 정기적인 정리 작업 (10분마다)
if (typeof window === "undefined") {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 600000);
}
