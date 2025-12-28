import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  variant?: 'provider' | 'patient';
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  isProcessing,
  onStart,
  onStop,
  variant = 'provider',
  disabled = false,
}: RecordButtonProps) {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="relative">
      {/* Pulse animation when recording */}
      {isRecording && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full animate-pulse-ring",
            variant === 'provider' ? "bg-provider/30" : "bg-patient/30"
          )} 
        />
      )}
      
      <Button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        size="icon-xl"
        className={cn(
          "relative rounded-full transition-all duration-300",
          isRecording 
            ? "bg-destructive hover:bg-destructive/90 scale-110" 
            : variant === 'provider' 
              ? "gradient-provider hover:opacity-90" 
              : "gradient-patient hover:opacity-90",
          isProcessing && "opacity-70"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8 fill-current" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>
      
      {/* Status text */}
      <p className={cn(
        "text-center mt-3 text-sm font-medium transition-colors",
        isRecording ? "text-destructive" : "text-muted-foreground"
      )}>
        {isProcessing 
          ? "Processing..." 
          : isRecording 
            ? "Tap to stop" 
            : "Tap to speak"}
      </p>
    </div>
  );
}
