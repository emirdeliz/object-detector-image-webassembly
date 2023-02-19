let _Module;

export const getModuleApi = async () => {
  const moduleAsm = await getModule();
  // const api = {
  //   ...moduleAsm,
  //   create_buffer: moduleAsm.create_buffer,
  //   destroy_buffer: moduleAsm.destroy_buffer,
  //   detect_image_inside_image: moduleAsm.detect_image_inside_image,
  //   // get_result_size: Module.cwrap('get_result_size', '', ['number']),
  //   // encode: Module.cwrap('encode', 'uint8_t' , 'number', 'number', 'number', ['number', 'number']),
  //   // get_result_pointer: Module.cwrap('get_result_pointer', '', ['number']),
  //   // get_result_size: Module.cwrap('get_result_size', '', ['number']),
  // };
  return moduleAsm;
}

const initializeModule = async () => {
	const wasmImports = {
		emscripten_resize_heap: emscriptenResizeHeap,
		emscripten_memcpy_big: emscriptenMemcpyBig,
    fd_close: fdClose,
    fd_seek: fdSeek,
		fd_write: fdWrite,
		__cxa_throw: () => { },
		fd_read: () => { },
		environ_sizes_get: () => { },
		environ_get: () => { },
		emscripten_get_now: () => { },
		_emscripten_get_now_is_monotonic: () => { },
		abort: () => { },
		strftime_l: () => { },
  };

  const imports = {
    env: wasmImports,
    wasi_snapshot_preview1: wasmImports
  };
  
	const response = await fetch('/webassembly/object_detector_on_image_cpp.wasm');
  const asm = (await WebAssembly.instantiate(
    await response.arrayBuffer(),
    imports,
	)).instance.exports;
	return { ...asm };
};

export const getModule = async () => { 
  if (!_Module) { 
		_Module = await initializeModule();
		updateGlobalBufferAndViews(_Module.memory.buffer);
  }
  return _Module as any;
}

export const fdSeek = () => {
  return 70;
}

export const cxaThrow = (ptr) => {
	throw ptr;
}

export const emscriptenMemcpyBig = async (
	dest: number,
	src: number,
	num: number
): Promise<void> => {
	const moduleApi = await getModuleApi();
	const { HEAPU8 } = moduleApi;
	HEAPU8.copyWithin(dest, src, src + num);
};

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
	_Module['buffer'] = buffer;
	_Module['HEAP8'] = new Int8Array(buffer);
	_Module['HEAP16'] = new Int16Array(buffer);
	_Module['HEAP32'] = new Int32Array(buffer);
	_Module['HEAPU8'] = new Uint8Array(buffer);
	_Module['HEAPU16'] = new Uint16Array(buffer);
	_Module['HEAPU32'] = new Uint32Array(buffer);
	_Module['HEAPF32'] = new Float32Array(buffer);
	_Module['HEAPF64'] = new Float64Array(buffer);
};