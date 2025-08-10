"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // 애니메이션 지속 시간 (ms)
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 1000,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsUpdating(true);
      const startValue = prevValueRef.current;
      const endValue = value;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuart 이징 함수
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        const currentValue = Math.round(
          startValue + (endValue - startValue) * easeProgress
        );
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsUpdating(false);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      prevValueRef.current = value;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={`${className} ${isUpdating ? "updating" : ""}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}
