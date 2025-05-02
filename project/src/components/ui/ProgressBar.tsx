import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  colorScale?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  label,
  showValue = false,
  animated = true,
  className = '',
  colorScale = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      // Animate the progress value
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          const increment = value > prev ? Math.max(1, (value - prev) / 10) : Math.min(-1, (value - prev) / 10);
          const newValue = prev + increment;
          
          if ((increment > 0 && newValue >= value) || (increment < 0 && newValue <= value)) {
            clearInterval(interval);
            return value;
          }
          
          return newValue;
        });
      }, 20);
      
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);
  
  const percentage = (displayValue / max) * 100;
  
  // Dynamic color based on value
  const getColor = () => {
    if (!colorScale) return 'bg-blue-500';
    
    if (percentage < 25) return 'bg-green-500';
    if (percentage < 50) return 'bg-blue-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
      <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>{label}</span>}
          {showValue && (
            <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getColor()} rounded-full transition-all ease-out duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;