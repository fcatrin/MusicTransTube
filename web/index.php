<!DOCTYPE html>
<html>
<head>
<?php include "include/htmldecl.php" ?>
<link rel="stylesheet" type="text/css" href="css/index.css" />
<script src="http://www.youtube.com/iframe_api" type="text/javascript"></script>
<script src="js/lib/jquery.leanModal.min.js" type="text/javascript"></script>
<script src="js/mutv.js" type="text/javascript"></script>
<script src="js/index.js" type="text/javascript"></script>
</head>
<body>
<div id="title">MusicTrans "Tube"</div>
<div class="legend">This only a demo of what these kind of applications can do for your practice and learning.<br >
For a more <b>advanced audio tool</b>, check the original <a href="http://musictransapp.com">MusicTrans for Android, PC and Mac</a>.</div>
<div class="legend">This application is designed to be used in a computer</div>
<div class="legend input">
YouTube URL <input type="text" name="txtUrl" id="txtUrl" />
<button id="btnLoad">Load Video</button>
</div>
<div id="video">
	<div id="videoContainer">
		<div id="videoDiv">Loading...</div>
	</div>
</div>
<div id="progressPanel">
	<div id="progressThumb">
		<div id="thumb-w1" class="progressBar">&nbsp;</div>
		<div id="thumb-w2" class="progressBar">&nbsp;</div>
		<div id="thumb-w3" class="progressBar">&nbsp;</div>
		<br clear="all" />
	</div>
	<div id="progressBars">
		<div id="progress-w1" class="progressBar">&nbsp;</div>
		<div id="progress-w2" class="progressBar">&nbsp;</div>
		<div id="progress-w3" class="progressBar">&nbsp;</div>
		<br clear="all" />
	</div>
</div>
<div id="buttons">
	<div id="panelNavigation">
		<div id="loopText"></div>
		<div>
			<button id="btnBack">A<br />&lt;&lt;</button>
			<button id="btnPlay">SPC<br />Play</button>
			<button id="btnForward">S<br />&gt;&gt;</button>
			<button id="btnLoopStart">Q<br />[- LOOP</button>
			<button id="btnLoopEnd">W<br />LOOP -]</button>
			<button id="btnLoopEnd">X<br />Reset</button>
			<button id="btnExpand">Z<br />Expand</button>
		</div>
	</div>
	<div id="panelSpeed">
		<div id="speedText"></div>
		<span id="rateButtons"></span>
	</div>
</div>
</body>
</html>

