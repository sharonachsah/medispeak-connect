import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TranscriptPanelProps {
  title: string;
  subtitle?: string;
  transcript: string;
  variant: 'provider' | 'patient';
  isSpeaking?: boolean;
  isLoading?: boolean;
  onSpeak?: () => void;
  onStopSpeaking?: () => void;
  showSpeakButton?: boolean;
}

export function TranscriptPanel({
  title,
  subtitle,
  transcript,
  variant,
  isSpeaking = false,
  isLoading = false,
  onSpeak,
  onStopSpeaking,
  showSpeakButton = true,
}: TranscriptPanelProps) {
  return (
    <div 
      className={cn(
        "flex flex-col h-full rounded-xl border overflow-hidden transition-all",
        variant === 'provider' 
          ? "bg-provider-muted border-provider/20" 
          : "bg-patient-muted border-patient/20"
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          "px-4 py-3 flex items-center justify-between border-b",
          variant === 'provider' 
            ? "border-provider/20" 
            : "border-patient/20"
        )}
      >
        <div>
          <h3 className={cn(
            "font-display font-semibold",
            variant === 'provider' ? "text-provider" : "text-patient"
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {showSpeakButton && transcript && (
          <Button
            size="icon"
            variant="ghost"
            onClick={isSpeaking ? onStopSpeaking : onSpeak}
            disabled={isLoading}
            className={cn(
              "transition-colors",
              isSpeaking && (variant === 'provider' ? "text-provider" : "text-patient")
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Translating...</span>
            </div>
          </div>
        ) : transcript ? (
          <p className="text-foreground leading-relaxed animate-fade-in">
            {transcript}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm italic text-center mt-8">
            {variant === 'provider' 
              ? "Speak to start transcription..." 
              : "Translation will appear here..."}
          </p>
        )}
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className={cn(
          "px-4 py-2 border-t flex items-center gap-2",
          variant === 'provider' 
            ? "border-provider/20 bg-provider/5" 
            : "border-patient/20 bg-patient/5"
        )}>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-4 rounded-full animate-wave",
                  variant === 'provider' ? "bg-provider" : "bg-patient"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="text-xs font-medium">
            Speaking...
          </span>
        </div>
      )}
    </div>
  );
}
