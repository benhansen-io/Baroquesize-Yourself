/* Adopted from
 * https://developer.mozilla.org/en-US/docs/WebRTC/Taking_webcam_photos
 */
(function() {

  window.videostreamer = {};

  videostreamer.start = function (video, width) {

    var streaming = false;
    var height = width / 4 * 3;

    navigator.getMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        streaming = true;
      }
    }, false);
  }
})();
