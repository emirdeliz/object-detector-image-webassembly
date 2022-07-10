#include "../../../object-detector-image-cpp/src/utils.h"
#include "emscripten.h"

vector<DMatch> detectImageInsideImage(vector<Mat> images)
{
	Mat img1 = images[0];
	Mat img2 = images[1];

	auto [keyImg1, keyImg2, descImg1, descImg2, matches] = match_image(img1, img2);
	Ptr<DescriptorMatcher> descriptorMatcher = DescriptorMatcher::create("BruteForce");

	Mat distances = calc_distance(matches);
	vector<DMatch> bestMatches = get_best_matches(matches, distances);
	return bestMatches;
}