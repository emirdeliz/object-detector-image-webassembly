import { getModuleApi } from './wa';

const loadImage = async (src: string) => {
  // Load image
  const imgBlob = await (await fetch(src)).blob();
  const img = await createImageBitmap(imgBlob);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  return {
    img,
    imgData: ctx?.getImageData(0, 0, img.width, img.height) as ImageData
  }
}

const prepareWasmData = async (imageSrc: string) => { 
  const imgInfo = await loadImage(imageSrc);
  const moduleApi = await getModuleApi();
  const { width, height } = imgInfo.img;
  const { imgData } = imgInfo;
  const pointer = moduleApi.create_buffer(width, height);
  if (( width * height * 4) !== imgData.data.byteLength) {
    throw Error('dataBuf does not match width and height');
  }

  moduleApi.HEAPU8.set(imgData.data.buffer, pointer);
  return pointer;
}

export const processImages = async(imageSrc: string, templateSrc: string) => { 
  const imgPointer = await prepareWasmData(imageSrc);
  const templatePointer = await prepareWasmData(templateSrc);
  const moduleApi = await getModuleApi();

  const length = 4;
  const offset = length * Int8Array.BYTES_PER_ELEMENT;

  const result = new Uint8Array(moduleApi.memory.buffer, 0, 4);
  await moduleApi.detect_image_inside_image(
    imgPointer,
    templatePointer,
    result.byteOffset
  );

  console.log({
    x: moduleApi.HEAP32[0],
    y: moduleApi.HEAP32[1],
    width: moduleApi.HEAP32[2],
    height: moduleApi.HEAP32[3],
  })

  // const resultView = new DataView(moduleApi.memory.buffer);
  // const result = {
  //   x: resultView.getUint8(0),
  //   y: resultView.getUint8(1),
  //   width: resultView.getUint8(2),
  //   height: resultView.getUint8(3),
  // }

  // const resultView = new Uint8Array(moduleApi.HEAP8.buffer, resultPtr, 4);
  // const result = new Uint8Array(resultView);

   // api.encode(p, image.width, image.height, 100);
  // const result = await moduleApi.get_result();
  // const resultSize = moduleApi.get_result_size();
  // const resultView = new Uint8Array(moduleApi.HEAP8.buffer, resultPointer, resultSize);
  // const result = new Uint8Array(resultView);
  // moduleApi.free_result(resultPointer);

  // console.log({
  //   point_0: result[0],
	// 	point_1: result[1],
	// 	point_2: result[2],
  //   point_3: result[3],
  // })

  // console.log(result);

  moduleApi.destroy_buffer(imgPointer);
  moduleApi.destroy_buffer(templatePointer);
  return result;
}