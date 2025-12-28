import { useCallback, useRef, useState } from "react";

interface UseSpeechToTextOptions {
  language?: string;
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  error: string | null;
}

/* ============================================================
   WAV CONVERSION HELPERS (PCM16)
   ============================================================ */

// Convert AudioBuffer → WAV (PCM16)
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;

  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  let offset = 0;

  writeString(offset, "RIFF");
  offset += 4;
  view.setUint32(offset, bufferSize - 8, true);
  offset += 4;
  writeString(offset, "WAVE");
  offset += 4;

  writeString(offset, "fmt ");
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2; // PCM
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, byteRate, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;

  writeString(offset, "data");
  offset += 4;
  view.setUint32(offset, dataSize, true);
  offset += 4;

  // Interleave channels
  let pos = offset;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = buffer.getChannelData(ch)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
  }

  return arrayBuffer;
}

// Convert WebM Blob → WAV File
async function convertBlobToWavFile(
  blob: Blob,
  filename = "recording.wav"
): Promise<File> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const wavBuffer = audioBufferToWav(audioBuffer);
  const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

  return new File([wavBlob], filename, { type: "audio/wav" });
}

/* ============================================================
   HOOK
   ============================================================ */

export function useSpeechToText(
  options: UseSpeechToTextOptions = {}
): UseSpeechToTextReturn {
  const { language = "en", onTranscript, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /* ===================== START RECORDING ===================== */

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Mic access failed";
      setError(msg);
      onError?.(msg);
    }
  }, [onError]);

  /* ===================== STOP RECORDING ===================== */

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        try {
          mediaRecorder.stream.getTracks().forEach((t) => t.stop());

          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          console.log("Recorded blob:", audioBlob.type, audioBlob.size);

          const wavFile = await convertBlobToWavFile(audioBlob);

          console.log("Converted WAV:", wavFile.type, wavFile.size);

          const result = await window.puter.ai.speech2txt(wavFile, {
            model: "whisper-1",
            language,
          });

          const text = typeof result === "string" ? result : result.text;

          onTranscript?.(text);
          setIsProcessing(false);
          resolve(text);
        } catch (err) {
          console.error("STT failure:", err);
          const msg =
            err instanceof Error ? err.message : "Transcription failed";
          setError(msg);
          onError?.(msg);
          setIsProcessing(false);
          resolve(null);
        }
      };

      mediaRecorder.stop();
    });
  }, [isRecording, language, onTranscript, onError]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    error,
  };
}
