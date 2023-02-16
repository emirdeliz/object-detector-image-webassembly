# set(OPENCV_DIR "/main/opencv")
set(OPENCV_DIR "/Volumes/Ficheiros/Dev/opencv")

cmake_minimum_required(VERSION 3.22)
project(object_detector_on_image_cpp)

# Use C++ 17 by default
set(CMAKE_CXX_STANDARD 17)

# Set Release as default build type
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif(NOT CMAKE_BUILD_TYPE)

# Does not work
# find_package(OpenCV REQUIRED PATHS "${OPENCV_DIR}/build_wasm" NO_DEFAULT_PATH)

# Needed for opencv2/opencv.hpp
include_directories("${OPENCV_DIR}/include")

# Needed by opencv.hpp for opencv2/opencv_modules.hpp
include_directories("${OPENCV_DIR}/build_wasm")

# Needed by opencv_modules.hpp for every module
file(GLOB opencv_include_modules "${OPENCV_DIR}/modules/*/include")
include_directories(${opencv_include_modules})

# Our object_detector_on_image_cpp world executable
add_executable(object_detector_on_image_cpp cpp/brisk-detector.cpp)

# Link to opencv.js precompiled libraries
file(GLOB opencv_libs "${OPENCV_DIR}/build_wasm/lib/*.a")
target_link_libraries(object_detector_on_image_cpp ${opencv_libs})

# There is an issue regarding the order in which libraries
# are passed to the compiler - pass libopencv_core.a last
# https://answers.opencv.org/question/186124/undefined-reference-to-cvsoftdoubleoperator/
file(GLOB opencv_lib_core "${OPENCV_DIR}/build_wasm/lib/libopencv_core.a")
target_link_libraries(object_detector_on_image_cpp ${opencv_lib_core})

# Specify linker arguments
# set_target_properties(
# object_detector_on_image_cpp
# PROPERTIES
# LINK_FLAGS "
# -Os -Wall -g0 -Werror --no-entry \
# -s USE_ZLIB=1 \
# -s ALLOW_MEMORY_GROWTH=1 \
# -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
# -s MINIMAL_RUNTIME=1 \
# -s EXPORT_NAME=\"cdetector\" \
# -s EXPORTED_FUNCTIONS=_detectImageInsideImage \
# -o webassembly/object-detector-on-image-cpp.js
# "
# )
set_target_properties(object_detector_on_image_cpp PROPERTIES LINK_FLAGS "-O3 -s TOTAL_MEMORY=268435456 -s NO_DISABLE_EXCEPTION_CATCHING=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s USE_ZLIB=1 -s EXPORTED_FUNCTIONS=_free,_malloc -s MODULARIZE=1 -s EXPORT_NAME=createDetectorModule")
