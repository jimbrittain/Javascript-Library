"use strict";
/*jshint -W002 */
/* global XMLSerializer, window */
function replaceXMLContents(_target, _replace, fallback){
	do { _target.removeChild(_target.lastChild);
	} while(_target.childNodes.length > 0);
	try {
		do { _target.appendChild(_replace.firstChild);
		} while(_replace.childNodes.length > 0);
	} catch(e){
		for(var i=0, imax=_replace.childNodes.length; i<imax; i+=1){
			try {
				var serializer = new XMLSerializer();
				var text = serializer.serializeToString(_replace.childNodes[i]);
				_target.innerHTML = _target.innerHTML + text;
			} catch(e){
				if(_replace.childNodes[i].xml !== undefined){
					_target.innerHTML = _target.innerHTML + _replace.childNodes[i].xml;
				} else { 
					if(typeof fallback === 'function'){
						fallback();
					} else if(typeof fallback === 'string'){
						window.location = fallback; }
				}}}}
	_target.innerHTML = _target.innerHTML.replace(/></, "> <"); } 