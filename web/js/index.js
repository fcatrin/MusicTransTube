var player;

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
	player.loadVideoById(videoId, 0, 'large');
}

function onPlayerStateChange(event) {
}

function playCurrentVideo() {
	
}

