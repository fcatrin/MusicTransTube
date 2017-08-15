var player;
var loopStart = -1;
var loopEnd   = -1;
var MOVE_SECONDS = 2;

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

function onPlayerReady(event) {
	var videoId = getQueryString('v');
	player.cueVideoById(videoId, 0, 'large');
	
	$('#btnBack').click(onMoveBackPressed);
	$('#btnPlay').click(onPlayPausePressed);
	$('#btnForward').click(onMoveForwardPressed);

	$('#btnLoopStart').click(onLoopStartPressed);
	$('#btnLoopEnd')  .click(onLoopEndPressed);
	
	displayLoopInfo();
	
	setInterval(updatePlayerInfo, 250);
	
	$(document).keypress(onKeyPress);
}

function onKeyPress(e) {
	switch (e.which) {
	case 32  : onPlayPausePressed();   break;
	case 113 : onLoopStartPressed();   break;
	case 119 : onLoopEndPressed();     break;
	case 97  : onMoveBackPressed();    break;
	case 115 : onMoveForwardPressed(); break;
	}
	console.log(e.which);
}

function onPlayerStateChange(event) {
}


function updatePlayerInfo() {
	var position = player.getCurrentTime();
	if (loopStart >= 0 && loopEnd >= 0) {
		if (position >= loopEnd) {
			player.seekTo(loopStart, true);
		}
	}
}

function onLoopStartPressed() {
	loopStart = loopStart >= 0 ? -1 : player.getCurrentTime();
	if (loopStart>=0 && loopStart > loopEnd) {
		loopEnd = -1;
	}
	displayLoopInfo();
}

function onLoopEndPressed() {
	loopEnd = loopEnd >= 0 ? -1 : player.getCurrentTime();
	if (loopEnd>=0 && loopEnd < loopStart) {
		loopStart = -1;
	}
	displayLoopInfo();
}

function onPlayPausePressed() {
	var state = player.getPlayerState();
	if (state == 1) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
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

function displayLoopInfo() {
	var loopText = "Loop [ ";
	if (loopStart >= 0) {
		loopText += loopStart;
	} else {
		loopText += "N";
	}
	
	loopText += " -> ";
	
	if (loopEnd >= 0) {
		loopText += loopEnd;
	} else {
		loopText += "N";
	}

	loopText += " ]";
	
	$('#loopText').text(loopText);
}