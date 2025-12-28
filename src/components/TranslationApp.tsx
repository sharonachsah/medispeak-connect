import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecordButton } from '@/components/RecordButton';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { getLanguageByCode } from '@/lib/languages';

// Load Puter.js script
const loadPuterScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Puter.js'));
    document.head.appendChild(script);
  });
};

export function TranslationApp() {
  const { toast } = useToast();
  
  // Language states
  const [providerLang, setProviderLang] = useState('en');
  const [patientLang, setPatientLang] = useState('es');
  
  // Transcript states
  const [providerTranscript, setProviderTranscript] = useState('');
  const [patientTranscript, setPatientTranscript] = useState('');
  
  // Active speaker state
  const [activeSpeaker, setActiveSpeaker] = useState<'provider' | 'patient' | null>(null);
  
  // Puter.js loading state
  const [isPuterLoaded, setIsPuterLoaded] = useState(false);

  // Load Puter.js on mount
  useEffect(() => {
    loadPuterScript()
      .then(() => {
        setIsPuterLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Puter.js:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load speech services. Please refresh the page.',
        });
      });
  }, [toast]);

  // Speech to text hooks
  const providerSTT = useSpeechToText({
    language: providerLang,
    onTranscript: async (text) => {
      setProviderTranscript(text);
      // Auto-translate for patient
      const translated = await translate(text, providerLang, patientLang);
      if (translated) {
        setPatientTranscript(translated);
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description: error,
      });
    },
  });

  const patientSTT = useSpeechToText({
    language: patientLang,
    onTranscript: async (text) => {
      setPatientTranscript(text);
      // Auto-translate for provider
      const translated = await translate(text, patientLang, providerLang);
      if (translated) {
        setProviderTranscript(translated);
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description: error,
      });
    },
  });

  // Text to speech hooks
  const providerTTS = useTextToSpeech({
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: error,
      });
    },
  });

  const patientTTS = useTextToSpeech({
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: error,
      });
    },
  });

  // Translation hook
  const { translate, isTranslating } = useTranslation({
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Translation Error',
        description: error,
      });
    },
  });

  // Handle recording start/stop
  const handleProviderRecord = useCallback(async () => {
    if (providerSTT.isRecording) {
      await providerSTT.stopRecording();
      setActiveSpeaker(null);
    } else {
      // Stop any ongoing recordings
      if (patientSTT.isRecording) {
        await patientSTT.stopRecording();
      }
      setActiveSpeaker('provider');
      await providerSTT.startRecording();
    }
  }, [providerSTT, patientSTT]);

  const handlePatientRecord = useCallback(async () => {
    if (patientSTT.isRecording) {
      await patientSTT.stopRecording();
      setActiveSpeaker(null);
    } else {
      // Stop any ongoing recordings
      if (providerSTT.isRecording) {
        await providerSTT.stopRecording();
      }
      setActiveSpeaker('patient');
      await patientSTT.startRecording();
    }
  }, [providerSTT, patientSTT]);

  // Handle clear session
  const handleClearSession = useCallback(() => {
    setProviderTranscript('');
    setPatientTranscript('');
    providerTTS.stop();
    patientTTS.stop();
    toast({
      title: 'Session Cleared',
      description: 'All transcripts have been deleted.',
    });
  }, [providerTTS, patientTTS, toast]);

  // Handle swap languages
  const handleSwapLanguages = useCallback(() => {
    const tempLang = providerLang;
    setProviderLang(patientLang);
    setPatientLang(tempLang);
    
    const tempTranscript = providerTranscript;
    setProviderTranscript(patientTranscript);
    setPatientTranscript(tempTranscript);
  }, [providerLang, patientLang, providerTranscript, patientTranscript]);

  const providerLanguage = getLanguageByCode(providerLang);
  const patientLanguage = getLanguageByCode(patientLang);

  if (!isPuterLoaded) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">🏥</span>
          </div>
          <p className="text-muted-foreground">Loading speech services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      <Header 
        onClearSession={handleClearSession}
        onSwapLanguages={handleSwapLanguages}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Language selectors - Mobile */}
        <div className="flex items-center justify-center gap-4 mb-6 md:hidden">
          <LanguageSelector
            value={providerLang}
            onChange={setProviderLang}
            variant="provider"
          />
          <LanguageSelector
            value={patientLang}
            onChange={setPatientLang}
            variant="patient"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[calc(100vh-220px)] md:h-[calc(100vh-180px)]">
          {/* Provider Panel */}
          <div className="flex flex-col gap-4">
            {/* Language selector - Desktop */}
            <div className="hidden md:block">
              <LanguageSelector
                value={providerLang}
                onChange={setProviderLang}
                variant="provider"
                label="Provider Language"
              />
            </div>
            
            <TranscriptPanel
              title="Provider"
              subtitle={providerLanguage?.nativeName}
              transcript={providerTranscript}
              variant="provider"
              isSpeaking={providerTTS.isSpeaking}
              isLoading={isTranslating && activeSpeaker === 'patient'}
              onSpeak={() => providerTTS.speak(providerTranscript, providerLang)}
              onStopSpeaking={providerTTS.stop}
            />
            
            {/* Provider Record Button */}
            <div className="flex justify-center py-2">
              <RecordButton
                isRecording={providerSTT.isRecording}
                isProcessing={providerSTT.isProcessing}
                onStart={handleProviderRecord}
                onStop={handleProviderRecord}
                variant="provider"
                disabled={patientSTT.isRecording || patientSTT.isProcessing}
              />
            </div>
          </div>

          {/* Patient Panel */}
          <div className="flex flex-col gap-4">
            {/* Language selector - Desktop */}
            <div className="hidden md:block">
              <LanguageSelector
                value={patientLang}
                onChange={setPatientLang}
                variant="patient"
                label="Patient Language"
              />
            </div>
            
            <TranscriptPanel
              title="Patient"
              subtitle={patientLanguage?.nativeName}
              transcript={patientTranscript}
              variant="patient"
              isSpeaking={patientTTS.isSpeaking}
              isLoading={isTranslating && activeSpeaker === 'provider'}
              onSpeak={() => patientTTS.speak(patientTranscript, patientLang)}
              onStopSpeaking={patientTTS.stop}
            />
            
            {/* Patient Record Button */}
            <div className="flex justify-center py-2">
              <RecordButton
                isRecording={patientSTT.isRecording}
                isProcessing={patientSTT.isProcessing}
                onStart={handlePatientRecord}
                onStop={handlePatientRecord}
                variant="patient"
                disabled={providerSTT.isRecording || providerSTT.isProcessing}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-3">
        <p className="text-center text-xs text-muted-foreground">
          🔒 Stateless & Secure • No data is stored • Clear session anytime
        </p>
      </footer>
    </div>
  );
}
