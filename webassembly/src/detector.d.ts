declare module 'cdetector' {
  export interface ImageArg { 
    buffer: Uint8Array;
    size: number;
  }
  export function detectImageInsideImage(images: Array<ImageArg>): Uint8Array;
 }