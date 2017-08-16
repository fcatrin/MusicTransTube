var player;
var loopStart = -1;
var loopEnd   = -1;
var MOVE_SECONDS = 2;
var rates;
var rateNames;
var ratesUpdated = false;
var videoExpanded = false;

var VIDEO_WIDTH = 640;
var VIDEO_HEIGHT = 390;
var THUMB_WIDTH = 4;

var SECONDS_HOUR = 3600;

var currentVideoWidth = VIDEO_WIDTH;

function onInit() {
	$('#btnLoad').click(onLoadPressed);
}

function onLoadPressed() {
	var url = $('#txtUrl').val();
	var vars = getQueryVars(url);
	if (vars!=null && vars['v'] != null) {
		redirect('index.php?v=' + vars['v'] );
	} else {
		alert("Invalid YouTube URL, make sure that it includes the Video Id (v=....)");
	}
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('videoDiv', {
		height: '390',
		width: '640',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady() {
	var videoId = getQueryString('v');
	if (videoId==null) return;
	
	var videoUrl = "https://www.youtube.com/watch?v=" + videoId;
	$('#txtUrl').val(videoUrl);
	
	player.cueVideoById(videoId, 0, 'large');
	
	$('#btnBack').click(onMoveBackPressed);
	$('#btnPlay').click(onPlayPausePressed);
	$('#btnForward').click(onMoveForwardPressed);

	$('#btnLoopStart').click(onLoopStartPressed);
	$('#btnLoopEnd')  .click(onLoopEndPressed);
	
	$('#btnReset') .click(onResetPressed);
	$('#btnExpand').click(onExpandPressed);
	
	displayLoopInfo();
	displaySpeedInfo('Normal');
	
	setInterval(updatePlayerInfo, 250);
	
	$(document).keypress(onKeyPress);
	
	$('#video').show();
	$('#buttons').show();
}

function onKeyPress(e) {
	if (e.which >= 49 && e.which < 58){
		var index = e.which - 49;
		if (index <= rates.length) {
			setSpeed(index);
		}
	} else {
		switch (e.which) {
		case 32  : onPlayPausePressed();   break;
		case 113 : onLoopStartPressed();   break;
		case 119 : onLoopEndPressed();     break;
		case 97  : onMoveBackPressed();    break;
		case 115 : onMoveForwardPressed(); break;
		case 120 : onResetPressed(); break;
		case 122 : onExpandPressed(); break;
		}
	}
	console.log(e.which);
}

function onPlayerStateChange(event) {
	if (player.getPlayerState() == 1) { // play
		if (!ratesUpdated) {
			ratesUpdated = true;
			updatePlaybackRates();
		}
	}
}


function updatePlayerInfo() {
	var position = player.getCurrentTime();
	if (loopStart >= 0 && loopEnd >= 0) {
		if (position >= loopEnd) {
			player.seekTo(loopStart, true);
		}
	}
	updateProgress();
}

function onLoopStartPressed() {
	loopStart = player.getCurrentTime();
	if (loopStart > loopEnd) {
		loopEnd = -1;
	}
	displayLoopInfo();
}

function onLoopEndPressed() {
	loopEnd = player.getCurrentTime();
	if (loopEnd < loopStart) {
		loopStart = -1;
	}
	displayLoopInfo();
}

function onPlayPausePressed() {
	var state = player.getPlayerState();
	var wasPlaying = state == 1;
	if (wasPlaying) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
	updateButtonPressed('#btnPlay', !wasPlaying);
}

function onMoveBackPressed() {
	var position = player.getCurrentTime() - MOVE_SECONDS;
	if (position < 0) position = 0;
	
	player.seekTo(position, true);
}

function onMoveForwardPressed() {
	var position = player.getCurrentTime() + MOVE_SECONDS;
	
	player.seekTo(position, true);
}

function onResetPressed() {
	loopStart = -1;
	loopEnd = -1;
	displayLoopInfo();
	setSpeed(-1);
}

function displayLoopInfo() {
	var showHour = player.getDuration() >= SECONDS_HOUR;
	
	var loopText = "Loop [ ";
	if (loopStart >= 0) {
		loopText += seconds2text(loopStart, showHour);
	} else {
		loopText += "N";
	}
	
	loopText += " -> ";
	
	if (loopEnd >= 0) {
		loopText += seconds2text(loopEnd, showHour);
	} else {
		loopText += "N";
	}

	loopText += " ]";
	
	$('#loopText').text(loopText);
	
	updateButtonPressed('#btnLoopStart', loopStart >= 0);
	updateButtonPressed('#btnLoopEnd', loopEnd >= 0);
}

function updateButtonPressed(selector, pressed) {
	var element = $(selector);
	var className = 'button-pressed';
	if (pressed) {
		element.addClass(className);
	} else {
		element.removeClass(className);
	}
}

function updatePlaybackRates() {
	rates = player.getAvailablePlaybackRates();
	rateNames = [];
	var html = '';
	for(var i=0; i<rates.length; i++) {
		var rate = rates[i];
		var rateText = rate == 1? "Normal" : ((rate * 100) + '%');
		rateNames[i] = rateText;
		var button = tag('button', (i+1) + '<br/>' + rateText, 'btnRate', 'btnRate-' + i); 
		html += button + ' ';
	}
	$('#rateButtons').html(html);
	$('.btnRate').click(onButtonRatePressed);
	$('#panelSpeed').show();
	setSpeed(-1);
}

function getIndex(id) {
	return parseInt(id.substr(id.lastIndexOf("-")+1), 10);
}

function onButtonRatePressed() {
	var index = getIndex(this.id);
	setSpeed(index);
}

function setSpeed(index) {
	if (index == -1) {
		for(var i=0; index < 0 && i<rates.length; i++) {
			if (rates[i] == 1) index = i;
		}
		if (index < 0) index = 0;
	}
	var rate = rates[index];
	player.setPlaybackRate(rate);
	displaySpeedInfo(rateNames[index]);
	
	for(var i=0; i<rates.length; i++) {
		var selector = '#btnRate-' + i;
		updateButtonPressed(selector, i == index);
	}
}

function displaySpeedInfo(speedText) {
	$('#speedText').text('Speed: ' + speedText);
}

function onExpandPressed() {
	videoExpanded = !videoExpanded;
	if (videoExpanded) {
		var ratio = VIDEO_WIDTH / VIDEO_HEIGHT;
		var h = $(window).height() * 0.95;
		var w = $(window).width() * 0.95;
		var videoWidth = h * ratio;
		var videoHeight = w / ratio;
		
		if (videoWidth > w) {
			videoWidth = w;
		} else if (videoHeight > h) {
			videoHeight = h;
		}
		player.setSize(videoWidth, videoHeight);
		currentVideoWidth = videoWidth;
	} else {
		player.setSize(VIDEO_WIDTH, VIDEO_HEIGHT);
		currentVideoWidth = VIDEO_WIDTH;
	}
	updateProgress();
}

function updateProgress() {
	var timeTotal = player.getDuration();
	
	if (timeTotal == 0) return;
	
	$('#progressPanel').show();
	
	var currentPosition = player.getCurrentTime();
	var timeText = seconds2text(currentPosition, timeTotal >= SECONDS_HOUR);
	$('#elapsedText').text(timeText);

	var width = currentVideoWidth;
	var ratio = width / timeTotal;
	
	var w1 = Math.floor(currentPosition * ratio);
	var t1 = w1;
	var w2 = 0;
	if (loopStart>=0 && loopEnd >=0) {
		w2 = Math.floor((loopEnd - loopStart) * ratio);
		w1 = Math.floor(loopStart * ratio);
	}
	var w3 = width - w1 - w2;
	
	/* thumb widhts */
	var t2 = THUMB_WIDTH;
	t1 = t1 - THUMB_WIDTH / 2;
	if (t1 < 0 ) t1 = 0;
	var t3 = width - t1 - t2;
	if (t3 < 0) t3 = 0;
	
	$('#progressBars').css({width: width});
	$('#progressThumb').css({width: width});
	
	
	$('#progress-w1').css({width: w1});
	$('#progress-w2').css({width: w2});
	$('#progress-w3').css({width: w3});
	
	$('#thumb-w1').css({width: t1});
	$('#thumb-w2').css({width: t2});
	$('#thumb-w3').css({width: t3});

}

$( document ).ready(function() {
    onInit();
});
