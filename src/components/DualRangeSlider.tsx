import { useEffect, useRef, useState } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  userAge?: number;
}

export function DualRangeSlider({ min, max, minValue, maxValue, onChange, userAge }: DualRangeSliderProps) {
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const value = Math.round(min + (percentage / 100) * (max - min));

    if (isDraggingMin && value < maxValue) {
      onChange(value, maxValue);
    } else if (isDraggingMax && value > minValue) {
      onChange(minValue, value);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingMin || isDraggingMax) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingMin || isDraggingMax) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingMin, isDraggingMax, minValue, maxValue]);

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Age Range</span>
        <span className="text-purple-600">{minValue} - {maxValue} years old</span>
      </div>

      <div className="relative pt-2 pb-6" ref={sliderRef}>
        {/* Track background */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-lg top-2" />
        
        {/* Active track */}
        <div
          className="absolute h-2 bg-purple-600 rounded-lg top-2"
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />

        {/* Min handle */}
        <div
          className={`absolute w-6 h-6 bg-white border-2 border-purple-600 rounded-full cursor-pointer transform -translate-x-1/2 top-0 transition-transform ${
            isDraggingMin ? 'scale-125' : 'hover:scale-110'
          }`}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={() => setIsDraggingMin(true)}
          onTouchStart={() => setIsDraggingMin(true)}
        >
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-purple-600">
            {minValue}
          </div>
        </div>

        {/* Max handle */}
        <div
          className={`absolute w-6 h-6 bg-white border-2 border-purple-600 rounded-full cursor-pointer transform -translate-x-1/2 top-0 transition-transform ${
            isDraggingMax ? 'scale-125' : 'hover:scale-110'
          }`}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={() => setIsDraggingMax(true)}
          onTouchStart={() => setIsDraggingMax(true)}
        >
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-purple-600">
            {maxValue}
          </div>
        </div>

        {/* User age indicator */}
        {userAge && userAge >= min && userAge <= max && (
          <div
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${getPercentage(userAge)}%` }}
          >
            <div className="w-0.5 h-2 bg-gray-400" />
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-gray-500 whitespace-nowrap">
              You ({userAge})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
