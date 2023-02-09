import * as detector from 'detector';

export const convertFileToParameterWasm = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const uint8View = new Uint8Array(buffer);
  return { buffer: uint8View, size: uint8View.byteLength } as detector.ImageArg;
}

export const detectImage = async (imageOne: File, imageTwo: File) => { 
  const imageOneUint8Array = await convertFileToParameterWasm(imageOne);
  const imageTwoUint8Array = await convertFileToParameterWasm(imageTwo);

  console.log({
    imageOne,
    imageTwo,
  })
  return detector.detectImageInsideImage([
    imageOneUint8Array,
    imageTwoUint8Array,
  ]);
}