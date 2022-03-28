set(OPENCV_DIR "/opt/homebrew/Cellar/opencv/4.5.5")

cmake_minimum_required(VERSION 3.22)
project(object_detector_on_image_web_assembly)

# Use C++ 17 by default
set(CMAKE_CXX_STANDARD 17)

# Set Release as default build type
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif(NOT CMAKE_BUILD_TYPE)

# Does not work
# find_package(OpenCV REQUIRED PATHS "${OPENCV_DIR}/build_wasm" NO_DEFAULT_PATH)

# Needed for opencv2/opencv.hpp
# include_directories("${OPENCV_DIR}/include")

# Needed by opencv.hpp for opencv2/opencv_modules.hpp
# include_directories("${OPENCV_DIR}/build_wasm")

# Needed by opencv_modules.hpp for every module
file(GLOB opencv_include_modules "${OPENCV_DIR}/include/opencv4")
include_directories(${opencv_include_modules})

# Our object_detector_on_image_web_assembly world executable
add_executable(object_detector_on_image_web_assembly src/brisk-detector.cpp)

# Link to opencv.js precompiled libraries
# file(GLOB opencv_libs "${OPENCV_DIR}/lib/*.a")
# target_link_libraries(object_detector_on_image_web_assembly ${opencv_libs})

# There is an issue regarding the order in which libraries
# are passed to the compiler - pass libopencv_core.a last
# https://answers.opencv.org/question/186124/undefined-reference-to-cvsoftdoubleoperator/
# file(GLOB opencv_lib_core "${OPENCV_DIR}/lib/libopencv_core.a")
# target_link_libraries(object_detector_on_image_web_assembly ${opencv_lib_core})

# add_definitions("-s EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\"]'")
# add_definitions("-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\"]'")
# add_definitions("-s EXPORTED_FUNCTIONS='[\"_detectImageInsideImage\"]'")

# Specify linker arguments
# set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS 
# "")

# same as before but no space after -s
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
  # example of target_link_options with a list of names
  # target_link_options(object_detector_on_image_web_assembly PRIVATE "-sEXPORTED_FUNCTIONS='[detectImageInsideImage]'")
# https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm
set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS 
	"-o hello3.html --bind -s WASM=1 -std=c++17 -s EXPORTED_FUNCTIONS='[\"detectImageInsideImage\"]'")

# Set this if you want to to generate sample html file
set(CMAKE_EXECUTABLE_SUFFIX ".html")