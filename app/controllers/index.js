



function showCamera(type, callback) {
	console.log("QUALITY_640x480: ", Ti.Media.QUALITY_640x480)
	console.log("QUALITY_HIGH: ", Ti.Media.QUALITY_HIGH)
	console.log("QUALITY_LOW: ", Ti.Media.QUALITY_LOW)
	console.log("QUALITY_MEDIUM: ", Ti.Media.QUALITY_MEDIUM)

	var camera = function () {
		// call Titanium.Media.showCamera and respond callbacks
		Ti.Media.showCamera({
			success: function (e) {
				console.info("[showCamera | success] e: " + JSON.stringify(e));
				callback(null, e);
			},
			cancel: function (e) {
				console.info("[showCamera | cancel] e: " + JSON.stringify(e));
				callback(e, null);
			},
			error: function (e) {
				console.info("[showCamera | error] e: " + JSON.stringify(e));
				callback(e, null);
			},
			mediaTypes: [type],
			videoQuality: 4,
			// overlay: $.VideoContainer, //Se agrega en versiones de Android Actuales
			whichCamera: Ti.Media.CAMERA_REAR,
			saveToPhotoGallery: true,
		});
	};






	// check if we already have permissions to capture media
	// if (!Ti.Media.hasCameraPermissions() && !Ti.Filesystem.hasStoragePermissions()) {

	// 	// request permissions to capture media
	// 	Ti.Media.requestCameraPermissions(function (e) {

	// 		// success! display the camera
	// 		if (e.success) {
	// 			camera();

	// 			// oops! could not obtain required permissions
	// 		} else {
	// 			callback(new Error('could not obtain camera permissions!'), null);
	// 		}
	// 	});
	// }
	// else {
	// 	camera();
	// }

	var permissionsToRequest = ["android.permission.CAMERA", "android.permission.WRITE_EXTERNAL_STORAGE"];

	if ((!Ti.Android.hasPermission(permissionsToRequest))) {
		Ti.Android.requestPermissions(permissionsToRequest, function (e) {
			// success! display the camera
			if (e.success) {
				camera();
			} else {
				callback(new Error('could not obtain camera permissions!'), null);
			}
		});
	} else {
		camera();
	}

}

function getVideoPath(_filename) {
	// let currentFilePath = null;
	// if (parseInt(Ti.Platform.version) < 6) {
	// 	console.info('pick for android version minor to 6');
	// 	currentFilePath = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, _filename);
	// } else {
	console.info('pick for android version greater than 5');
	currentFilePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, _filename);
	// }
	return currentFilePath;
}


$.record.addEventListener('click', function () {

	$.VideoContainer.removeAllChildren();

	// attempt to capture video with the camera
	showCamera(Ti.Media.MEDIA_TYPE_VIDEO, function (error, result) {
		console.log("result: ", JSON.stringify(result));
		if (error) {
			alert('could not capture video');
			return;
		}

		// validate we taken a video
		if (result.mediaType == Ti.Media.MEDIA_TYPE_VIDEO) {


			// Ti.UI.createNotification({
			// 	message: "File size: " + result.media.file.size + "[bytes]",
			// 	duration: Ti.UI.NOTIFICATION_DURATION_SHORT
			// }).show();

			// console.log("file: ", result.media.file.nativePath);
			// let sufixNameArray = result.media.file.nativePath.split("/");
			// let sufixName = sufixNameArray[sufixNameArray.length - 1];
			// console.log("sufixName: ", sufixName);
			// let _path = getVideoPath("video_result_" + sufixName);
			// console.log("_path: ", _path);
			// result.media.file.move(_path.nativePath);

			// if (_path.exists) {
			// 	console.log("Titanium.Filesystem.getFile(_path.nativePath).nativePath: ", Titanium.Filesystem.getFile(_path.nativePath).nativePath);

			// 	// create a videoPlayer to display our video
			// 	let videoPlayer = Ti.Media.createVideoPlayer({
			// 		url: Titanium.Filesystem.getFile(_path.nativePath).nativePath,
			// 		autoplay: true
			// 	});
			// 	console.log("videoPlayer.url", videoPlayer.url);
			// 	// add the imageView to the indexdow
			// 	$.VideoContainer.add(videoPlayer);
			// }

			// create a videoPlayer to display our video
			var videoPlayer = Ti.Media.createVideoPlayer({
				url: result.media.nativePath,
				autoplay: true
			});

			// add the videoPlayer to the window
			$.VideoContainer.add(videoPlayer);

		}
	});
});


$.index.extendSafeArea = true;
$.index.open();
