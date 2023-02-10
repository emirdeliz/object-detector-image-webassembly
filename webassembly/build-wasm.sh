#!bin/sh

em++ \
  webassembly/cpp/brisk-detector.cpp \
  -I /main/opencv/include \
  -I /main/opencv/build_wasm \
  -I /main/opencv/modules/calib3d/include \
  -I /main/opencv/modules/core/include \
  -I /main/opencv/modules/dnn/include \
  -I /main/opencv/modules/features2d/include \
  -I /main/opencv/modules/flann/include \
  -I /main/opencv/modules/gapi/include \
  -I /main/opencv/modules/highgui/include \
  -I /main/opencv/modules/imgcodecs/include \
  -I /main/opencv/modules/imgproc/include \
  -I /main/opencv/modules/ml/include \
  -I /main/opencv/modules/objdetect/include \
  -I /main/opencv/modules/photo/include \
  -I /main/opencv/modules/stitching/include \
  -I /main/opencv/modules/ts/include \
  -I /main/opencv/modules/video/include \
  -I /main/opencv/modules/videoio/include \
  -I /main/opencv/modules/world/include \
  -Os -Wall --no-entry --no-warn \
  -s USE_ZLIB=1 \
  -s MINIMAL_RUNTIME=1 \
  -s WARN_ON_UNDEFINED_SYMBOLS=0 \
  -s MINIMAL_RUNTIME=1 \
  -s EXPORT_NAME="cdecode" \
  -s EXPORTED_FUNCTIONS="[\
		'_malloc',\
		'_free',\
		'_detectImageInsideImage'\
	]" \
  -o dist/webassembly/object-detector-on-image-cpp.js