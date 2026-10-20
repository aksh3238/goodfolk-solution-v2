import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface FocusCardGroupContextType {
  focusedIndex: number | null;
  setFocusedIndex: (index: number | null) => void;
}

const FocusCardGroupContext = createContext<FocusCardGroupContextType>({
  focusedIndex: null,
  setFocusedIndex: () => {}
});

interface FocusCardGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FocusCardGroup: React.FC<FocusCardGroupProps> = ({ children, className = '' }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear focus when clicking or tapping outside on mobile/touch
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocusedIndex(null);
      }
    };
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <FocusCardGroupContext.Provider value={{ focusedIndex, setFocusedIndex }}>
      <div
        ref={containerRef}
        onMouseLeave={() => setFocusedIndex(null)}
        className={`relative ${className}`}
      >
        {children}
      </div>
    </FocusCardGroupContext.Provider>
  );
};

interface FocusCardItemProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const FocusCardItem: React.FC<FocusCardItemProps> = ({
  index,
  children,
  className = '',
  onClick
}) => {
  const { focusedIndex, setFocusedIndex } = useContext(FocusCardGroupContext);
  const isFocused = focusedIndex === index;
  const isAnyFocused = focusedIndex !== null;
  const isBlurred = isAnyFocused && !isFocused;

  return (
    <div
      onMouseEnter={() => setFocusedIndex(index)}
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(null)}
      onClick={() => {
        if (focusedIndex === index && onClick) {
          onClick();
        } else {
          setFocusedIndex(index);
          if (onClick) onClick();
        }
      }}
      className={`relative transition-all duration-300 ease-out will-change-transform ${
        isFocused
          ? 'scale-[1.02] sm:scale-[1.025] shadow-2xl z-20 opacity-100 blur-none ring-1 ring-[#173B75]/25'
          : isBlurred
          ? 'opacity-65 scale-[0.99] blur-[0.8px] sm:blur-[1.2px] z-0'
          : 'opacity-100 scale-100 blur-none z-10'
      } motion-reduce:transform-none motion-reduce:filter-none ${className}`}
    >
      {children}
    </div>
  );
};
