// Global type declaration for puter.js (https://js.puter.com/v2/)
declare global {
  const puter: {
    ai: {
      txt2img: (
        prompt: string,
        options?: {
          model?: string;
          testMode?: boolean;
        }
      ) => Promise<HTMLImageElement>;
      chat: (
        prompt: string,
        options?: {
          model?: string;
        }
      ) => Promise<{ message: { content: string } }>;
    };
  };
}

export {};
