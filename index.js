var isAudioPlaying = false;
var isFirstPlay = true;
var player = document.getElementById('audio');
var audioContext;
var audioSrc;
var sudioAnalyser;
var audioPlayHandler;

window.onload = function () {
  
  // Init Canvas Style
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var canvasWidth = windowWidth < windowHeight ? windowWidth - 20 : windowHeight - 20;
  var canvasHeight = canvasWidth;
  var canvasLeft = (windowWidth - canvasWidth) / 2;
  var canvasTop = 20 || (windowHeight - canvasHeight) / 2;

  // Init Buttons Style
  var btns = document.getElementById("btns");
  btns.setAttribute('style', 'top:' + (canvasTop + 70 + canvasHeight) + 'px;');

  // Bass Light Background Canvas Style Init
  var lightBGCanvas = document.getElementById('lightBGCanvas');
  lightBGCanvas.width = canvasWidth;
  lightBGCanvas.height = canvasHeight;
  lightBGCanvas.setAttribute('style', 'left:' + canvasLeft + 'px; top:' + canvasTop + 'px;');

  var lightBGCanvasContext = lightBGCanvas.getContext('2d');
  renderLightBG();

  // Bass Canvas Style Init
  var bassCanvas = document.getElementById('bassCanvas');
  bassCanvas.width = canvasWidth;
  bassCanvas.height = canvasHeight;
  bassCanvas.setAttribute('style', 'left:' + canvasLeft + 'px; top:' + canvasTop + 'px;');

  var bassCanvasContext = bassCanvas.getContext('2d');

  // Frog Canvas Style Init
  var frogCanvas = document.getElementById('frogCanvas');
  frogCanvas.width = canvasWidth;
  frogCanvas.height = canvasHeight;
  frogCanvas.setAttribute('style', 'left:' + canvasLeft + 'px; top:' + canvasTop + 'px;');
  var ratio = Number((canvasWidth / 400).toFixed(2));
  var frogLineWidth = Math.floor(2 * ratio);
  var frogBandWidth = Number((canvasWidth / 88).toFixed(2));

  var frogCanvasContext = frogCanvas.getContext('2d');

  // Frog Image
  var frogImg = new Image();
  frogImg.src = './frog.svg';
  var frogImgWidth = 100;
  var frogImgHeight = 60;
  var frogImgOffset = 36;
  frogImg.onload = function () {
    frogCanvasContext.drawImage(frogImg, 4, canvasHeight - frogImgOffset, frogImgWidth, frogImgHeight);
  }

  // Light Image Init
  var lightCanvas = document.getElementById('lightCanvas');
  lightCanvas.width = canvasWidth;
  lightCanvas.height = canvasHeight;
  lightCanvas.setAttribute('style', 'left:' + canvasLeft + 'px; top:' + canvasTop + 'px;');
  var lightCanvasContext = lightCanvas.getContext('2d');

  var leftLightImg = new Image();
  var lightWidth = 100;
  leftLightImg.src = './left_light.svg';
  leftLightImg.onload = function () {
    lightCanvasContext.drawImage(leftLightImg, canvasWidth / 6 - 50, -26, lightWidth, lightWidth);
  }

  var midLightImg = new Image();
  var midLightWidth = 100;
  midLightImg.src = './mid_light.svg';
  midLightImg.onload = function () {
    lightCanvasContext.drawImage(midLightImg, canvasWidth / 2 - 60, -26, lightWidth, lightWidth);
  }

  var rightLightImg = new Image();
  var rightLightWidth = 100;
  rightLightImg.src = './right_light.svg';
  rightLightImg.onload = function () {
    lightCanvasContext.drawImage(rightLightImg, canvasWidth * 5 / 6 - 58, -24, lightWidth, lightWidth);
  }

  audioPlayHandler = function () {
    render();
  }

  function render() {
    var bufferLength = audioAnalyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var hasRendered = false;

    renderFrame();

    function renderFrame() {
      if (hasRendered && !isAudioPlaying) {
        //return;
      }

      requestAnimationFrame(renderFrame);
      audioAnalyser.getByteFrequencyData(dataArray);
      hasRendered = true;

      var frogLeftHeight;
      var frogLeftPosition = 4;

      // Draw Frog Left Leg
      frogCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      var frogLeftRightOffset = Number((((dataArray[0] - dataArray[80]) / 255) * canvasHeight / 1.9).toFixed(2));
      for (var i = 0; i <= 88; i++) {
        frogLeftHeight = (dataArray[i] / 255) * canvasHeight / 1.9;
        if (i == 0) {
          frogCanvasContext.drawImage(frogImg, frogLeftPosition, canvasHeight - frogLeftHeight - frogImgOffset, frogImgWidth, frogImgHeight);

          frogCanvasContext.beginPath();
          frogCanvasContext.moveTo(frogLeftPosition + 90, canvasHeight - frogLeftHeight + 20);
        } else {
          frogCanvasContext.lineTo(frogLeftPosition + 90, canvasHeight - frogLeftHeight + 20);
        }
        frogLeftPosition += frogBandWidth;
      }
      frogCanvasContext.lineWidth = frogLineWidth;
      frogCanvasContext.strokeStyle = '#4caf50';
      frogCanvasContext.stroke();

      // Draw Frog Right Leg
      frogLeftPosition = 0;
      for (var i = 80; i <= 168; i++) {
        frogLeftHeight = (dataArray[i] / 255) * canvasHeight / 1.9;
        if (i == 80) {
          frogCanvasContext.beginPath();
          frogCanvasContext.moveTo(frogLeftPosition + frogImgWidth - 8, canvasHeight - frogLeftHeight + 11 - frogLeftRightOffset);
        } else {
          frogCanvasContext.lineTo(frogLeftPosition + frogImgWidth - 8, canvasHeight - frogLeftHeight + 11 - frogLeftRightOffset);
        }
        frogLeftPosition += frogBandWidth;
      }
      frogCanvasContext.lineWidth = frogLineWidth;
      frogCanvasContext.strokeStyle = '#4caf50';
      frogCanvasContext.stroke();

      bassCanvasContext.clearRect(0, 0, bassCanvas.width, bassCanvas.height);
      
      var random = Math.floor(Math.random() * 190) + 50;
      if (dataArray[0] > 215) {
        var bassLeftColor = 'rgba(' + random + ',50,' + dataArray[0] + ', .4)';
        bassCanvasContext.beginPath();
        bassCanvasContext.moveTo(bassCanvas.width / 6, 0);
        bassCanvasContext.arc(bassCanvas.width / 6, 0, bassCanvas.width * 2, 0.45 * Math.PI, 0.6 * Math.PI, false);
        bassCanvasContext.fillStyle = bassLeftColor;
        bassCanvasContext.fill();
      }

      if (dataArray[50] < 100 && dataArray[50] > 0) {
        var bassMidColor = 'rgba(' + random + ',' + dataArray[150] + ',50, .4)';
        bassCanvasContext.beginPath();
        bassCanvasContext.moveTo(bassCanvas.width * 3 / 6, 0);
        bassCanvasContext.arc(bassCanvas.width * 3 / 6, 0, bassCanvas.width * 2, 0.6 * Math.PI, 0.7 * Math.PI, false);
        bassCanvasContext.fillStyle = bassMidColor;
        bassCanvasContext.fill();
      }

      if (dataArray[190] > 40) {
        var bassRightColor = 'rgba(50,' + dataArray[30] + ',' + random + ', .4)';
        bassCanvasContext.beginPath();
        bassCanvasContext.moveTo(bassCanvas.width * 5 / 6, 0);
        bassCanvasContext.arc(bassCanvas.width * 5 / 6, 0, bassCanvas.width * 2, 0.45 * Math.PI, 0.75 * Math.PI, false);
        bassCanvasContext.fillStyle = bassRightColor;
        bassCanvasContext.fill();
      }
    }

  }


  function renderLightBG () {
    // Render Left Light Background
    var grdLeft = lightBGCanvasContext.createRadialGradient(canvasWidth / 6 - 4, 40, 16, canvasWidth / 6 - 4, 50, 48);

    var leftColor = 'rgba(160,50,200, .4)';
    grdLeft.addColorStop(0, leftColor);
    grdLeft.addColorStop(0.8, 'black');

    lightBGCanvasContext.beginPath();
    lightBGCanvasContext.arc(canvasWidth / 6 - 4, 40, 40, 0, 2 * Math.PI, false);
    lightBGCanvasContext.fillStyle = grdLeft;
    lightBGCanvasContext.fill();

    // Render Mid Light Background
    var grdMid = lightBGCanvasContext.createRadialGradient(canvasWidth / 2 - 20, 40, 14, canvasWidth / 2 - 20, 50, 48);
    var midColor = 'rgba(163,60,50, .4)';
    grdMid.addColorStop(0, midColor);
    grdMid.addColorStop(0.9, 'black');

    lightBGCanvasContext.beginPath();
    lightBGCanvasContext.arc(canvasWidth / 2 - 20, 40, 40, 0, 2 * Math.PI, false);
    lightBGCanvasContext.fillStyle = grdMid;
    lightBGCanvasContext.fill();

    // Render Right Light Background
    var grdRight = lightBGCanvasContext.createRadialGradient(canvasWidth / 6 * 5 - 14, 40, 14, canvasWidth / 6 * 5 - 14, 50, 48);
    var rightColor = 'rgba(50,129,97, .4)' || 'rgba(120,50,180, .4)';

    grdRight.addColorStop(0, rightColor);
    grdRight.addColorStop(0.9, 'black');

    lightBGCanvasContext.beginPath();
    lightBGCanvasContext.arc(canvasWidth / 6 * 5 - 14, 40, 40, 0, 2 * Math.PI, false);
    lightBGCanvasContext.fillStyle = grdRight;
    lightBGCanvasContext.fill();
  }

};

function audioPlay() {
  if (!isAudioPlaying) {
    player.play();
    if (isFirstPlay) {
      audioContext = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();
      audioSrc = audioContext.createMediaElementSource(player);
      audioAnalyser = audioContext.createAnalyser();

      audioSrc.connect(audioAnalyser);
      audioAnalyser.connect(audioContext.destination);
      audioAnalyser.fftSize = 512;
      audioAnalyser.maxDecibels = -20;

      isFirstPlay = false;
    }
    audioPlayHandler();

    isAudioPlaying = true;
  }
}

function audioPause() {
  if (isAudioPlaying) {
    player.pause();
    isAudioPlaying = false;
  }
}
