import { useState, useCallback, useRef } from "react";

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseTextToSpeechReturn {
  speak: (text: string, language?: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  error: string | null;
}

// Language to voice mapping for AWS Polly
const languageVoiceMap: Record<
  string,
  { voice: string; languageCode: string }
> = {
  en: { voice: "Joanna", languageCode: "en-US" },
  es: { voice: "Lucia", languageCode: "es-ES" },
  fr: { voice: "Lea", languageCode: "fr-FR" },
  de: { voice: "Vicki", languageCode: "de-DE" },
  it: { voice: "Bianca", languageCode: "it-IT" },
  pt: { voice: "Vitoria", languageCode: "pt-BR" },
  zh: { voice: "Zhiyu", languageCode: "cmn-CN" },
  ja: { voice: "Mizuki", languageCode: "ja-JP" },
  ko: { voice: "Seoyeon", languageCode: "ko-KR" },
  ar: { voice: "Zeina", languageCode: "ar-XA" },
  hi: { voice: "Aditi", languageCode: "hi-IN" },
  ru: { voice: "Tatyana", languageCode: "ru-RU" },
  vi: { voice: "Joanna", languageCode: "en-US" }, // Fallback to English
  tl: { voice: "Joanna", languageCode: "en-US" }, // Fallback to English (Tagalog)
};

export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const { onStart, onEnd, onError } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // audio element we control, if any
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // if we create an object URL for a Blob, store it so we can revoke later
  const createdObjectUrlRef = useRef<string | null>(null);

  const speak = useCallback(
    async (text: string, language: string = "en") => {
      if (!text.trim()) return;

      try {
        setError(null);
        setIsSpeaking(true);
        onStart?.();

        const voiceSettings =
          languageVoiceMap[language] || languageVoiceMap["en"];

        // Call Puter TTS
        const result = await window.puter.ai.txt2speech(text, {
          provider: "aws-polly",
          voice: voiceSettings.voice,
          engine: "standard",
          language: voiceSettings.languageCode,
        });

        // Normalise possible return values from puter.ai.txt2speech:
        // - HTMLAudioElement (documented)
        // - string (URL)
        // - Blob
        // - { audio: string } or similar object
        let audioEl: HTMLAudioElement;

        if (
          typeof window !== "undefined" &&
          result instanceof (window as any).HTMLAudioElement
        ) {
          // Puter returned a ready-to-use HTMLAudioElement
          audioEl = result as HTMLAudioElement;
        } else if (typeof result === "string") {
          // URL string
          audioEl = new Audio(result);
        } else if (result instanceof Blob) {
          // Blob — create object URL and remember it for cleanup
          const url = URL.createObjectURL(result);
          createdObjectUrlRef.current = url;
          audioEl = new Audio(url);
        } else if (
          result &&
          typeof result === "object" &&
          "audio" in result &&
          typeof (result as any).audio === "string"
        ) {
          audioEl = new Audio((result as any).audio);
        } else {
          // Defensive: log the actual value to help debugging in future
          console.error("Unsupported txt2speech response:", result);
          throw new Error("Unsupported TTS response from Puter");
        }

        // If we received an HTMLAudioElement from Puter it may already have handlers,
        // but we still track it in audioRef for stop() and cleanup.
        audioRef.current = audioEl;

        // Attach events
        audioEl.onended = () => {
          setIsSpeaking(false);
          onEnd?.();

          // Revoke object URL (if we created one)
          if (createdObjectUrlRef.current) {
            try {
              URL.revokeObjectURL(createdObjectUrlRef.current);
            } catch (e) {
              /* ignore */
            }
            createdObjectUrlRef.current = null;
          }
        };

        audioEl.onerror = (e) => {
          console.error("Audio playback error", e);
          const msg = "Failed to play TTS audio";
          setError(msg);
          setIsSpeaking(false);
          onError?.(msg);

          if (createdObjectUrlRef.current) {
            try {
              URL.revokeObjectURL(createdObjectUrlRef.current);
            } catch (e) {
              /* ignore */
            }
            createdObjectUrlRef.current = null;
          }
        };

        // Attempt to play (some browsers require user interaction for auto-play;
        // handle the promise rejection)
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Browser prevented autoplay — mark as error but keep audio element for manual play
            console.warn("Autoplay prevented:", err);
            const msg =
              "Autoplay prevented: user gesture required to play audio";
            setError(msg);
            setIsSpeaking(false);
            onError?.(msg);
          });
        }
      } catch (err) {
        console.error("TTS error:", err);
        const msg =
          err instanceof Error ? err.message : "Text-to-speech failed";
        setError(msg);
        setIsSpeaking(false);
        onError?.(msg);

        // Cleanup any created object URL
        if (createdObjectUrlRef.current) {
          try {
            URL.revokeObjectURL(createdObjectUrlRef.current);
          } catch (e) {
            /* ignore */
          }
          createdObjectUrlRef.current = null;
        }
      }
    },
    [onStart, onEnd, onError]
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
      // If we created an object URL, revoke it
      if (createdObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(createdObjectUrlRef.current);
        } catch (e) {
          /* ignore */
        }
        createdObjectUrlRef.current = null;
      }
      // If the audio element was returned by Puter (and not created by us),
      // we do not remove its src; just clear our reference.
      try {
        audioRef.current.src = "";
      } catch (e) {
        /* ignore */
      }
      audioRef.current = null;
    }
    setIsSpeaking(false);
    onEnd?.();
  }, [onEnd]);

  return {
    speak,
    stop,
    isSpeaking,
    error,
  };
}
