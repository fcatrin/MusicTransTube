<!DOCTYPE html>
<html>
<head>
<?php include "include/htmldecl.php" ?>
<link rel="stylesheet" type="text/css" href="css/channel.css" />
<script src="http://www.youtube.com/iframe_api" type="text/javascript"></script>
<script src="js/lib/jquery.leanModal.min.js" type="text/javascript"></script>
<script src="js/channel.js" type="text/javascript"></script>
</head>
<body>
<div id="box">
<div id="channel">
	<div id="channelLogo"></div>
	<div id="channelInfo">
		<div id="channelTitle"></div>
		<div id="channelDescription"></div>
		<div id="channelMenu">
			<div id="channelSelector">
				<a class="awesome medium button awchannel" id="btnSelectChannel">Select channel</a>
			</div>
		</div>
	</div>
</div>
<div id="video">
	<div id="videoContainer">
		<div id="videoDiv">Loading...</div>
	</div>
	<div id="videoDesc">
		<div id="tabs">
			<div id="tab1" class="tab"></div>
			<div id="tab2" class="tab"></div>
			<div id="tab3" class="tab"></div>
			<br clear="all" />
		</div>
		<div id="tab1content" class="tabcontent">
			<div id="tab1inner" class="tabinner"></div>
		</div>
		<div id="tab2content" class="tabcontent">
			<div id="tab2inner" class="tabinner"></div>
		</div>
		<div id="tab3content" class="tabcontent">
			<div id="tab3inner" class="tabinner"></div>
		</div>
	</div>
</div>

<div id="programNav">
	<div id="programPrev" class="programBox">
		<div class="position">Previous program</div>
		<div id="programPrevTitle" class="programTitle"></div>
		<div id="programPrevDescription" class="programDescription"></div>
	</div>
	<div id="programCurrent" class="programBox">
		<div class="position">Now watching</div>
	<div id="programTitle" class="programTitle"></div>
		<div id="programDescription" class="programDescription"></div>
	</div>
	<div id="programNext" class="programBox">
		<div class="position">Next program</div>
		<div id="programNextTitle" class="programTitle"></div>
		<div id="programNextDescription" class="programDescription"></div>
	</div>
	<br clear="all" />
</div>
<div id="slider">
	<div class="gal_btn prev"></div>
	<div class="gal_btn next"></div>

	<div id="overflow">        
		<div id="program"></div>
	</div>
</div>
<div id="channelSelectorPopup" class="popup">
	<h1>Select channel</h1>
	<div id="channels"></div>
</div>
</div>
</body>
</html>

