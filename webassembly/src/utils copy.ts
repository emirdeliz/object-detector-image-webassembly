const api = {
  version: Module.cwrap('version', 'number', []),
  create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
  destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
};

async function loadImage(src: string) {
  // Load image
  const imgBlob = await fetch(src).then((resp) => resp.blob());
  const img = await createImageBitmap(imgBlob);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, img.width, img.height);
}

export const convertFileToParameterWasm = async (imgBlob: Blob) => {
  // const buffer = await file.arrayBuffer();
  // const uint8Arr = new Uint8Array(buffer);

  // const moduleDetectorInstance = await getDetectorModuleInstance();
  // const uint8tPtr = moduleDetectorInstance._malloc(uint8Arr.length);
  // moduleDetectorInstance.HEAPU8.set(uint8Arr, uint8tPtr);
  // return { uint8Arr, uint8tPtr };

  const img = await createImageBitmap(imgBlob);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, img.width, img.height);
}

export const detectImageInsideImage = async (imageOne: Blob, imageTwo: Blob) => {
  const imageOneUint8Array = await convertFileToParameterWasm(imageOne);
  const imageTwoUint8Array = await convertFileToParameterWasm(imageTwo);

  const moduleDetectorInstance = await getDetectorModuleInstance();


  console.log('uint8tPtr', imageOneUint8Array.uint8tPtr);
  console.log('uint8Arr', imageOneUint8Array.uint8Arr[0]);

  const resultPtr = await moduleDetectorInstance._detectImageInsideImage(
    imageOneUint8Array.uint8tPtr,
    imageOneUint8Array.uint8Arr.length,
    imageTwoUint8Array.uint8tPtr,
    imageTwoUint8Array.uint8Arr.length,
  );

  // https://stackoverflow.com/questions/47313403/passing-client-files-to-webassembly-from-the-front-end

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