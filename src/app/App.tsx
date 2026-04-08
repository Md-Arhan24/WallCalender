import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { HeroImage } from './components/HeroImage';
import { CalendarGrid } from './components/CalendarGrid';
import { NotesPopup } from './components/NotesPopup';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [holidays, setHolidays] = useState<Record<string, boolean>>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [quote, setQuote] = useState(() => {
    const saved = localStorage.getItem('quote');
    return saved || 'The days are long, but the years are short. Make each moment count.';
  });

  const [heroImage, setHeroImage] = useState('/tuf.jpg');
  const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Save quote to localStorage
  useEffect(() => {
    localStorage.setItem('quote', quote);
  }, [quote]);

  // Save holidays to localStorage
  useEffect(() => {
    localStorage.setItem('holidays', JSON.stringify(holidays));
  }, [holidays]);

  const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const handleToggleHoliday = (date: Date) => {
    const key = getDateKey(date);
    setHolidays(prev => ({ ...prev, [key]: !prev[key] }));
    setSelectedDateForNote(null);
  };

  const handleRangeChange = (range: { start: Date | null; end: Date | null }) => {
    setSelectedRange(range);
  };

  const handleNoteClick = (date: Date) => {
    setSelectedDateForNote(date);
  };

  const handleNoteSave = (note: string) => {
    if (selectedDateForNote) {
      const key = getDateKey(selectedDateForNote);
      if (note.trim()) {
        setNotes({ ...notes, [key]: note });
      } else {
        const newNotes = { ...notes };
        delete newNotes[key];
        setNotes(newNotes);
      }
    }
  };

  const bgColor = isDark ? '#121212' : '#F8F8F6';
  const textColor = isDark ? '#F0F0F0' : '#1A1A1A';

  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      {isMobile ? (
        /* Mobile Layout */
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Hero Image */}
          <div style={{ height: '35vh', minHeight: '35vh' }}>
            <HeroImage
              imageUrl={heroImage}
              onImageChange={setHeroImage}
              quote={quote}
              onQuoteChange={setQuote}
              isDark={isDark}
            />
          </div>

          {/* Calendar Section */}
          <div className="flex-1 p-6">
            <CalendarGrid
              currentDate={currentDate}
              onMonthChange={setCurrentDate}
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
              notes={notes}
              holidays={holidays}
              onNoteClick={handleNoteClick}
              isDark={isDark}
              isMobile={true}
            />

            {/* Notes Popup - Bottom Sheet Style */}
            {selectedDateForNote && (
              <div
                className="fixed inset-0 bg-black/40 flex items-end z-40"
                onClick={() => setSelectedDateForNote(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full"
                  style={{ borderRadius: '16px 16px 0 0' }}
                >
                  <NotesPopup
                    date={selectedDateForNote}
                    note={notes[getDateKey(selectedDateForNote)] || ''}
                    isHoliday={!!holidays[getDateKey(selectedDateForNote)]}
                    onToggleHoliday={() => handleToggleHoliday(selectedDateForNote)}
                    onSave={handleNoteSave}
                    onClose={() => setSelectedDateForNote(null)}
                    isDark={isDark}
                    isMobile={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex h-full">
          {/* Left Column - Hero Image (40%) */}
          <div className="w-[40%] h-full">
            <HeroImage
              imageUrl={heroImage}
              onImageChange={setHeroImage}
              quote={quote}
              onQuoteChange={setQuote}
              isDark={isDark}
            />
          </div>

          {/* Right Column - Calendar (60%) */}
          <div className="w-[60%] h-full flex items-center justify-center p-12 relative">
            <div className="max-w-xl w-full">
              <CalendarGrid
                currentDate={currentDate}
                onMonthChange={setCurrentDate}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
                notes={notes}
                holidays={holidays}
                onNoteClick={handleNoteClick}
                isDark={isDark}
                isMobile={false}
              />
            </div>

            {/* Notes Popup - Centered */}
            {selectedDateForNote && (
              <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
                onClick={() => setSelectedDateForNote(null)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <NotesPopup
                    date={selectedDateForNote}
                    note={notes[getDateKey(selectedDateForNote)] || ''}
                    isHoliday={!!holidays[getDateKey(selectedDateForNote)]}
                    onToggleHoliday={() => handleToggleHoliday(selectedDateForNote)}
                    onSave={handleNoteSave}
                    onClose={() => setSelectedDateForNote(null)}
                    isDark={isDark}
                    isMobile={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}