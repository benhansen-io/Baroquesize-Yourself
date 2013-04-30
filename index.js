(function() {

  var capturebutton  = document.querySelector('#capturebutton');
  var contrastButton = document.querySelector('#adjust-contrast');
  var nextButton = document.querySelector('#next');
  var resetButton = document.querySelector('#reset');
  var startOverButton = document.querySelector('#start-over');
  var send = document.querySelector('#send');
  var canvas = document.querySelector('#canvas');
  var video = document.querySelector('#video');
  var ctx = canvas.getContext("2d");
  var imageSaveData;
  var imageSaveWidth;
  var imageSaveHeight;

  // State variables
  var takingPicture = true;
  var currentStep = 1;

  stepInfo = {
    step1: {
      infoTitle: "Capture Your Baroque Self",
      info: "In the Baroque style people are represented as they really were or could have been rather than just symbolic representations, and they presented appropriate emotion. In Baroque style it is encouraged to pose in more dramatic and more dynamic positions. Feel free to use any props and poses that will help you bring emotion and drama to your picture.",
      instructions: "Press 'Take Picture' to take the picture. If you are pleased with the result, press 'Next' to continue. Otherwise, Press 'Retake Picture' to try again."
    },
    step2: {
      infoTitle: "Chiaroscuro",
      info: "The second step in \"Baroquesizing Yourself\" is to add the characteristic of chiaroscuro to your picture. Chiaroscuro is light and dark shading, which enhances three-dimensionality and also adds to the realism. Strong lighting effects heighten dramatic effects and emphasize certain figures in your picture.",
      instructions: "Select whether you want to lighten or darken the image using the dials above. Then click on the portions of the image that you want to lighten or darken. You can also heighten the contrast, soften the colors, and darken the overall image by clicking the 'Add Baroqueness' button one or more times. Once you're done, click 'Next' to continue."
    },
    step3: {
      infoTitle: "Sfumato",
      info: "The third step in \"Baroquesizing Yourself\" is adding the characteristic sfumato, which is applying a smokiness or blur that softens the edges of figures in the picture to make them appear more natural. A muteness in the colors of the picture is a baroque technique to convey a feeling of unity and often, warmth.",
      instructions: "Next click on a portion of the photo to lightly blur that portion. Once you're done, click 'Next' to continue."
    },
    step4: {
      infoTitle: "Share",
      info: "Diego Velazquez did not become famous for his Baroque style by being modest and neither should you! Download your new Baroquesized profile picture to yourself and show the world, or possibly update your BYU faculty picture in the online directory, your choice. Either way, thank you for taking the time to do some hands on learning about the impressive creativity of the Baroque style.",
      instructions: "Click to download your baroque image."
    }
  }

  initFunctions = {};

  initFunctions.step2 = function() {
    $(canvas).click(function(e) {
      var selected = $('input:radio[name=adjust-brightness]:checked').val();
      if(selected=="darken") {
        IM.gradientRadiusEffect(ctx, function(clipped_ctx, callback) {IM.adjustBrightness(clipped_ctx, -.03, callback)}, e.offsetX, e.offsetY, 70, 35, 5, 1);
      } else {
        IM.gradientRadiusEffect(ctx, function(clipped_ctx, callback) {IM.adjustBrightness(clipped_ctx, .02, callback)}, e.offsetX, e.offsetY, 90, 45);
      }
    })
    $(canvas).css("cursor","pointer");
  }

  initFunctions.step3 = function() {
    $(canvas).click(function(e) {
      console.log("bluring");
      IM.gradientRadiusEffect(ctx, function(clipped_ctx, callback) {IM.blur(ctx, 7, callback);}, e.offsetX, e.offsetY, 80, 40, 3);
    });
  }

  initFunctions.step4 = function() {
    nextButton.disabled = true;
  }

  function resetAll() {
    takingPicture = true;
    $("#lighten").prop("checked", true);
    $(send).prop("disabled", false);
    window.processingGradientEffect = false;
    $("#email").val("");
    canvas.style.display = "none";
    video.style.display = "block";
    next.disabled = true;
    capturebutton.innerHTML = "Take<br>Picture";
    currentStep = 0;
    nextStep();
  }

  function emphasizeCurrentStep() {
    $('.step').removeClass('current');
    $('#s' + currentStep).addClass('current');
  }

  function takePicture() {
    canvas.width = video.width;
    canvas.height = video.height;
    canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
  }

  $(capturebutton).click(function(ev) {
    console.log("capture button clicked");
    if(takingPicture) {
      takePicture();
      saveImageState();
      video.style.display = "none";
      canvas.style.display = "block";
      capturebutton.innerHTML = "Retake Picture";
      takingPicture = false;
      next.disabled = false;
    } else {
      video.style.display = "block";
      canvas.style.display = "none";
      capturebutton.innerHTML = "Take Picture";
      takingPicture = true;
      next.disabled = true;
    }
  });

  contrastButton.addEventListener('click', function(env) {
    IM.adjustContrast(ctx, .1);
  });


  nextButton.addEventListener('click', function(env) {
    nextStep();
  });

  function nextStep() {
    $(canvas).css("cursor","default");
    currentStep += 1;
    emphasizeCurrentStep();
    $('.control').hide();
    $('#c' + currentStep).show();
    $(canvas).unbind('click');
    initFunction = initFunctions["step" + currentStep];
    if(initFunction != null) {
      initFunction();
    }
    thisStepInfo = stepInfo["step" + currentStep];
    if(thisStepInfo != null) {
      $('#instr-title').html(thisStepInfo["infoTitle"]);
      $('#instr-text').html(thisStepInfo["info"]);
      $('#practical-instructions').html(thisStepInfo["instructions"]);
    }
  }

  startOverButton.addEventListener('click', function(env) {
    resetAll();
  });

  resetButton.addEventListener('click', function(env) {
    restoreImageState();
  });

  function saveImageState() {
    console.log("saving image");
    imageSaveData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };


  function restoreImageState() {
    console.log("resetting");
    ctx.putImageData(imageSaveData, 0, 0);
  };

  /*
  send.addEventListener('click', function(env) {
    var email = $("#email").val();
    if(!isMostlyValidEmail(email)) {
      alert("That email does not appear to be valid.");
      return;
    }
    $(send).prop("disabled", true);
    $.post("upload-image-send-email.php",
      {email: email, image: canvas.toDataURL("image/png")})
      .done(function() { notifyEmailSuccess();})
      .fail(function() { notifyEmailFailure();});
    $("body").css("cursor", "progress");
  });
  */

  function isMostlyValidEmail(text) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  }

  function notifyEmailSuccess() {
    $("body").css("cursor", "default");
    $('.control').hide();
    $('#practical-instructions').html("An email has been sent with a link to download your new baroque self.");
    setTimeout(function() {
      if(currentStep != 1) {
        resetAll();
      }
    }, 4000);
  }

  function notifyEmailFailure() {
    $("body").css("cursor", "default");
    $('.control').hide();
    $('#practical-instructions').html("Sorry. There was an error sending the email. Feel free to pull out your smartphone and take a picture of the screen.");
  }

  // From:
  // http://domainrange.blogspot.co.uk/2013/04/prompting-user-to-download-data-uri-and.html
  function downloadWithName(uri, name) {

    function eventFire(el, etype){
      if (el.fireEvent) {
        (el.fireEvent('on' + etype));
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    eventFire(link, "click");
  }

  $('#download').click(function () {
    var rawImageData = canvas.toDataURL("image/png")
    downloadWithName(rawImageData, "YourBaroqueSelf.png");
    /*rawImageData = rawImageData.replace("image/png", "image/octet-stream")
    document.location.href = rawImageData;*/
  });

  //Start the engines!
  videostreamer.start(video, 400);
  resetAll();

})();
