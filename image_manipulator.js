(function() {

  IM = {}

  window.processingGradientEffect = false;

  IM.gradientRadiusEffect = function(ctx, effect, x, y, radius, totalIncrements, doIncrements, incrementAdjust) {
    if(doIncrements === undefined) {
      doIncrements = .4 * totalIncrements;
    }
    if(incrementAdjust === undefined) {
      incrementAdjust = 1;
    }
    if(processingGradientEffect == true) {
      console.log("double click, quiting");
      return;
    }
    var effectSmallerCircle = function (i) {
      if(i >= doIncrements) {
        processingGradientEffect = false;
        return;
      }
      ctx.save()
      ctx.beginPath();
      ctx.arc(x, y, (totalIncrements - i) / totalIncrements * radius, 2 * Math.PI, false)
      ctx.clip();
      effect(ctx, function () { ctx.restore(); effectSmallerCircle(i+incrementAdjust);});
    }

    processingGradientEffect = true;
    effectSmallerCircle(0);
  }

  // amount (-1, 1)
  IM.adjustBrightness = function (ctx, amount, callback) {
    var P = Pixastic(ctx);
    brightness = amount;
    contrast = 0;
    P["brightness"]({brightness: brightness, contrast: contrast}).done(function() {
      console.log("Done Adjusting Brightness");
      callback();
    }, function(p) {
      //progress.style.height = (p * 100) + "%";
    });

  }


  IM.adjustContrast = function (ctx, amount) {
    if(processingGradientEffect) {
      return;
    }
    var P = Pixastic(ctx);
    brightness = -.5 * amount;
    contrast = .6 * amount;
    P["brightness"]({brightness: brightness, contrast: contrast}).done(function() {
      console.log("Done Adjusting Brightness");
    }, function(p) {
      //progress.style.height = (p * 100) + "%";
    });
  }


  IM.blur = function (ctx, kernelSize, callback) {
    var P = Pixastic(ctx);
    P["blur"]({kernelSize: kernelSize}).done(function() {
      console.log("Done adding blur");
      if(callback !== undefined) {
        callback();
      } else {
        console.log("null callback");
      }
    }, function(p) {
      //progress.style.height = (p * 100) + "%";
    });
  }

  window.IM = IM

})();
