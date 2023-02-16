export const convertFileToParameterWasm = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const uint8Arr = new Uint8Array(buffer);

  const moduleDetectorInstance = await getDetectorModuleInstance();
  const uint8tPtr = moduleDetectorInstance._malloc(uint8Arr.length);
  moduleDetectorInstance.HEAPU32.set(uint8Arr, uint8tPtr);
  return { uint8Arr, uint8tPtr };
}

export const detectImageInsideImage = async (imageOne: File, imageTwo: File) => {
  const imageOneUint8Array = await convertFileToParameterWasm(imageOne);
  const imageTwoUint8Array = await convertFileToParameterWasm(imageTwo);

  const moduleDetectorInstance = await getDetectorModuleInstance();


  console.log('uint8tPtr', imageOneUint8Array.uint8tPtr);
  console.log('uint8Arr.length', imageOneUint8Array.uint8Arr.length);

  const resultPtr = await moduleDetectorInstance._detectImageInsideImage(
    imageOneUint8Array.uint8tPtr,
    imageOneUint8Array.uint8Arr.length,
    imageTwoUint8Array.uint8tPtr,
    imageTwoUint8Array.uint8Arr.length,
  );

  // const returnArr = new Uint8Array(imageTwoUint8Array.uint8Arr.length);
  // //If returnArr is std::vector<uint8_t>, then is probably similar to 
  // //returnArr.assign(ptr, ptr + dataSize)
  // returnArr.set(moduleDetectorInstance.HEAPU8.subarray(imageTwoUint8Array.uint8tPtr, 4));
  // moduleDetectorInstance._free(imageTwoUint8Array.uint8tPtr);

  // const n = 64;
  // const output = new Uint8Array(moduleDetectorInstance.HEAP8, 0, 4);
  // const js_array = output.subarray(0, 4);
  // console.log({
  //   moduleDetectorInstance,
  //   output,
  // })

  console.log({
    moduleDetectorInstance,
  })

  return resultPtr;
}

export const getDetectorModuleInstance = async () => {
  if (!globalThis.moduleDetectorInstance) { 
    globalThis.moduleDetectorInstance = await globalThis.createDetectorModule();
  }
  return globalThis.moduleDetectorInstance;
}


// const bin = ...; // WebAssembly binary, I assume below that it imports a memory from module "imports", field "memory".
// const module = new WebAssembly.Module(bin);
// const memory = new WebAssembly.Memory({ initial: 2 }); // Size is in pages.
// const instance = new WebAssembly.Instance(module, { imports: { memory: memory } });
// const arrayBuffer = memory.buffer;
// const buffer = new Uint8Array(arrayBuffer);