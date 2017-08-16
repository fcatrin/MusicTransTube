var querystring = null;
var openMessageFunc = null;

function onInitCore() {
	openMessageFunc = openMessage;
}

function getQueryString(key) {
	if (querystring==null) updateQueryString();
	return querystring[key];
}

function getQueryVars(url) {
	var vars = [], hash;
	var q = url.split('?')[1];
	if(q != undefined){
		q = q.split('&');
		for(var i = 0; i < q.length; i++){
			hash = q[i].split('=');
			vars.push(hash[1]);
			vars[hash[0]] = hash[1];
		}
	}
	return vars;
}

function updateQueryString() {
	querystring = getQueryVars(document.URL);
}

function hasQueryString(key) {
	return getQueryString(key)!=null;
}

function genCode(size) {
	var code = '';
	for(var i=0; i<size; i++) {
		if (Math.random()<0.8) {
			code = code + String.fromCharCode(48 + Math.random()*10);
		} else {
			code = code + String.fromCharCode(65 + Math.random()*24);
		}
	}
	return code;
}
function padz(s, l) {
	s = '0000000' + s;
	return s.substring(s.length-l);
}
function ts2str(d) {
	return d.getDate() + "/" + (d.getMonth()+1) + '/' + (d.getFullYear()) + ' '
	+ padz(d.getHours(),2) + ':' + padz(d.getMinutes(),2) + ':' + padz(d.getSeconds(), 2);
}
function clearTable(selector) {
	$(selector).find("tr:gt(0)").remove();
}
function clearTableFull(selector) {
	$(selector).find("tr").remove();
}
function tag(name, data, className, id) {
	className = className!=null?' class="' + className + '"':'';
	id = id!=null?' id="' + id + '"':'';
	return '<' + name + className + id + '>' + data + '</' + name + '>';
}
function td(data, className) {
	return tag('td', data, className);
}
function tr(data, className) {
	return tag('tr', data, className);
}
function th(data, className) {
	return tag('th', data, className);
}

function img(src, className, id) {
	className = className!=null?' class="' + className + '"':'';
	id = id!=null?' id="' + id + '"':'';
	return '<img src="' + src + '"' + className + id + ' />'; 
}

function rnd(max) {
	return Math.floor(Math.random()*max);
}
function ajaxPost(url, data, onSuccess, onFailure) {
	ajaxRequest(url, 'POST', data, onSuccess, onFailure);
}
function ajaxGet(url, data, onSuccess, onFailure) {
	ajaxRequest(url, 'GET', data, onSuccess, onFailure);
}
function ajaxRequest(url, type, data, onSuccess, onFailure) {
	if (data == null) data = {};
	console.log(type + ' ' + url + ' ' + JSON.stringify(data));
	var request = $.ajax({
		url: url,
		type: type,
		data: data
	});
	request.done(function(response) {
		console.log("request done: " + response);
		if (isEmptyString(response)) {
			if (onSuccess) onSuccess({});
			else console.log('onSuccess not defined');
		} 
		
		var json = eval("(" + response + ")");
		if (json.error != null) {
			if (onFailure == null) openMessageFunc('Error', json.errorMessage != null ? json.errorMessage : json.error);
			else onFailure(json);
		} else onSuccess(json);
	});
	request.fail(function(jqXHR, textStatus) {
		console.log( "request failed: " + textStatus );
		if (typeof onFailure == 'function') onFailure();
	});
}

function openMessage(title, text) {
	alert(title + "\n"+ text);
}

function isEmptyString(s) {
	return s == null || s == '';
}

function redirect(url) {
	window.location.href = url;
}

$(document).ready(onInitCore);