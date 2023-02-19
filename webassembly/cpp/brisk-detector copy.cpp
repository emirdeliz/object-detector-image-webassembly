#include <iostream>
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/objdetect/objdetect.hpp>
#include <stdio.h>
#include <sstream>
#include <emscripten.h>

using namespace cv;
using namespace std;

EMSCRIPTEN_KEEPALIVE
uint8_t *create_buffer(int width, int height)
{
	return malloc(width * height * 4 * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t *p)
{
	free(p);
}

int point[4];

void getUint8tFromPointer(const int &addr, const size_t &len, uint8_t *data)
{
	for (size_t i = 0; i < len; ++i)
	{
		data[i] += 1;
	}
}

#ifdef __cplusplus
extern "C"
{
#endif
	EMSCRIPTEN_KEEPALIVE
	int *detectImageInsideImage(
			const int &addr1, const size_t &len1,
			const int &addr2, const size_t &len2)
	{
		uint8_t *data1 = reinterpret_cast<uint8_t *>(addr1);
		getUint8tFromPointer(addr1, len1, data1);

		// Mat img = Mat(1, len1, CV_8UC1, data1);

		// uint8_t data2 = reinterpret_cast<uint8_t *>(addr2);
		// getUint8tFromPointer(addr2, len2, data2);

		// int rows = 1;
		// int cols = sizeof(data1);
		// Size sz(cols, rows);

		// Mat templ = Mat(1, len2, CV_8UC1, data2);

		return point;
	}
#ifdef __cplusplus
}
#endif

// uint8_t *detectImageInsideImage(
// 		const int &addr1, const size_t &len1,
// 		const int &addr2, const size_t &len2)
// // uint8_t imageOne, uint8_t imageTwo)
// {
// 	Mat result;

// 	uint8_t *dataOne = reinterpret_cast<uint8_t *>(addr1);
// 	for (size_t i = 0; i < len1; ++i)
// 	{
// 		dataOne[i] += 1;
// 	}

// 	uint8_t *dataTwo = reinterpret_cast<uint8_t *>(addr2);
// 	for (size_t i = 0; i < len2; ++i)
// 	{
// 		dataTwo[i] += 1;
// 	}

// 	Mat img = Mat(1, len1, CV_8UC1, dataOne);
// 	// Mat templ = Mat(1, len2, CV_8UC1, getUint8tFromPointer(addr2, len2));
// 	// int match_method = TM_CCOEFF;

// 	/// Source image to display
// 	// Mat img_display;
// 	// img.copyTo(img_display);

// 	// /// Create the result matrix
// 	// int result_cols = img.cols - templ.cols + 1;
// 	// int result_rows = img.rows - templ.rows + 1;
// 	// result.create(result_cols, result_rows, CV_8FC1);

// 	// /// Do the Matching and Normalize
// 	// matchTemplate(img, templ, result, match_method);
// 	// normalize(result, result, 0, 1, NORM_MINMAX, -1, Mat());

// 	// /// Localizing the best match with minMaxLoc
// 	// double minVal;
// 	// double maxVal;
// 	// Point minLoc;
// 	// Point maxLoc;
// 	// Point matchLoc;

// 	// minMaxLoc(result, &minVal, &maxVal, &minLoc, &maxLoc, Mat());
// 	// matchLoc = maxLoc;

// 	// rectangle(img_display, matchLoc, Point(matchLoc.x + templ.cols, matchLoc.y + templ.rows), Scalar::all(0), 2, 8, 0);
// 	// int width = image.cols;
// 	// int height = image.rows;
// 	// int _stride = image.step; // in case cols != strides
// 	// for (int i = 0; i < height; i++)
// 	// {
// 	// 	for (int j = 0; j < width; j++)
// 	// 	{
// 	// 		uint8_t val = myData[i * _stride + j];
// 	// 		// do whatever you want with your value
// 	// 	}
// 	// }

// 	// point[0] = matchLoc.x;
// 	// point[1] = matchLoc.y;
// 	// point[2] = result_rows;
// 	// point[3] = result_cols;

// 	// cout << "x: " << point[0];
// 	// cout << " y: " << point[1];
// 	// cout << " height: " << point[2];
// 	// cout << " width: " << point[3];
// 	return point;
// }
