import { getModuleApi } from './wa';

export const fdSeek = () => {
  return 70;
}

export const fdClose = () => { }

export const fdWrite = async (
	_fd: number,
	iov: number,
	iovcnt: number,
	pnum: number
): Promise<number> => {
	const moduleApi = await getModuleApi();
	const { HEAP32 } = moduleApi;
	let num = 0;
	for (let i = 0; i < iovcnt; i++) {
		const len = HEAP32[(iov + 4) >> 2];
		iov += 8;
		num += len;
	}
	HEAP32[pnum >> 2] = num;
	return 0;
};

export const emscriptenResizeHeap = async (
	requestedSize: number
) => {
	const moduleApi = await getModuleApi();
	const oldSize = moduleApi.HEAPU8.length;
	requestedSize = requestedSize >>> 0;

	const maxHeapSize = 2147483648;
	if (requestedSize > maxHeapSize) {
		return false;
	}
	for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
		let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
		overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);

		const newSize = Math.min(
			maxHeapSize,
			alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
		);
		const replacement = await emscriptenReallocBuffer(newSize);
		if (replacement) {
			return true;
		}
	}
	return false;
};

const alignUp = (x: number, multiple: number): number => {
	if (x % multiple > 0) {
		x += multiple - (x % multiple);
	}
	return x;
};

const emscriptenReallocBuffer = async (size: number) => {
	try {
		const moduleApi = await getModuleApi();
		const { buffer, memory } = moduleApi;
		memory.grow((size - buffer.byteLength + 65535) >>> 16);
		updateGlobalBufferAndViews(memory.buffer);
		return 1;
	} catch (e) {
		console.error(e);
	}
};

export const updateGlobalBufferAndViews = async (buffer: ArrayBuffer) => {
  const moduleApi = await getModuleApi();
  moduleApi['buffer'] = buffer;
	moduleApi['HEAP8'] = new Int8Array(buffer);
	moduleApi['HEAP16'] = new Int16Array(buffer);
	moduleApi['HEAP32'] = new Int32Array(buffer);
	moduleApi['HEAPU8'] = new Uint8Array(buffer);
	moduleApi['HEAPU16'] = new Uint16Array(buffer);
	moduleApi['HEAPU32'] = new Uint32Array(buffer);
	moduleApi['HEAPF32'] = new Float32Array(buffer);
	moduleApi['HEAPF64'] = new Float64Array(buffer);
};