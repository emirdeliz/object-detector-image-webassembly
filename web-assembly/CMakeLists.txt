set(OPENCV_DIR "/opt/homebrew/Cellar/opencv/4.5.5")

cmake_minimum_required(VERSION 3.22)
project(object_detector_on_image_web_assembly)

# Use C++ 17 by default
set(CMAKE_CXX_STANDARD 17)

file(GLOB opencv_include_modules "${OPENCV_DIR}/include/opencv4")
include_directories(${opencv_include_modules})

# Our object_detector_on_image_web_assembly world executable
add_executable(object_detector_on_image_web_assembly src/brisk-detector.cpp)

message(info ": Compiling with toolchain for ${CMAKE_SYSTEM_NAME}")

if (${CMAKE_SYSTEM_NAME} STREQUAL "Emscripten")
  set(WRAPPER_OPTIONS "-s EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\"]'")
  # Exports get_42,hello_world_string and is_prime into the js module (notice '_' prefix)
  set(EXPORTED_FUNCTIONS "-s EXPORTED_FUNCTIONS='[\"_detectImageInsideImage\"]'")
  # Sets assertions, usage of pthreads, thread pool size and initial memory. In case the application crashes, raise the allocated memory (needs to be multiple of 16)
  set(EXTRA_OPTIONS "-s ASSERTIONS=1 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=8 -s INITIAL_MEMORY=39321600")

  set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS "${WRAPPER_OPTIONS}")
  set_target_properties(object_detector_on_image_web_assembly PROPERTIES COMPILE_FLAGS "${WRAPPER_OPTIONS}")
  target_compile_definitions(object_detector_on_image_web_assembly PUBLIC IS_EMSCRIPTEN)

  # set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS 
  # 	"-o hello3.html --bind -s WASM=1  -s EXPORTED_FUNCTIONS='[\"detectImageInsideImage\"]'")

  # Set this if you want to to generate sample html file
  set(CMAKE_EXECUTABLE_SUFFIX ".html")
endif ()

# https://github.com/dempo93/cpp2js/blob/515bf8681ca866763cb56ab66025cabe0be76ac2/CMakeLists.txt
# https://github.com/search?l=CMake&q=EXPORTED_FUNCTIONS&type=Code