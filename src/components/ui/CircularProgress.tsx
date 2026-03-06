import React from 'react';
import { cn } from '../../lib/utils';

interface CircularProgressProps {
  value: number;
  color?: string;
  trackColor?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function CircularProgress({ 
  value, 
  color = "text-indigo-900", 
  trackColor = "text-indigo-100",
  className,
  size = 220,
  strokeWidth = 14,
  children
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(value, 100);
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={cn(trackColor, "stroke-current")}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
        />
        <circle
          className={cn(color, "stroke-current transition-all duration-1000 ease-out")}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
