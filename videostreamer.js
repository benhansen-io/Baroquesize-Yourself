/* Adopted from
 * https://developer.mozilla.org/en-US/docs/WebRTC/Taking_webcam_photos
 */
(function() {

  window.videostreamer = {};

  videostreamer.start = function (video, width) {

    var streaming = false;
    var height = width / 4 * 3;

    navigator.mediaDevices.getUserMedia(
      {
        video: true,
        audio: false
      }).then(function(stream) {
        video.srcObject = stream;
        video.onloadedmetadata = function() {
          video.play();
        };
      }).catch(function(err) {
        console.error("An error occured! " + err);
      });

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        streaming = true;
      }
    }, false);
  }
})();
