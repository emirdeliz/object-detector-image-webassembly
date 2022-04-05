set(OPENCV_DIR "/opt/homebrew/Cellar/opencv/4.5.5")

cmake_minimum_required(VERSION 3.22)
project(object_detector_on_image_web_assembly)

# Use C++ 17 by default
set(CMAKE_CXX_STANDARD 17)

# Needed by opencv_modules.hpp for every module
file(GLOB opencv_include_modules "${OPENCV_DIR}/include/opencv4")
include_directories(${opencv_include_modules})

# Our object_detector_on_image_web_assembly world executable
add_executable(object_detector_on_image_web_assembly src/brisk-detector.cpp)

set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS 
	"--bind --no-entry -s WASM=1")

set(CMAKE_EXECUTABLE_SUFFIX ".wasm")