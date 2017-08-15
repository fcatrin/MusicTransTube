<!DOCTYPE html>
<html>
<head>
<?php include "include/htmldecl.php" ?>
<link rel="stylesheet" type="text/css" href="css/index.css" />
<script src="http://www.youtube.com/iframe_api" type="text/javascript"></script>
<script src="js/lib/jquery.leanModal.min.js" type="text/javascript"></script>
<script src="js/index.js" type="text/javascript"></script>
</head>
<body>
<div id="box">
	<div id="video">
		<div id="videoContainer">
			<div id="videoDiv">Loading...</div>
		</div>
	</div>
	<div id="buttons">
		<div id="panelNavigation">
			<div id="loopText"></div>
			<div>
				<button id="btnBack">&lt;&lt;</button>
				<button id="btnPlay">Play</button>
				<button id="btnForward">&gt;&gt;</button>
				<button id="btnLoopStart">[ LOOP</button>
				<button id="btnLoopEnd">LOOP ]</button>
			</div>
		</div>
		<div id="panelSpeed">
			<div id="speedText"></div>
			<span id="rateButtons"></span>
		</div>
	</div>
</div>
</body>
</html>

