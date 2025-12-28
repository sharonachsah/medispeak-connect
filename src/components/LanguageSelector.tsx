import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/languages';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  variant?: 'provider' | 'patient';
  label?: string;
}

export function LanguageSelector({ 
  value, 
  onChange, 
  variant = 'provider',
  label 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
          "bg-card hover:bg-secondary/50 min-w-[140px] justify-between",
          isOpen && "ring-2 ring-ring ring-offset-2",
          variant === 'provider' && "border-provider/30",
          variant === 'patient' && "border-patient/30"
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{selectedLanguage?.flag}</span>
          <span className="text-sm font-medium">{selectedLanguage?.name}</span>
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-56 bg-card border rounded-lg shadow-elevated overflow-hidden animate-fade-in">
          <div className="max-h-64 overflow-y-auto p-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onChange(language.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                  "hover:bg-secondary/80",
                  value === language.code && "bg-secondary"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{language.name}</div>
                  <div className="text-xs text-muted-foreground">{language.nativeName}</div>
                </div>
                {value === language.code && (
                  <Check className={cn(
                    "w-4 h-4",
                    variant === 'provider' ? "text-provider" : "text-patient"
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
