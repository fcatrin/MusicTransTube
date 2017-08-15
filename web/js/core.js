
var querystring = null;

function getQueryString(key) {
	if (querystring==null) updateQueryString();
	return querystring[key];
}

function updateQueryString() {
	var vars = [], hash;
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
    }
    querystring = vars;
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

	var request = $.ajax({
		  url: url,
		  type: type,
		  data: data
	});
	
	request.done(function(response) {
		if (response==null || response == "") return;
		var json = eval("(" + response + ")");
		
		if (json.error != null) alert(json.error);
		else onSuccess(json);
	});

	request.fail(function(jqXHR, textStatus) {
		alert( "Request failed: " + textStatus );
		if (typeof onFailure == 'function') onFailure();
	});
}

function goBack() {
	history.go(-1);
}

function replaceAll(src, needle, replace ){
	while (src.toString().indexOf(needle) != -1)
		  src = src.toString().replace(needle,replace);
	return src;
}

function sprintf(s, a) {
	if (a instanceof Array) {
		for(var i=0; i<a.length; i++) s = s.replace('{}', a[i]);
		return s;
	} else {
		return s.replace('{}', a);
	}
}

function seconds2time(s) {
	var hh = '00';
	var mm = '00';
	var ss = '00';
	if (s>3600) {
		hh = Math.floor(s / 3600);
		s = s % 3600;
	}
	if (s>60) {
		mm = padz(Math.floor(s / 60), 2);
		s = s % 60;
	}
	ss = padz(s, 2);
	if (hh=='00') return mm + ':' + ss;
	else return hh + ':' + mm + ':' + ss;
}

function isEmptyString(s) {
	return s == null || $.trim(s) == '';
}