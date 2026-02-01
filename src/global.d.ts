export {};

declare global {
  interface Window {
    deadpdf: {
      openFile: () => Promise<string | null>;
    };
  }
}


