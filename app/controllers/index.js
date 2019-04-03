let videoBtn = Ti.UI.createButton({
	title: "GRABAR"
});
let label = $.label;
label.text = Alloy.Globals.materialIcons.play_circle_filled;


function showCamera(type, callback) {
	console.log("QUALITY_640x480: ", Ti.Media.QUALITY_640x480)
	console.log("QUALITY_HIGH: ", Ti.Media.QUALITY_HIGH)
	console.log("QUALITY_LOW: ", Ti.Media.QUALITY_LOW)
	console.log("QUALITY_MEDIUM: ", Ti.Media.QUALITY_MEDIUM)
	var camera = function () {
		// call Titanium.Media.showCamera and respond callbacks
		Ti.Media.showCamera({
			success: function (e) {
				callback(null, e);
			},
			cancel: function (e) {
				callback(e, null);
			},
			error: function (e) {
				callback(e, null);
			},
			saveToPhotoGallery: true,
			mediaTypes: [type],
			videoQuality: Titanium.Media.QUALITY_640x480,
			// overlay: $.VideoContainer, //Se agrega en versiones de Android Actuales
			whichCamera: Titanium.Media.CAMERA_FRONT
		});
	};

	// check if we already have permissions to capture media
	if (!Ti.Media.hasCameraPermissions()) {

		// request permissions to capture media
		Ti.Media.requestCameraPermissions(function (e) {

			// success! display the camera
			if (e.success) {
				camera();

				// oops! could not obtain required permissions
			} else {
				callback(new Error('could not obtain camera permissions!'), null);
			}
		});
	} else {
		camera();
	}
}



videoBtn.addEventListener('click', function () {

	// attempt to capture video with the camera
	showCamera(Ti.Media.MEDIA_TYPE_VIDEO, function (error, result) {
		if (error) {
			alert('could not capture video');
			return;
		}

		// validate we taken a video
		if (result.mediaType == Ti.Media.MEDIA_TYPE_VIDEO) {

			// create a videoPlayer to display our video
			let videoPlayer = Ti.Media.createVideoPlayer({
				url: result.media.nativePath,
				autoplay: true
			});

			// add the imageView to the indexdow
			$.VideoContainer.add(videoPlayer);
		}
	});
});

$.index.add(videoBtn);


function doClick(e) {
	alert($.label.text);
}

$.index.extendSafeArea = true;
$.index.open();
