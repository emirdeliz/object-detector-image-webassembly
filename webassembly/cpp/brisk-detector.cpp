#include "../../node_modules/object-detector-image-cpp/src/utils.h"
#include "emscripten.h"

class ImageArg {
	public: uint8_t *buffer; 
	public: size_t size;
};

vector<DMatch> EMSCRIPTEN_KEEPALIVE detectImageInsideImage(vector<ImageArg> images)
{
	Mat img1 = Mat(1, images[0].size, CV_8UC1, images[0].buffer);
	Mat img2 = Mat(1, images[1].size, CV_8UC1, images[1].buffer);

	auto [keyImg1, keyImg2, descImg1, descImg2, matches] = match_image(img1, img2);
	Ptr<DescriptorMatcher> descriptorMatcher = DescriptorMatcher::create("BruteForce");

	Mat distances = calc_distance(matches);
	vector<DMatch> bestMatches = get_best_matches(matches, distances);
	return bestMatches;
}