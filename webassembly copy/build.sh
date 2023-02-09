#!/bin/sh
mkdir -p dist/webassembly && rm -rf dist/webassembly/* \
  && echo "👉👉👉 Cool, let's compile the cpp code to webassembly..." \
  && em++ webassembly/cpp/brisk-detector.cpp \
    -Os -Wall -Werror --no-entry \
    -I /opt/opencv-4.6.0 -I /usr/local/include/opencv4 \
    -sALLOW_MEMORY_GROWTH=1 \
    -sMINIMAL_RUNTIME=1 \
    -sEXPORT_NAME="objDetector" \
    -o dist/webassembly/object-detector-image-webassembly.js \
  && echo "Run the web project to test. The webassembly is on fire 🔥🔥🔥 "

