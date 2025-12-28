// Puter.js type declarations
interface PuterChatResponse {
  message?: {
    content: string;
  };
  text?: string;
}

declare global {
  interface Window {
    puter: {
      ai: {
        speech2txt: (
          source: string | File | Blob,
          options?: {
            model?: string;
            translate?: boolean;
            response_format?: string;
            language?: string;
            prompt?: string;
            test_mode?: boolean;
          }
        ) => Promise<{ text: string } | string>;
        txt2speech: (
          text: string,
          options?: {
            provider?: 'aws-polly' | 'openai' | 'elevenlabs';
            model?: string;
            voice?: string;
            engine?: string;
            language?: string;
            instructions?: string;
            response_format?: string;
            test_mode?: boolean;
          }
        ) => Promise<HTMLAudioElement>;
        chat: (
          messages: string | Array<{ role: string; content: string }>,
          options?: {
            model?: string;
            stream?: boolean;
          }
        ) => Promise<PuterChatResponse>;
      };
    };
  }
}

export {};
