#!/bin/sh
mkdir -p dist/webassembly && rm -rf dist/webassembly/* \
  && echo "👉👉👉 Cool, let's compile the cpp code to webassembly..." \
  && emcc webassembly/cpp/brisk-detector.cpp \
    -Os -Wall -Werror --no-entry \
    -I /usr/local/include/opencv4 \
    -sEXPORT_NAME='object_detector_image_webassembly' \
    -sMINIMAL_RUNTIME=1 \
    -sALLOW_MEMORY_GROWTH=1 \
    -sERROR_ON_UNDEFINED_SYMBOLS=0 \
    -sWARN_ON_UNDEFINED_SYMBOLS=0 \
    -o dist/webassembly/object-detector-image-webassembly.js \
  && echo "Run the web project to test. The webassembly is on fire 🔥🔥🔥 "

