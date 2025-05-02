import React, { useState, useRef } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-1 ml-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-1 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-1 mr-1'
  };
  
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };
  
  return (
    <div className="relative inline-block">
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave
      })}
      
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white 
            rounded shadow-lg opacity-95 max-w-xs w-max
            transition-opacity duration-150 ${positionStyles[position]}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' :
              position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
              'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;