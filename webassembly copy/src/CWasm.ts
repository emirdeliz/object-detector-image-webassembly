import fs from 'fs';
import path from 'path';
import {
	checkIsNodeEnvironment,
	checkIsTestEnvironment,
} from './helpers';
import {
	emscriptenMemcpyBig,
	emscriptenResizeHeap,
	updateGlobalBufferAndViews,
} from './CEmscripten';

const wasmPathGlobal = '/webassembly';

export interface ImageArg { 
	buffer: Uint8Array;
	size: number;
}

/**
 * This method validate if is running on the environment test and as node.
 * It's important because exists a limitation on the test environment when running as node.
 * About the limitation: ENOENT: no such file or directory, open 'wasm'
 * @returns boolean - True if is running on the environment test and as node.
 */
export const checkIsRunningOnEnvironmentTestOrAsNode = () => {
	return checkIsTestEnvironment() || checkIsNodeEnvironment();
};

export const C_WASM_BINARY_FILE = 'object-detector-image-webassembly.wasm';
let cInstance = {} as CObjectWasm;

export interface CBaseWasm {
	detectImageInsideImage: (
		imageOne: ImageArg,
		imageTwo: ImageArg
	) => Promise<Uint8Array>;
}

/**
 * This interface represent the wasm module to the webassembly.
 */
export interface CObjectWasm extends CBaseWasm {
	malloc: (size: number) => number;
	free: (pointer: number) => Promise<void>;
	memory: WebAssembly.Memory;
	print: () => void;
	printErr: () => void;
	arguments: Array<string>;
	buffer: ArrayBuffer;
	HEAP8: Int8Array;
	HEAP16: Int16Array;
	HEAP32: Int32Array;
	HEAPU8: Uint8Array;
	HEAPU16: Uint16Array;
	HEAPU32: Uint32Array;
	HEAPF32: Float32Array;
	HEAPF64: Float64Array;
}

/**
 * This method will fetch the cwasm module.
 * @returns {Promise<WebAssembly.WebAssemblyInstantiatedSource>} - The wasm module.
 */
const fetchCWasm =
	async (): Promise<WebAssembly.WebAssemblyInstantiatedSource> => {
		const asmLibraryArg = {
			// f: clockGetTime,
			// c: emscriptenMemcpyBig,
			// d: emscriptenResizeHeap,
			// a: fdWrite,
			// e: () => undefined,
			// b: () => undefined,
			o: () => undefined, // detectImageInsideImage
			b: () => undefined, // nao precisa
			h: () => undefined, // nao precisa
			c: () => undefined, // nao precisa
			a: () => undefined, // nao precisa
			j: () => undefined, // nao precisa
			g: () => undefined, // nao precisa
			i: () => undefined, // nao precisa
			d: () => undefined, // nao precisa
			l: () => undefined, // nao precisa
			e: () => undefined, // nao precisa
			m: () => undefined, // nao precisa
			p: () => undefined, // nao precisa
			f: emscriptenMemcpyBig,
			k: emscriptenResizeHeap,
		};

		const info = { a: asmLibraryArg };
		if (checkIsRunningOnEnvironmentTestOrAsNode()) {
			const wasmFileLocalDir = path.resolve(
				__dirname,
				'../../dist/webassembly/',
				C_WASM_BINARY_FILE
			);

			const data = fs.readFileSync(wasmFileLocalDir); 
			return WebAssembly.instantiate(data, info);
		}

		const baseUrl = `${wasmPathGlobal}/`;
		const response = await fetch(`${baseUrl}${C_WASM_BINARY_FILE}`);
		const bytes = await response.arrayBuffer();
		return WebAssembly.instantiate(bytes, info);
	};

/**
 * This method make a bridge between the webassembly and the c code.
 * @returns {Promise<CObjectWasm>} - The webassembly instance.
 */
const prepareCWasm = async (): Promise<CObjectWasm> => {
	const ex = await fetchCWasm();
	const asm = ex.instance.exports;

	console.log({asmCC: asm.f })

	cInstance = {
		detectImageInsideImage: asm.p,
		malloc: asm.r,
		free: asm.s,
		memory: asm.n,
		f: asm.f,
	} as CObjectWasm;
	updateGlobalBufferAndViews(cInstance.memory.buffer);
	return cInstance;
};

/**
 * This method will return and create the webassembly instance.
 * @returns {Promise<CObjectWasm>} - The webassembly instance.
 */
export const getCInstance = async (): Promise<CObjectWasm> => {
	if (!cInstance.free) {
		cInstance = await prepareCWasm();
	}
	return cInstance;
};
