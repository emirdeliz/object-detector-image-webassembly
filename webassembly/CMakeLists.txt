project(object_detector_on_image_web_assembly)
cmake_minimum_required(VERSION 3.22)

set(CMAKE_CXX_STANDARD 17)

SET(OPENCV_CPP_REQUIRED_DEPS opencv_core opencv_flann opencv_imgproc
    opencv_highgui opencv_ml opencv_video opencv_objdetect opencv_photo
    opencv_features2d opencv_calib3d
    opencv_stitching opencv_videostab)

# find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})

set_target_properties(object_detector_on_image_web_assembly PROPERTIES LINK_FLAGS 
	"--bind --no-entry -s WASM=1 -s EXPORT_ALL=1 -s STANDALONE_WASM --no-entry")

set(CMAKE_EXECUTABLE_SUFFIX ".html")
