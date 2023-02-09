import { getCInstance, ImageArg } from "./CWasm"



export const convertFileToParameterWasm = async (file: File) => {
  //  const cInstance = await getCInstance();
  //   // copying the uint8ArrData to the heap
  //   const numBytes = uint8ArrData.length * uint8ArrData.BYTES_PER_ELEMENT;
  //   const dataPtr = cInstance.malloc(numBytes);
  //   const dataOnHeap = new Uint8Array(cInstance.HEAPU8.buffer, dataPtr, numBytes);
  //   dataOnHeap.set(uint8ArrData);
  //   // calling the Wasm function
  //   console.log(dataOnHeap.byteOffset);
  //   const res = cInstance.image_input(dataOnHeap.byteOffset, uint8ArrData.length);

  //   Module._free(dataPtr);

  const buffer = await file.arrayBuffer();
  const uint8View = new Uint8Array(buffer);
  return { buffer: uint8View, size: uint8View.byteLength } as ImageArg;
}

export const detectImageInsideImage = async (imageOne: File, imageTwo: File) => { 
  const cInstance = await getCInstance();
  const imageOneUint8Array = await convertFileToParameterWasm(imageOne);
  const imageTwoUint8Array = await convertFileToParameterWasm(imageTwo);


  console.log({
    imageOne,
    imageTwo,
    f:  cInstance.detectImageInsideImage
  })
  return cInstance.detectImageInsideImage(imageOneUint8Array, imageTwoUint8Array);
}