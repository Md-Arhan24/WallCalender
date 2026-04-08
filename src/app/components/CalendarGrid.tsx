import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  selectedRange: { start: Date | null; end: Date | null };
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  notes: Record<string, string>;
  onNoteClick: (date: Date) => void;
  isDark: boolean;
  isMobile?: boolean;
}

export function CalendarGrid({
  currentDate,
  onMonthChange,
  selectedRange,
  onRangeChange,
  notes,
  onNoteClick,
  isDark,
  isMobile = false,
}: CalendarGridProps) {
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isOtherMonth: boolean; isNextMonth: boolean }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startOffset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Monday start
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isOtherMonth: true,
        isNextMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false,
        isNextMonth: false,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOtherMonth: true,
        isNextMonth: true,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const getDayVariant = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (!selectedRange.start) {
      return isToday ? 'today' : 'default';
    }

    const dateTime = date.getTime();
    const startTime = selectedRange.start.getTime();
    const endTime = selectedRange.end?.getTime();

    if (date.toDateString() === selectedRange.start.toDateString()) {
      return 'start';
    }

    if (endTime && date.toDateString() === selectedRange.end?.toDateString()) {
      return 'end';
    }

    if (endTime && dateTime > startTime && dateTime < endTime) {
      return 'inRange';
    }

    return isToday ? 'today' : 'default';
  };

  const getRangePosition = (date: Date): number => {
    if (!selectedRange.start || !selectedRange.end) return 0;

    const dateTime = date.getTime();
    const startTime = selectedRange.start.getTime();
    const endTime = selectedRange.end.getTime();
    const totalRange = endTime - startTime;
    const dateOffset = dateTime - startTime;

    return dateOffset / totalRange;
  };

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getRangeDays = () => {
    if (!selectedRange.start || !selectedRange.end) return 0;
    const diff = selectedRange.end.getTime() - selectedRange.start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const newStart = new Date(value + 'T00:00:00');
      onRangeChange({ start: newStart, end: selectedRange.end });
    } else {
      onRangeChange({ start: null, end: selectedRange.end });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const newEnd = new Date(value + 'T00:00:00');
      if (selectedRange.start && newEnd < selectedRange.start) {
        // If end is before start, swap them
        onRangeChange({ start: newEnd, end: selectedRange.start });
      } else {
        onRangeChange({ start: selectedRange.start, end: newEnd });
      }
    } else {
      onRangeChange({ start: selectedRange.start, end: null });
    }
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex flex-col" style={{ gap: isMobile ? '16px' : '24px' }}>
      {/* Date Range Selectors */}
      <div className="flex gap-3" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <div className="flex-1">
          <label 
            className="block text-xs font-medium mb-1.5" 
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(selectedRange.start)}
              onChange={handleStartDateChange}
              className="w-full rounded-lg px-3 py-2 text-sm border transition-colors"
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                color: isDark ? '#F0F0F0' : '#1A1A1A',
                borderColor: isDark ? '#2A2A2A' : '#E5E7EB',
              }}
            />
            <Calendar 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            />
          </div>
        </div>

        <div className="flex-1">
          <label 
            className="block text-xs font-medium mb-1.5" 
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(selectedRange.end)}
              onChange={handleEndDateChange}
              className="w-full rounded-lg px-3 py-2 text-sm border transition-colors"
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                color: isDark ? '#F0F0F0' : '#1A1A1A',
                borderColor: isDark ? '#2A2A2A' : '#E5E7EB',
              }}
            />
            <Calendar 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            />
          </div>
        </div>

        {(selectedRange.start || selectedRange.end) && (
          <button
            onClick={() => onRangeChange({ start: null, end: null })}
            className="text-sm hover:opacity-70 transition-opacity px-3 py-2 rounded-lg self-end"
            style={{ 
              color: '#6366F1',
              height: 'fit-content',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Range Status */}
      {selectedRange.start && selectedRange.end && (
        <div 
          className="text-sm text-center py-2 px-4 rounded-lg"
          style={{
            backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6',
            color: isDark ? '#9CA3AF' : '#6B7280',
          }}
        >
          {getRangeDays()} days selected
        </div>
      )}

      {/* Month Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors"
          style={{ color: isDark ? '#F0F0F0' : '#1A1A1A' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium" style={{ color: isDark ? '#F0F0F0' : '#1A1A1A' }}>
          {monthName} {year}
        </h2>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-opacity-10 hover:bg-gray-500 rounded-full transition-colors"
          style={{ color: isDark ? '#F0F0F0' : '#1A1A1A' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7" style={{ gap: isMobile ? '2px' : '4px' }}>
        {weekdays.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center text-xs uppercase"
            style={{
              color: isDark ? '#9CA3AF' : '#6B7280',
              height: '32px',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7" style={{ gap: isMobile ? '2px' : '4px' }}>
        {days.map((day, index) => {
          const variant = getDayVariant(day.date);
          const hasNote = !!notes[getDateKey(day.date)];

          // Hide next month days
          if (day.isNextMonth) {
            return (
              <div key={index} className="flex items-center justify-center" style={{ visibility: 'hidden' }}>
                <DayCell
                  day={day.date.getDate()}
                  variant="default"
                  rangePosition={0}
                  hasNote={false}
                  isOtherMonth={true}
                  onClick={() => {}}
                  isMobile={isMobile}
                />
              </div>
            );
          }

          return (
            <div key={index} className="flex items-center justify-center">
              <DayCell
                day={day.date.getDate()}
                variant={day.isOtherMonth ? 'default' : variant}
                rangePosition={getRangePosition(day.date)}
                hasNote={hasNote}
                isOtherMonth={day.isOtherMonth}
                onClick={() => onNoteClick(day.date)}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}