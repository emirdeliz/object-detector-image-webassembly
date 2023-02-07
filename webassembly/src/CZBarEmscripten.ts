/**
 * All method of this file was used internally by emscripten. Avoid to edit them.
 */
import { checkIsNodeEnvironment } from '@/helpers';
import { getCZBarInstance } from './CZBarWasm';

/**
 * This method get the clock time in milliseconds. Used internally by emscripten.
 * @param clkId - The clock type.
 * @param {number} tp - The timepoint.
 * @returns {Promise<number>} - Always 0;
 */
export const clockGetTime = async (
	clkId: number,
	tp: number
): Promise<number> => {
	const { HEAP32 } = await getCZBarInstance();
	let now: number;
	let emscriptenGetNow: () => number;
	if (checkIsNodeEnvironment()) {
		emscriptenGetNow = () => {
			const t = process['hrtime']();
			return t[0] * 1e3 + t[1] / 1e6;
		};
	} else {
		emscriptenGetNow = () => performance.now();
	}

	if (clkId === 0) {
		now = Date.now();
	} else if (clkId === 1 || clkId === 4) {
		now = emscriptenGetNow();
	} else {
		return -1;
	}
	HEAP32[tp >> 2] = (now / 1e3) | 0;
	HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
	return 0;
};

/**
 * This method write the data to the memory. Used internally by emscripten.
 * @param {number} _fd - The file descriptor.
 * @param {number} iov - The data to write.
 * @param {number} iovcnt - The number of data to write.
 * @param {number} pnum - The number of bytes written.
 * @returns {Promise<number>} Always 0.
 */
export const fdWrite = async (
	_fd: number,
	iov: number,
	iovcnt: number,
	pnum: number
): Promise<number> => {
	const { HEAP32 } = await getCZBarInstance();
	let num = 0;
	for (let i = 0; i < iovcnt; i++) {
		const len = HEAP32[(iov + 4) >> 2];
		iov += 8;
		num += len;
	}
	HEAP32[pnum >> 2] = num;
	return 0;
};

/**
 * This method realloc the webassembly memory. Used internally by emscripten.
 * @param {number} size - The size of the new memory.
 * @returns {Promise<number>} Always 1.
 */
const emscriptenReallocBuffer = async (size: number): Promise<number> => {
	try {
		const { buffer, memory } = await getCZBarInstance();
		memory.grow((size - buffer.byteLength + 65535) >>> 16);
		updateGlobalBufferAndViews(memory.buffer);
		return 1;
	} catch (e) {
		console.error(e);
	}
};

/**
 * This method align the memory size. Used internally by emscripten.
 * @param {number} x - The x coordinate.
 * @param {number} multiple - The multiple.
 * @returns {number} - The aligned value.
 */
const alignUp = (x: number, multiple: number): number => {
	if (x % multiple > 0) {
		x += multiple - (x % multiple);
	}
	return x;
};

/**
 * This method copy the webassembly memory. Used internally by emscripten.
 * @param {number} dest - The destination.
 * @param {number} src - The source.
 * @param {number} num - The number of bytes to copy.
 * @returns {Promise<void>} - No return.
 */
export const emscriptenMemcpyBig = async (
	dest: number,
	src: number,
	num: number
): Promise<void> => {
	const { HEAPU8 } = await getCZBarInstance();
	HEAPU8.copyWithin(dest, src, src + num);
};

/**
 * This method resize the head memory used in the webassembly. Used internally by emscripten.
 * @param {number} requestedSize - The requested size.
 * @returns {Promise<boolean>} - True if the resize was successful.
 */
export const emscriptenResizeHeap = async (
	requestedSize: number
): Promise<boolean> => {
	const oldSize = (await getCZBarInstance()).HEAPU8.length;
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

/**
 * This method update the global buffer and views. Used internally by emscripten.
 * @param {ArrayBuffer} buffer - The buffer.
 * @void
 */
export const updateGlobalBufferAndViews = async (buffer: ArrayBuffer) => {
	const cBarcodeInstance = await getCZBarInstance();
	cBarcodeInstance['buffer'] = buffer;
	cBarcodeInstance['HEAP8'] = new Int8Array(buffer);
	cBarcodeInstance['HEAP16'] = new Int16Array(buffer);
	cBarcodeInstance['HEAP32'] = new Int32Array(buffer);
	cBarcodeInstance['HEAPU8'] = new Uint8Array(buffer);
	cBarcodeInstance['HEAPU16'] = new Uint16Array(buffer);
	cBarcodeInstance['HEAPU32'] = new Uint32Array(buffer);
	cBarcodeInstance['HEAPF32'] = new Float32Array(buffer);
	cBarcodeInstance['HEAPF64'] = new Float64Array(buffer);
};
