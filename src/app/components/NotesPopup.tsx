import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface NotesPopupProps {
  date: Date | null;
  note: string;
  isHoliday: boolean;
  onToggleHoliday: () => void;
  onSave: (note: string) => void;
  onClose: () => void;
  isDark: boolean;
  isMobile?: boolean;
}

export function NotesPopup({
  date,
  note,
  isHoliday,
  onToggleHoliday,
  onSave,
  onClose,
  isDark,
  isMobile = false,
}: NotesPopupProps) {
  const [currentNote, setCurrentNote] = useState(note);

  if (!date) return null;

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSave = () => {
    onSave(currentNote);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="rounded-2xl shadow-lg"
        style={{
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          width: isMobile ? '100%' : '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: isDark ? '#2A2A2A' : '#E5E7EB' }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: isDark ? '#F0F0F0' : '#1A1A1A' }}
          >
            {formattedDate}
          </span>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-lg p-2 text-sm resize-none outline-none"
            style={{
              border: `0.5px solid ${isDark ? '#2A2A2A' : '#E5E7EB'}`,
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
              color: isDark ? '#F0F0F0' : '#1A1A1A',
              lineHeight: '1.7',
            }}
            rows={4}
            autoFocus
          />
        </div>

        {/* Buttons */}
        <div className="p-4 pt-0 flex flex-col gap-2">
          <button
            onClick={onToggleHoliday}
            className="w-full rounded-lg font-medium text-sm transition-colors cursor-pointer"
            style={{
              backgroundColor: isHoliday ? (isDark ? '#2A2A2A' : '#F3F4F6') : '#EF4444',
              color: isHoliday ? (isDark ? '#F0F0F0' : '#1A1A1A') : '#FFFFFF',
              height: '32px',
              border: isHoliday ? `1px solid ${isDark ? '#3A3A3A' : '#E5E7EB'}` : 'none',
            }}
          >
            {isHoliday ? 'Unmark Holiday' : 'Mark as Holiday'}
          </button>

          <button
            onClick={handleSave}
            className="w-full rounded-lg text-white font-medium text-sm transition-colors cursor-pointer"
            style={{ backgroundColor: '#22C55E', height: '32px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#16A34A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#22C55E'; }}
          >
            Save Note
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}