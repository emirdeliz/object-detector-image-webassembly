#include <opencv2/opencv.hpp>
#include <emscripten.h>

using namespace cv;
using namespace std;

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
	uint8_t *create_buffer(int width, int height)
	{
		return (uint8_t *)malloc(width * height * 4 * sizeof(uint8_t));
	}

	EMSCRIPTEN_KEEPALIVE
	void destroy_buffer(uint8_t *p)
	{
		free(p);
	}

	int point[4];

	EMSCRIPTEN_KEEPALIVE
	void detect_image_inside_image(
			const int addr1,
			const int addr2,
			int *result)
	{
		result[0] = 33;
		result[1] = 44;
		result[2] = 55;
		result[3] = 77;

		// int length = 4;
		// for (int i = 0; i < length; ++i)
		// {
		// 	result[i] = 55;
		// }

		// uint8_t *data1 = reinterpret_cast<uint8_t *>(addr1);
		// getUint8tFromPointer(addr1, sizeof(data1), data1);

		// uint8_t *data2 = reinterpret_cast<uint8_t *>(addr2);
		// getUint8tFromPointer(addr2, sizeof(data2), data2);

		// Mat img = Mat(1, sizeof(data1), CV_8UC1, data1);
		// Mat templ = Mat(1, sizeof(data2), CV_8UC1, data2);

		// int match_method = TM_CCOEFF;

		// // Source image to display
		// Mat img_display;
		// img.copyTo(img_display);

		// // Create the result matrix
		// Mat result;
		// int result_cols = img.cols - templ.cols + 1;
		// int result_rows = img.rows - templ.rows + 1;
		// result.create(result_cols, result_rows, CV_8UC1);

		// // Do the Matching and Normalize
		// matchTemplate(img, templ, result, match_method);
		// normalize(result, result, 0, 1, NORM_MINMAX, -1, Mat());

		// // Localizing the best match with minMaxLoc
		// double minVal;
		// double maxVal;
		// Point minLoc;
		// Point maxLoc;
		// Point matchLoc;

		// minMaxLoc(result, &minVal, &maxVal, &minLoc, &maxLoc, Mat());
		// matchLoc = maxLoc;

		// targetResult[0] = matchLoc.x;
		// targetResult[1] = matchLoc.y;
		// targetResult[2] = result_rows;
		// targetResult[3] = result_cols;
	}
#ifdef __cplusplus
}
#endif