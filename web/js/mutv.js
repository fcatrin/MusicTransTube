function seconds2text(time) {
	var fraction = time - Math.floor(time);
	
	var hours = Math.floor(time / 3600);
	time = time - hours * 3600;
	
	var minutes = Math.floor(time / 60);
	time = time - minutes * 60;
	
	var seconds = Math.floor(time);
	var ms      = Math.floor(fraction * 2);
	
	return padz(hours,2) + ":" + padz(minutes, 2) + ":" + padz(seconds, 2) + "." + padz(ms,2);
}