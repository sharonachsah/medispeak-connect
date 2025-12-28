import { useState, useCallback } from 'react';

interface UseTranslationOptions {
  onError?: (error: string) => void;
}

interface UseTranslationReturn {
  translate: (text: string, sourceLang: string, targetLang: string) => Promise<string | null>;
  refineTranscript: (text: string) => Promise<string | null>;
  isTranslating: boolean;
  error: string | null;
}

export function useTranslation(options: UseTranslationOptions = {}): UseTranslationReturn {
  const { onError } = options;
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refineTranscript = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) return text;

    try {
      const result = await window.puter.ai.chat([
        {
          role: 'system',
          content: `You are a medical scribe. Your task is to correct any phonetic errors in the following transcript, specifically for medical terminology. For example:
- "Met-form-in" should be "Metformin"
- "a see toe men o fen" should be "Acetaminophen"
- "high per tension" should be "hypertension"
- "die uh beet eez" should be "diabetes"

Only correct obvious phonetic/spelling errors for medical terms. Preserve the original meaning and non-medical words. Return only the corrected text without any explanations.`
        },
        {
          role: 'user',
          content: text
        }
      ], { model: 'gpt-4o-mini' }) as { message?: { content: string }; text?: string };

      return result.message?.content || result.text || text;
    } catch (err) {
      console.error('Failed to refine transcript:', err);
      return text; // Return original text if refinement fails
    }
  }, []);

  const translate = useCallback(async (
    text: string, 
    sourceLang: string, 
    targetLang: string
  ): Promise<string | null> => {
    if (!text.trim()) return null;
    if (sourceLang === targetLang) return text;

    setIsTranslating(true);
    setError(null);

    try {
      // First, refine the transcript for medical terminology
      const refinedText = await refineTranscript(text);

      // Language names for better prompt
      const languageNames: Record<string, string> = {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        pt: 'Portuguese',
        zh: 'Chinese',
        ja: 'Japanese',
        ko: 'Korean',
        ar: 'Arabic',
        hi: 'Hindi',
        ru: 'Russian',
        vi: 'Vietnamese',
        tl: 'Tagalog',
      };

      const sourceLanguage = languageNames[sourceLang] || sourceLang;
      const targetLanguage = languageNames[targetLang] || targetLang;

      const result = await window.puter.ai.chat([
        {
          role: 'system',
          content: `You are a professional medical translator. Your task is to translate medical conversations from ${sourceLanguage} to ${targetLanguage}.

Guidelines:
1. Maintain clinical accuracy - use proper medical terminology in the target language
2. Keep a compassionate and professional tone appropriate for healthcare settings
3. Preserve important medical details like dosages, frequencies, and instructions
4. If a medical term doesn't have a direct translation, use the internationally recognized term
5. Return only the translation without any explanations or notes`
        },
        {
          role: 'user',
          content: refinedText || text
        }
      ], { model: 'gpt-4o-mini' }) as { message?: { content: string }; text?: string };

      setIsTranslating(false);
      return result.message?.content || result.text || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      setIsTranslating(false);
      onError?.(errorMessage);
      return null;
    }
  }, [refineTranscript, onError]);

  return {
    translate,
    refineTranscript,
    isTranslating,
    error,
  };
}
