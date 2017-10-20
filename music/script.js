var audioInput = null;
var file = null;
var fileName = "";
var playButton = null;
var buttonDisabled = true;
var audioContext = null;
var audioBufferSourceNode = null;
var audioPlaying = false;
var canvas = null;
var ctx = null;
var elapsedTime = 0;
var startTime = 0;
var durationTime = 0;
var analyser = null;
var audioDrawingArray = null;
var radius = 150;
var graphSize = 150;
var xc = 0;
var yc = 0;
var i = 0;
var animationFrameId = null;
var lastTimeStamp = 0;
var textX = 200;
var textStopState = 1;
var textStopStartTimeStamp = -1;
var volume = 0.75;
var audioGainNode = null;
var volumeAnimation = 0;

var ctx1;
var ctx2;
var audioContextL;
var analyserL;
var MSAudioSourceNode;
var biquadFilter;
var radiusL = 150;
var graphSizeL = 150;
var xcL = 0;
var ycL = 0;
var range;
var toggle;
var animationOne;
var animationTwo;
var flag = 1;

window.onload = function()
{
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
	
	try
	{
		audioContext = new AudioContext();
	}
	catch(error)
	{
		console.error(error);
	}
	
	audioInput = document.getElementById("chooser-input");
	audioInput.onchange = cbInputChange;
	
	playButton = document.getElementById("chooser-button");
	playButton.onclick = cbButtonClick;
	disableButton();
	
	canvas = document.getElementById("scene-canvas");
	ctx = canvas.getContext("2d");
	
	if(canvas.addEventListener)
	{
		// IE9, Chrome, Safari, Opera
		canvas.addEventListener("mousewheel", cbCanvasScroll, false);
		// Firefox
		canvas.addEventListener("DOMMouseScroll", cbCanvasScroll, false);
	}
	// IE 6/7/8
	else
	{
		canvas.attachEvent("onmousewheel", cbCanvasScroll);
	}
	
	analyser = audioContext.createAnalyser();
	audioGainNode = audioContext.createGain();
	
	analyser.connect(audioGainNode);
	audioGainNode.connect(audioContext.destination);
	
	document.getElementById("error-button").onclick = cbErrorButtonClick;

	canvasOne = document.getElementById('canvasOne');
    ctx1 = canvasOne.getContext("2d");

    canvasTwo = document.getElementById('canvasTwo');
    ctx2 = canvasTwo.getContext("2d");
    canvasTwo.width = document.body.clientWidth;
    range = document.getElementById('range');
    toggle = document.getElementById('toggle');

      dropBox = document.getElementById('drop');
      dropBox.ondragenter = ignoreDrag;
      dropBox.ondragover = ignoreDrag;
      dropBox.ondrop = drop;


};

window.onresize = function() {
        canvasTwo.width = document.body.clientWidth;
 };
function ignoreDrag(e) {
   //因为我们在处理拖放，所以应该确保没有其他元素会取得这个事件
   e.stopPropagation();
   e.preventDefault();
}
 
function drop(e) {
   //取消事件传播及默认行为
   e.stopPropagation();
   e.preventDefault();
   
   //取得拖进来的文件
   var data = e.dataTransfer;
   var files = data.files;
   //将其传给真正的处理文件的函数
   cbInputChange(files);
}
function playOne() {
   
    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia({ audio: true }, function(stream) {
        audioContextL = new (window.AudioContext || window.webkitAudioContext);
        MSAudioSourceNode = audioContextL.createMediaStreamSource(stream);
        analyserL = audioContextL.createAnalyser();
        analyserL.fftSize = 2048;
        MSAudioSourceNode.connect(analyserL);
        // 创建二阶滤波器
        var biquadFilter = audioContextL.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = range.value;
        console.log(biquadFilter.gain.value);
        analyserL.connect(biquadFilter);
        biquadFilter.connect(audioContextL.destination);

        range.oninput = function() {
            biquadFilter.gain.value = range.value;
        }
        document.getElementById('chooser').className = "hidden";
        canvasOne.className = "";
        document.getElementById('tool').className = "";
        document.getElementById('back').className = "";
        drawOne();
        toggle.onclick = function(){
            if(flag == 1){
                cancelAnimationFrame(animationOne);
                canvasOne.className = "hidden";
                flag = 2;
                canvasTwo.className = "";
                drawTwo();
            }else{
                cancelAnimationFrame(animationTwo);
                canvasTwo.className = "hidden";
                flag = 1;
                canvasOne.className = "";
                drawOne();
            }
        }

    }, function() {});
}




function drawOne() {
    var audioDrawingArray = new Uint8Array(1024);
    analyserL.getByteFrequencyData(audioDrawingArray);


    ctx1.clearRect(0, 0, 600, 600);
    ctx1.lineWidth = 1.0;
    ctx1.fillStyle = "#FFFFFF";
    ctx1.strokeStyle = "#DDDDDD";
    ctx1.beginPath();
    ctx1.moveTo(300 + Math.cos(0.5 * Math.PI) * (radiusL + (audioDrawingArray[0] / 256 * graphSizeL)), 300 + Math.sin(0.5 * Math.PI) * (radiusL + (audioDrawingArray[0] / 256 * graphSizeL)));

    for (i = 1; i < (audioDrawingArray.length / 4); i++) {
        xcL = ((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))) + (300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL)))) / 2;
        ycL = ((300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))) + (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL)))) / 2;
        ctx1.quadraticCurveTo((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), xcL, ycL);
    }

    ctx1.quadraticCurveTo((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL))));

    ctx1.moveTo(300 + Math.cos(0.5 * Math.PI) * (radiusL + (audioDrawingArray[0] / 256 * graphSizeL)), 300 + Math.sin(0.5 * Math.PI) * (radiusL + (audioDrawingArray[0] / 256 * graphSizeL)));

    for (i = 1; i < (audioDrawingArray.length / 4); i++) {
        xcL = ((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))) + (300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL)))) / 2;
        ycL = ((300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))) + (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL)))) / 2;
        ctx1.quadraticCurveTo((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), xcL, ycL);
    }

    ctx1.quadraticCurveTo((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i] / 256 * graphSizeL))), (300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radiusL + (audioDrawingArray[i + 1] / 256 * graphSizeL))));

    ctx1.fill();
    ctx1.stroke();

    ctx1.fillStyle = "#FFFFFF";
    ctx1.beginPath();
    ctx1.arc(300, 300, radiusL, 0, 2 * Math.PI, false);
    ctx1.fill();


    animationOne = requestAnimationFrame(drawOne);
};


function drawTwo() {
    var WIDTH = document.body.clientWidth;
    var HEIGHT = canvasTwo.height;

    var audioDrawingArray = new Uint8Array(1024);
    analyserL.getByteFrequencyData(audioDrawingArray);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < (audioDrawingArray.length); i++) {
        ctx2.fillStyle = "#fff";
        var value = audioDrawingArray[i];
        ctx2.fillRect(i * 5, HEIGHT - value, 4, HEIGHT);
    }
    animationTwo = requestAnimationFrame(drawTwo);
}


function cbCanvasScroll(e)
{
	var e = window.event || e;
	var detail = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if(detail > 0)
	{
		volume = Math.min(1, volume + 0.025);
	}
	else
	{
		volume = Math.max(0, volume - 0.025);
	}
	
	if(audioGainNode != null)
	{
		// console.log("Volume set to: " + volume);
		audioGainNode.gain.value = Math.pow(volume, 2.0); // makes the volume more realistic
	}
	
	volumeAnimation = 400;
}

function cbInputChange(files)
{
	if(audioInput.files.length != 0)
	{
		file = audioInput.files[0];
		fileName = file.name;
		document.getElementById('musicName').innerText = fileName;
		// console.log("Play audio: " + fileName);
		
		enableButton();
	}else{
		file = files[0];
		fileName = file.name;
		
		document.getElementById('musicName').innerText = fileName;
		
		enableButton();
	}
}

function disableButton()
{
	buttonDisabled = true;
	document.getElementById("chooser-button").className = "disabled";
}

function enableButton()
{
	buttonDisabled = false;
	document.getElementById("chooser-button").className = "";
}

function cbButtonClick()
{
	if(!buttonDisabled)
	{
		if(file.type.split("/")[0] == "audio")
		{
			var fileReader = new FileReader();
			fileReader.onload = function(e)
			{
				var fileResult = e.target.result;
				if(audioContext == null)
				{
					return;
				}
				audioContext.decodeAudioData(fileResult, function(buffer)
				{
					// console.log(buffer);
					
					setTimeout(function() { visualize(buffer); document.getElementById("spinner-outer").className = "hidden"; }, 1000);
					
					showScene();
				}, function(error)
				{
					console.error(error);
					showError("Error while decoding the audio", error.toString());
					document.getElementById("spinner-outer").className = "hidden";
				});
			};
			fileReader.onerror = function(error)
			{
				console.error(error);
				showError("Error while reading file", error.toString());
				document.getElementById("spinner-outer").className = "hidden";
			};
			
			fileReader.readAsArrayBuffer(file);
			
			document.getElementById("spinner-outer").className = "";
		}
		else
		{
			showError("不是音乐文件", "需要添加格式为音乐的文件哦");
		}
	}
}

function showScene()
{
	clearDraw();
	
	document.getElementById("chooser").className = "hidden";
	document.getElementById("scene").className = "";
	document.getElementById("back").className = "";
}

function showChooser()
{
	document.getElementById("chooser").className = "";
	document.getElementById("scene").className = "hidden";
	document.getElementById("back").className = "hidden"
}

function visualize(buffer)
{
	audioBufferSourceNode = audioContext.createBufferSource();
	
	audioBufferSourceNode.buffer = buffer;
	analyser.smoothingTimeConstant = 0.75;
	audioGainNode.gain.value = volume;
	
	audioBufferSourceNode.connect(analyser);
	
	audioBufferSourceNode.start();
	
	audioPlaying = true;
	startTime = audioContext.currentTime;
	durationTime = buffer.duration;
	
	draw(0);
	
	audioBufferSourceNode.onended = function()
	{
		audioBufferSourceNode.stop();
		audioBufferSourceNode.disconnect();
		
		if(animationFrameId !== null)
		{
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
		
		audioPlaying = false;
		showChooser();
	};
}

function generateTime(seconds)
{
	var minutes = Math.floor(seconds / 60);
	var seconds = Math.floor(seconds % 60);
	
	return ((minutes < 10)?("0" + minutes):(minutes)) + ":" + ((seconds < 10)?("0" + seconds):(seconds));
}

function generateName(fileName)
{
	var parts = fileName.split(".");
	parts.pop();
	return parts.join(".");
}

function clearDraw()
{
	ctx.clearRect(0, 0, 600, 600);
	
	ctx.fillStyle = "#FFFFFF";
	ctx.strokeStyle = "#DDDDDD";
	ctx.beginPath();
	ctx.arc(300, 300, radius, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = "#222222";
	ctx.font = "100 75px Roboto";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("00:00", 300, 300);
}

function draw(currentTimeStamp)
{
	elapsedTime = audioContext.currentTime - startTime;
	audioDrawingArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(audioDrawingArray);
	
	ctx.clearRect(0, 0, 600, 600);
	
	ctx.lineWidth = 1.0;
	ctx.fillStyle = "#FFFFFF";
	ctx.strokeStyle = "#DDDDDD";
	ctx.beginPath();
	ctx.moveTo(300 + Math.cos(0.5 * Math.PI) * (radius + (audioDrawingArray[0] / 256 * graphSize)), 300 + Math.sin(0.5 * Math.PI) * (radius + (audioDrawingArray[0] / 256 * graphSize)));
	
	for(i = 1; i < (audioDrawingArray.length / 4); i++)
	{
		xc = ((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))) + (300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize)))) / 2;
		yc = ((300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))) + (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize)))) / 2;
		ctx.quadraticCurveTo((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), xc, yc);
	}
	
	ctx.quadraticCurveTo((300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.cos((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize))), (300 + Math.sin((0.5 - (i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize))));
	
	ctx.moveTo(300 + Math.cos(0.5 * Math.PI) * (radius + (audioDrawingArray[0] / 256 * graphSize)), 300 + Math.sin(0.5 * Math.PI) * (radius + (audioDrawingArray[0] / 256 * graphSize)));
	
	for(i = 1; i < (audioDrawingArray.length / 4); i++)
	{
		xc = ((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))) + (300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize)))) / 2;
		yc = ((300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))) + (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize)))) / 2;
		ctx.quadraticCurveTo((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), xc, yc);
	}
	
	ctx.quadraticCurveTo((300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i] / 256 * graphSize))), (300 + Math.cos((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize))), (300 + Math.sin((0.5 - (4 - i / audioDrawingArray.length * 4)) * Math.PI) * (radius + (audioDrawingArray[i + 1] / 256 * graphSize))));
	
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(300, 300, radius, 0, 2 * Math.PI, false);
	ctx.fill();
	
	ctx.globalAlpha = (100 - Math.max(Math.min(volumeAnimation, 100), 0)) / 100;
	
	ctx.fillStyle = "#222222";
	ctx.font = "100 75px Roboto";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(generateTime(elapsedTime), 300, 300);
	
	ctx.fillStyle = "#888888";
	ctx.font = "100 25px Roboto";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("-" + generateTime(durationTime - elapsedTime), 300, 375);
	
	ctx.save();
	ctx.beginPath();
	ctx.rect(200, 220, 200, 30);
	ctx.clip();
	
	ctx.fillStyle = "#AAAAAA";
	ctx.font = "400 13px Roboto";
	if(ctx.measureText(generateName(fileName)).width > 200)
	{
		// animate
		switch(textStopState)
		{
			case 0:
			{
				textX -= (currentTimeStamp - lastTimeStamp) / 25;
				if(textX <= 200)="" {="" textstopstate="1;" }="" break;="" case="" 1:="" textx="200;" if(textstopstarttimestamp="=" -1)="" textstopstarttimestamp="currentTimeStamp;" if(currenttimestamp="" -=""> 5000)
				{
					textStopStartTimeStamp = -1;
					textStopState = 2;
				}
				break;
			}
			case 2:
			{
				textX -= (currentTimeStamp - lastTimeStamp) / 25;
				if(textX <= 2="" 150="" 200="" -="" ctx.measuretext(generatename(filename)).width)="" {="" textx="400;" textstopstate="0;" }="" break;="" ctx.textalign="left" ;="" ctx.textbaseline="alphabetic" ctx.filltext(generatename(filename),="" textx,="" 240);="" else="" 300,="" ctx.restore();="" ctx.globalalpha="(Math.max(Math.min(volumeAnimation," 150),="" 50)="" 100;="" ctx.save();="" ctx.beginpath();="" ctx.arc(300,="" radius,="" 0,="" *="" math.pi,="" false);="" ctx.clip();="" ctx.fillstyle="#F8F8F8" ctx.fillrect(150,="" +="" (1="" volume)="" volume="" 300);="" ctx.font="100 75px Roboto" ctx.filltext(math.round(volume="" 100)="" "%",="" ctx.strokestyle="#DDDDDD" ctx.stroke();="" ctx.linewidth="2.0;" 150,="" -0.5="" (elapsedtime="" durationtime)="" math.pi="" (0.5="" math.pi),="" if(volumeanimation=""> 0)
	{
		volumeAnimation -= (currentTimeStamp - lastTimeStamp) / 2.5;
	}
	
	// bug workaround, see https://code.google.com/p/chromium/issues/detail?id=403908
	if(audioPlaying && elapsedTime / durationTime > 1)
	{
		console.log("Manually dispatch 'ended' event...\nsee https://code.google.com/p/chromium/issues/detail?id=403908");
		var e = new Event("ended");
		audioBufferSourceNode.dispatchEvent(e);
	}
	
	if(audioPlaying)
	{
		animationFrameId = requestAnimationFrame(draw);
	}
	
	lastTimeStamp = currentTimeStamp;
}

function showError(title, text)
{
	document.getElementById("error-title").innerHTML = title;
	document.getElementById("error-text").innerHTML = text;
	document.getElementById("error").className = "";
}

function cbErrorButtonClick()
{
	document.getElementById("error").className = "hidden";
}
</=></=>