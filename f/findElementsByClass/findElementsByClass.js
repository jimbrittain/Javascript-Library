"use strict";
/* global document */
function findElementsByClass(_tag, _class){
	var checkArray = [], returnArray = [];
	if(_tag === "*"){
		if('getElementsByTagName' in document){
			checkArray = document.getElementsByTagName('*');
		} else if('all' in document){
			checkArray = document.all;
		} else if('layers' in document){
			checkArray = document.layers; }
	} else {
		if('getElementsByTagName' in document){
			checkArray = document.getElementsByTagName(_tag);
		} else if('all' in document){
			checkArray = document.all.tags(_tag);
		} else if('layers' in document){
			checkArray = document.layers[_tag]; }
	}
	if(_class !== ''){
		var classArr = [], isClass = false;
		for(var i=0, imax = checkArray.length; i < imax; i += 1){
			if('className' in checkArray[i] && checkArray[i].className !== ""){
				isClass = false;
				classArr = [];
				if(checkArray[i].className.indexOf(' ') !== -1){
					classArr = checkArray[i].className.split(' ');
				} else { classArr[0] = checkArray[i].className; }
				
				for(var j=0, jmax = classArr.length; j<jmax; j += 1){
					if(classArr[j] === _class){
						isClass = true;
						returnArray.push(checkArray[i]);
						break; }}}}
	} else { returnArray = checkArray; }
	return returnArray; }