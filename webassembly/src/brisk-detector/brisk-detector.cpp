#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/features2d.hpp>
#include <opencv2/highgui.hpp>
#include <vector>
#include <iostream>

// https://medium.com/data-breach/introduction-to-feature-detection-and-matching-65e27179885d
// https://www.google.com/search?q=ndvi&sxsrf=APq-WBtkySwBa6BGjBxEylPPSfHMzbcrOg:1647268291533&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjr8PbK6MX2AhWUqZUCHd_rCPcQ_AUoAXoECAEQAw&biw=2192&bih=1060&dpr=2.2#imgrc=6WhEgrzjVAVEDM&imgdii=aDdOfd4xNCDNWM
// clear && rm -rf build && mkdir build && cd build && cmake .. && make && ./object_detector_on_image_cpp && cd ..
// clear && em++ build/CMakeFiles/object_detector_on_image_cpp.dir/src/brisk-detector.cpp.o src/brisk-detector.cpp -o object-detector-image-cpp.js \ `pkg-config --cflags --libs opencv`

using namespace cv;
using namespace std;

static void help(char *argv[])
{
	cout << "\n This program demonstrates how to detect compute and match BRISK descriptors \n"
					"Usage: \n  "
			 << argv[0] << " --image1=<image1(doctor-house.png as default)> --image2=<image2(doctor-house-tongue.png as default)>\n"
										 "Press a key when image window is active to change algorithm or descriptor";
}

vector<Mat> get_images(int argc, char **argv)
{
	cv::CommandLineParser parser(
			argc,
			argv,
			"{ @image1 | ../assets/doctor-house.png | }"
			"{ @image2 | ../assets/doctor-house-tongue.png | }");

	String fileName1 = samples::findFile(parser.get<string>(0));
	String fileName2 = samples::findFile(parser.get<string>(1));
	Mat img1 = imread(fileName1, IMREAD_GRAYSCALE);
	Mat img2 = imread(fileName2, IMREAD_GRAYSCALE);
	return vector<Mat>{img1, img2};
}

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

void show_result(Mat img1, Mat img2, vector<KeyPoint> keyImg1, vector<KeyPoint> keyImg2, vector<DMatch> bestMatches)
{
	Mat result;
	drawMatches(img1, keyImg1, img2, keyImg2, bestMatches, result);
	imshow("Result", result);
}

int main(int argc, char **argv)
{
	vector<Mat> images = get_images(argc, argv);
	Mat img1 = images[0];
	Mat img2 = images[1];

	auto [keyImg1, keyImg2, descImg1, descImg2, matches] = match_image(img1, img2);
	Ptr<DescriptorMatcher> descriptorMatcher = DescriptorMatcher::create("BruteForce");

	Mat distances = calc_distance(matches);
	vector<DMatch> bestMatches = get_best_matches(matches, distances);

	show_result(img1, img2, keyImg1, keyImg2, bestMatches);
	waitKey();
	return 0;
}