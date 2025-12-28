import { HeartPulse, Shield, Trash2, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onClearSession: () => void;
  onSwapLanguages: () => void;
}

export function Header({ onClearSession, onSwapLanguages }: HeaderProps) {
  return (
    <header className="bg-card border-b shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">
                MediTranslate
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure Healthcare Translation
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSwapLanguages}
              className="gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Swap</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearSession}
              className="gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Session</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
