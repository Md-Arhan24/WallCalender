import { useState } from 'react';
import { Camera, Pencil } from 'lucide-react';

interface HeroImageProps {
  imageUrl: string;
  onImageChange?: (url: string) => void;
  quote: string;
  onQuoteChange: (quote: string) => void;
  isDark: boolean;
}

export function HeroImage({ imageUrl, onImageChange, quote, onQuoteChange, isDark }: HeroImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image Container */}
      <div
        className="relative w-full h-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imageUrl}
          alt="Hero"
          className="w-full h-full object-cover transition-opacity duration-400"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Bottom Gradient */}
        <div 
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))',
          }}
        />
      </div>

      {/* able to write a quote */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div
          className="relative rounded-xl p-4 px-5"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            border: isEditingQuote ? '1px dashed rgba(255, 255, 255, 0.4)' : 'none',
          }}
        >
          {/* to edit quote */}
          <button
            onClick={() => setIsEditingQuote(!isEditingQuote)}
            className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-3.5 h-3.5 text-white" />
          </button>

          {isEditingQuote ? (
            <textarea
              value={quote}
              onChange={(e) => onQuoteChange(e.target.value)}
              onBlur={() => setIsEditingQuote(false)}
              className="w-full bg-transparent text-white italic text-lg leading-relaxed border-none outline-none resize-none"
              style={{ lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif' }}
              rows={3}
              autoFocus
            />
          ) : (
            <p className="text-white italic text-lg leading-relaxed pr-8" style={{ lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif' }}>
              {quote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}