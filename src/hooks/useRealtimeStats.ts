import { useState, useEffect, useRef } from "react";

interface UseRealtimeStatsOptions {
  intervalMs?: number; // 업데이트 간격 (기본값: 2분)
  enabled?: boolean; // 활성화 여부
}

export function useRealtimeStats<T>(
  fetchFunction: () => Promise<T>,
  options: UseRealtimeStatsOptions = {}
) {
  const { intervalMs = 120000, enabled = true } = options; // 2분 = 120,000ms
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  // 페이지 가시성 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 데이터 가져오기
  const fetchData = async () => {
    if (!enabled || !isVisibleRef.current) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  // 인터벌 설정
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        fetchData();
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
}
