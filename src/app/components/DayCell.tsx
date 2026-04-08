import { motion } from 'motion/react';

type DayCellVariant = 'default' | 'hovered' | 'today' | 'start' | 'inRange' | 'end' | 'otherMonth' | 'hasNote';

interface DayCellProps {
  day: number;
  variant?: DayCellVariant;
  rangePosition?: number;
  hasNote?: boolean;
  isHoliday?: boolean;
  isOtherMonth?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isMobile?: boolean;
}

export function DayCell({
  day,
  variant = 'default',
  rangePosition = 0,
  hasNote = false,
  isHoliday = false,
  isOtherMonth = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isMobile = false,
}: DayCellProps) {
  const size = isMobile ? 36 : 40;

  const getInRangeColor = (position: number) => {
    if (position <= 0.5) {
      const t = position * 2;
      return `rgb(${34 + (234 - 34) * t}, ${197 + (179 - 197) * t}, ${94 + (8 - 94) * t})`;
    } else {
      const t = (position - 0.5) * 2;
      return `rgb(${234 + (239 - 234) * t}, ${179 + (68 - 179) * t}, ${8 + (68 - 8) * t})`;
    }
  };

  const getStyles = () => {
    let backgroundColor = 'transparent';
    let color = 'inherit';
    let fontWeight = '400';
    let border = 'none';
    let opacity = 1;

    if (isOtherMonth) opacity = 0.4;

    // Holiday overrides everything except otherMonth
    if (isHoliday && !isOtherMonth) {
      return {
        backgroundColor: '#EF4444',
        color: 'white',
        fontWeight: '600',
        border: 'none',
        opacity: 1,
      };
    }

    switch (variant) {
      case 'today':
        border = '2px solid #6366F1';
        break;
      case 'start':
        backgroundColor = '#22C55E';
        color = 'white';
        fontWeight = '500';
        break;
      case 'inRange':
        backgroundColor = getInRangeColor(rangePosition);
        color = 'white';
        fontWeight = '500';
        break;
      case 'end':
        backgroundColor = '#EF4444';
        color = 'white';
        fontWeight = '500';
        break;
    }

    return { backgroundColor, color, fontWeight, border, opacity };
  };

  const styles = getStyles();

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...styles,
      }}
      whileHover={
        variant !== 'inRange' && variant !== 'start' && variant !== 'end' && !isHoliday
          ? { scale: 1.08, backgroundColor: 'rgba(99, 102, 241, 0.12)' }
          : undefined
      }
      transition={{ duration: 0.15 }}
    >
      {day}
      {hasNote && (
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: '6px',
            height: '6px',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
    </motion.button>
  );
}