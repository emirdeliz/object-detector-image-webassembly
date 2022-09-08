#!/bin/sh
rm -rf ../built/web-assembly

sleep 1.5s

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
echo SCRIPT_DIR=$SCRIPT_DIR

BUILD_DIR="$SCRIPT_DIR"/../built/web-assembly
echo BUILD_DIR=$BUILD_DIR

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR" || exit

emcmake cmake "$SCRIPT_DIR"
emmake make clean
emmake make