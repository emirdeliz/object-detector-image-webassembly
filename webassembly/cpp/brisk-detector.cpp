#include "opencv2/opencv.hpp"
#include "opencv2/core.hpp"
#include "emscripten.h"

using namespace cv;
using namespace std;

#ifdef __cplusplus
extern "C"
{
#endif
	int result[4];

	int *EMSCRIPTEN_KEEPALIVE check_image(
			unsigned char *img_data, int img_width, int img_height,
			unsigned char *templ_data, int templ_width, int templ_height)
	{
		emscripten_log(EM_LOG_CONSOLE, "Match found at (%d, %d)", img_data, templ_data);

		Mat img(img_height, img_width, CV_8UC4, img_data);
		Mat templ(templ_height, templ_width, CV_8UC4, templ_data);

		Mat result_base;
		matchTemplate(img, templ, result_base, TM_CCOEFF_NORMED);

		Point max_loc;
		minMaxLoc(result_base, nullptr, nullptr, nullptr, &max_loc);

		result[0] = max_loc.x + templ.cols;
		result[1] = templ_width;
		result[2] = max_loc.y + templ.rows;
		result[3] = templ_height;
		return result;
	}
#ifdef __cplusplus
}
#endif