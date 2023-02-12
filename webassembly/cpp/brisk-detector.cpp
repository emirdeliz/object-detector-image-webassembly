#include "opencv2/core.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/features2d.hpp"
#include "emscripten.h"

using namespace cv;
using namespace std;

std::tuple<vector<KeyPoint>, vector<KeyPoint>, Mat, Mat, vector<DMatch>> match_image(Mat img1, Mat img2)
{
	// BRISK (Binary Robust Invariant Scalable Keypoints)
	Ptr<Feature2D> detector = BRISK::create();
	vector<KeyPoint> keyImg1, keyImg2;
	Mat descImg1, descImg2;

	detector->detect(img1, keyImg1, Mat());
	// and compute their descriptors with method  compute
	detector->compute(img1, keyImg1, descImg1);
	// or detect and compute descriptors in one step
	detector->detectAndCompute(img2, Mat(), keyImg2, descImg2);

	vector<DMatch> matches;
	Ptr<DescriptorMatcher> descriptorMatcher = DescriptorMatcher::create("BruteForce");
	descriptorMatcher->match(descImg1, descImg2, matches, Mat());
	return std::make_tuple(keyImg1, keyImg2, descImg1, descImg2, matches);
}

Mat calc_distance(vector<DMatch> matches)
{
	int nbMatch = int(matches.size());
	Mat tab(nbMatch, 1, CV_32F);

	for (int i = 0; i < nbMatch; i++)
	{
		tab.at<float>(i, 0) = matches[i].distance;
	}
	return tab;
}

vector<DMatch> get_best_matches(vector<DMatch> matches, Mat distances)
{
	Mat index;
	sortIdx(distances, index, SORT_EVERY_COLUMN + SORT_ASCENDING);
	vector<DMatch> bestMatches;
	for (int i = 0; i < 30; i++)
	{
		bestMatches.push_back(matches[index.at<int>(i, 0)]);
	}
	return bestMatches;
}

#ifdef __cplusplus
extern "C"
{
#endif
	EMSCRIPTEN_KEEPALIVE
	float *detectImageInsideImage(
			vector<uint8_t> buffers,
			vector<size_t> sizes)
	{
		Mat img1 = Mat(1, sizes[0], CV_8UC1, buffers[0]);
		Mat img2 = Mat(1, sizes[1], CV_8UC1, buffers[1]);

		auto [keyImg1, keyImg2, descImg1, descImg2, matches] = match_image(img1, img2);
		Mat distances = calc_distance(matches);
		vector<DMatch> bestMatches = get_best_matches(matches, distances);

		int bestMatchesSize = bestMatches.size();
		float *result = static_cast<float *>(malloc(bestMatchesSize * 4));
		for (int i = 0; i < bestMatchesSize; i++)
		{

			int idx1 = bestMatches[i].trainIdx;
			int idx2 = bestMatches[i].queryIdx;

			result[i * 4] = keyImg1[idx1].pt.x;
			result[i * 4 + 1] = keyImg1[idx1].pt.y;
			result[i * 4] = keyImg2[idx1].pt.x;
			result[i * 4 + 1] = keyImg2[idx1].pt.y;
		}
		return result;
	}
#ifdef __cplusplus
}
#endif