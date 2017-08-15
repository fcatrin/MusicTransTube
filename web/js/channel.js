var player;
var slotId = 0;
var programId = 0;
var videoId = '';
var tabs = null;
var selectedTab = 0;
var playlist = null;
var playlistPosition = 0;
var slidePosition = 0;
var nextSlotId = 0;
var prevSlotId = 0;
var channels = null;
var channel = null;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('videoDiv', {
		height: '390',
		width: '640',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	$("#tab1").hide();
	$("#tab2").hide();
	$("#tab3").hide();
	$("#tab1").click(function() {showTab(1);});
	$("#tab2").click(function() {showTab(2);});
	$("#tab3").click(function() {showTab(3);});
	$("div.prev").click(scrollLeft);
	$("div.next").click(scrollRight);
	$("#programPrev").click(getPrevProgram);
	$("#programNext").click(getNextProgram);
	$("#btnSelectChannel").click(selectChannel);
	
}

function onPlayerReady(event) {
	var c = getQueryString('c');
	if (c==null) selectChannel();
	else getChannel(c);
	/*
	var slot = getQueryString('slot');
	if (slot == null) ajaxGet("services/getLivePlaylist.php", {}, setPlaylist);
	else ajaxGet("services/getPlaylist.php", {slot: slot}, setPlaylist);
	*/
}

function onPlayerStateChange(event) {
	$('#videoStatus').html('status: ' + event.data);
	if (event.data == YT.PlayerState.ENDED) moveNext();
	
	var id = player.getVideoUrl().split("&v=")[1];
	if (id!=null && id!=videoId) {
		videoId = id;
		getMoreInfo(videoId);
	}
}

function getNextProgram() {
	ajaxGet("services/getPlaylist.php", {c: channel.id, slot: nextSlotId}, function (result) {
		 setPlaylist(result);
	});
}

function getPrevProgram() {
	ajaxGet("services/getPlaylist.php", {c: channel.id, slot: prevSlotId}, function (result) {
		 setPlaylist(result);
	});
}

function setPlaylist(result) {
	slotId = result.slotId;
	programId = result.programId;
	playlist = result.list;
	playlistPosition = result.first;
	playCurrentVideo(result.position);
	
	setNextProgram(result.nextProgram);
	setPrevProgram(result.prevProgram);
	
	loadProgram();
}

function setPrevProgram(program) {
	prevSlotId = program.slot;
	$('#programPrevTitle').html(program.title);
	$('#programPrevDescription').html(program.content);
}

function setNextProgram(program) {
	nextSlotId = program.slot;
	$('#programNextTitle').html(program.title);
	$('#programNextDescription').html(program.content);
}

function moveNext() {
	playlistPosition++;
	if (playlistPosition>=playlist.length) getNextProgram();
	else {
		playCurrentVideo(0);
	}
}

function playCurrentVideo(start) {
	player.loadVideoById(playlist[playlistPosition], start, 'large');
	slideTo(playlistPosition);
}

function showTabByName(name) {
	var found = 0;
	for(var i=0; i<tabs.length; i++) {
		if (tabs[i] == name) {
			found = i;
			break;
		}
	}
	showTab(found+1);
}

function showTab(n) {
	selectedTab = tabs[n-1];
	for(var i=1; i<=3; i++) {
		var tab = $("#tab" + i);
		if (n!=i) {
			tab.addClass("inactive");
			$("#tab" + i + "content").hide();
		}
		else tab.removeClass("inactive");
		
	}
	$("#tab" + n + "content").show();
}

function getMoreInfo(videoId) {
	ajaxGet("services/getMoreInfo.php", {id: videoId}, onMoreInfo);
}

function onMoreInfo(result) {
	tabs = [];
	for(var i=0; i<result.length; i++) {
		var tab = result[i];
		var type = tab.type;
		tabs[i] = type;
		
		var content = tab.content;
		if (type == 'bio') {
			content = buildBio(content);
		} else if (type == 'lyrics') {
			content = buildLyrics(content);
		} else if (type == 'info') {
			content = buildVideoInfo(content);
		}
		$('#tab' + (i+1)).html(tab.title);
		$('#tab' + (i+1) + "inner").html(content);
		$('#tab' + (i+1)).show();
	}
	showTabByName(selectedTab);
	for(var i=result.length; i<3; i++) {
		$('#tab' + (i+1)).hide();
	}
}

function buildBio(content) {
	var html = '';
	html = html + '<div class="tabContentTitle">' + content.title + '</div>';
	
	var wikilink = '';
	if (content.wikiurl!=null) wikilink = '<a class="awesome medium button" target="_new" href="' + content.wikiurl + '">Leer más en Wikipedia...</a>';
	
	var sitelink = '';
	if (content.siteurl!=null) sitelink = '<a class="awesome medium button" target="_new"  href="' + content.siteurl + '">Ver sitio oficial...</a>';

	var summary = htmlize(content.summary + '\n\n');
	
	html = html + '<div class="tabContent">' + summary + wikilink + sitelink + '</div>';
	return html;
}

function buildLyrics(content) {
	var html = '<div class="tabContentTitle lyrics">' + content.title + '</div>';
	html = html + '<div class="tabContentSubtitle lyrics">' + content.artist + '</div>';
	html = html + '<div class="tabContent lyrics">' + content.content + '</div>';
	return htmlize(html);
}

function buildVideoInfo(content) {
	var html = '<div class="tabContentTitle">' + content.title + '</div>';
	html = html + '<div class="tabContent">' + content.description + '</div>';
	return htmlize(html);
}

function htmlize(text) {
	return replaceAll(text, '\n', '<br />');
}

function loadProgram() {
	ajaxGet("services/admin/getProgram.php", {id: programId}, onGetProgram);
}

function onGetProgram(result) {
	$('#programTitle').html(result.title);
	$('#programDescription').html(result.content);
	$('#runningTime').html('Running time: ' + seconds2time(result.total));
	
	var list = result.list;
	videos = list;
	
	if (videos.length>5) {
		$("div.prev").show();
		$("div.next").show();
	} else {
		$("div.prev").hide();
		$("div.next").hide();
	}
	
	var html = '';
	for(var i=0; list!=null && i<list.length; i++) {
		var video = list[i];
		var thumb = sprintf('<img src="{}" />', video.thumbnailHQ);
		var title = tag('div', video.title, 'title');
		var time = tag('div', seconds2time(video.duration), 'time');
		var thumbdiv = tag('div', thumb + title + time, 'thumb', 'thumb-' + i);
		html = html + thumbdiv;
	}
	$('#program').html(html);
	$('div.thumb img').click(function(event) {
		onClickThumb(this.parentElement.id);
	});
	
	var w = 0;
	for(var i=0; i<list.length; i++) {
		w += $('#thumb-' + i).outerWidth(true);
	}
	
	var min = $('#overflow').width();
	if (w<min) w = min;
	
	$('#program').width(w);
	slideTo(playlistPosition);
}

function getIndex(id) {
	return parseInt(id.substr(id.lastIndexOf("-")+1), 10);
}

function onClickThumb(id) {
	playlistPosition = getIndex(id);
	playCurrentVideo(0);
}

function slideTo(n) {
	if ($('#thumb-0').length == 0) return;
	
	var viewport = $('#overflow').width();
	if (viewport == null) return;
	
	var maximum = $('#program').width() - viewport;
	
	var slotWidth = $('#thumb-0').outerWidth(true);
	var left = (n-2)*slotWidth;   // n - 2 to center thumbnail
	
	if (left<=0) {
		left = 0;
		$("div.prev").hide();
	} else {
		$("div.prev").show();
	}
	if (left>=maximum) {
		left = maximum;
		$("div.next").hide();
	} else {
		$("div.next").show();
	}

	slidePosition = left / slotWidth;
	
	$('#program').animate({left: '-' + left + 'px'}, 400);
	
	for(var i=0; i<videos.length; i++) {
		var thumb = $('#thumb-' + i);
		thumb.fadeTo(800, i==playlistPosition?1.0:0.5);
		if (i == playlistPosition) thumb.addClass('active-thumb');
		else thumb.removeClass('active-thumb');
	}
	
}

function scrollLeft() {
	slideTo(slidePosition-1+2);
}

function scrollRight() {
	slideTo(slidePosition+1+2);
}

function selectChannel() {
	openModal('#channelSelectorPopup');
	getChannels();
}

function getChannels() {
	ajaxGet('services/getChannels.php', {c: channel==null?null:channel.id}, onGetChannelsCallback);
}

function onGetChannelsCallback(result) {
	var html = '';
	channels = result.list;
	for(var i=0; channels!=null && i<channels.length; i++) {
		var c = channels[i];
		var thumb = sprintf('<img src="{}" title="{}" />', [c.icon, c.content]);
		var title = tag('div', c.title, 'title');
		var box = tag('div', thumb+title, 'channelbox', 'channelthumb-' + i);
		
		var selectedClass = channel==null?'':(c.id == channel.id?' selected':'');
		var thumbdiv = tag('div', box , 'channelthumb' + selectedClass);
		html = html + thumbdiv;
	}
	$('#channels').html(html);
	
	$('.channelbox').click(function(event) {
		changeChannel(this.id);
	});
}

function changeChannel(id) {
	var index = getIndex(id);
	getChannel(channels[index].id);
	closeModal('#channelSelectorPopup');
}

function getChannel(id) {
	ajaxGet('services/getChannel.php', {id: id}, onGetChannelCallback);
}

function onGetChannelCallback(result) {
	channel = result;
	$('#channelTitle').html(channel.title);
	$('#channelDescription').html(channel.content);
	
	var logo = sprintf('<img src="{}" class="channelLogo" title="Watch now live!" />', [channel.icon, channel.content]);
	$('#channelLogo').html(logo);
	ajaxGet("services/getLivePlaylist.php", {c: channel.id}, setPlaylist);

	$('img.channelLogo').click(function() {
		getChannel(channel.id);  // back to "live"
	});
}

