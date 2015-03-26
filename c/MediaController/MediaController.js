"use strict";
/* global window, document, MediaObject, getAttributer, setAttributer, im_vbsObjectCorrection, MimeLibrary, fetter, MediaSourceObject, MediaObject, isHTMLElement, findElementsByTag */
function checkHTML4ObjectTags(){
	if('all' in document && window.vbsActive){ im_vbsObjectCorrection(); }}

function MediaController(){
	if(MediaController.prototype.singleton !== undefined){ return MediaController.prototype.singleton; }
	MediaController.prototype.singleton = this;
	this.taglist = [];
	var c = this;
	fetter(document, "DOMContentLoaded", c.checkAll()); }
MediaController.prototype.canHTML5Audio = function(){
	if(MediaController.prototype._canHTML5Audio !== undefined){ return MediaController.prototype._canHTML5Audio; }
	var elem = document.createElement('audio');
	MediaController.prototype._canHTML5Audio = (!isHTMLElement(elem) || elem !== "[object HTMLAudioElement]") ? false : true;
	return MediaController.prototype._canHTML5Audio; };
MediaController.prototype.canHTML5Video = function(){
	if(MediaController.prototype._canHTML5Video !== undefined){ return MediaController.prototype._canHTML5Video; }
	var elem = document.createElement('video');
	MediaController.prototype._canHTML5Video = (!isHTMLElement(elem) || elem !== "[object HTMLVideoElement]") ? false : true;
	return MediaController.prototype._canHTML5Video; };
MediaController.prototype.needsVBSCorrection = function(){
	if(MediaController.prototype._needsVBSCorrection !== undefined){ return MediaController.prototype._needsVBSCorrection; }
	MediaController.prototype._needsVBSCorrection = ('all' in document && window.vbsActive) ? true : false; };

MediaController.prototype.checkHTML5VideoTags = function(){
	if(!this.canHTML5Video()){
		var videoTagList = findElementsByTag('video');
		for(var i=0, imax = videoTagList.length; i < imax; i += 1){
			if(!this.beenChecked(videoTagList[i])){
				this.taglist.push(videoTagList[i]);
				var tempVideoObj = new MediaObject();
				tempVideoObj.processMediaObject(videoTagList[i]);
				tempVideoObj.writeHTML4Object(); //need to do an add here for this.taglist;
			}}}};

MediaController.prototype.checkHTML5AudioTags = function(){
	if(!this.canHTML5Audio()){
		var audioTagList = findElementsByTag('audio');
		for(var i=0, imax = audioTagList.length; i < imax; i += 1){
			if(!this.beenChecked(audioTagList[i])){
				this.taglist.push(audioTagList[i]);
				var tempAudioObj = new MediaObject();
				tempAudioObj.process(audioTagList[i]);
				tempAudioObj.writeHTML4Object(); //need to do an add here for this.taglist;
			}}}};

MediaController.prototype.checkAll = function(){
	this.checkHTML5AudioTags();
	this.checkHTML5AudioTags();
	if(this.needsVBSCorrection()){ im_vbsObjectCorrection(); }
	return true; };
MediaController.prototype.beenChecked = function(elem){
	var found = false;
	for(var i=0, imax = this.taglist.length; i < imax; i += 1){
		if(elem === this.taglist[i]){ found = true; break; }}
	return found; };
	
function MediaObject(){
	this._autoplay = "true";
	this._class = "";
	this._controls = "true";
	this._height = 0;
	this._id = "";
	this._loop = "true";
	this._name = "true";
	this._poster = "";
	this._preload = "auto";
	this._width = 0;
	this.sourcelist = [];
	this.valid = false;
	this.element = ""; }

MediaObject.prototype.process = function(elem){
	this._autoplay = (getAttributer(elem, "autoplay") !== null) ? getAttributer(elem, "autoplay") : this._autoplay;
	this._class = (getAttributer(elem, "class") !== null) ? getAttributer(elem, "class") : this._class;
	this._controls = (getAttributer(elem, "controls") !== null) ? getAttributer(elem, "controls") : this._controls;
	this._height = (getAttributer(elem, "height") !== null) ? getAttributer(elem, "height") : this._height;
	this._id = (getAttributer(elem, "id") !== null) ? getAttributer(elem, "id") : this._id;
	this._loop = (getAttributer(elem, "loop") !== null) ? getAttributer(elem, "loop") : this._loop;
	this._name = (getAttributer(elem, "name") !== null) ? getAttributer(elem, "name") : this._name;
	this._poster = (getAttributer(elem, "poster") !== null) ? getAttributer(elem, "poster") : this._poster;
	this._preload = (getAttributer(elem, "preload") !== null) ? getAttributer(elem, "preload") : this._preload;
	this._width = (getAttributer(elem, "width") !== null) ? getAttributer(elem, "width") : this._width;
	
	this.element = elem;
	this.processSourceList(elem);
	this.valid = (this.sourcelist.length > 0) ? true : false; };

MediaObject.prototype.processSourceList = function(elem){
	var tempSourceObj = "";
	if(getAttributer(elem, "src") !== null){
		tempSourceObj = new MediaSourceObject({
			'src' : getAttributer(elem, 'src'), 
			'type' : getAttributer(elem, 'type')});
		if(tempSourceObj.valid){ this.sourcelist.unshift(tempSourceObj); }}
	if("getElementsByTagName" in elem){
		var srclist = elem.getElementsByTagName("source"); //this isn't being picked up properly in ie;
		if(srclist.length === 0 && elem === "[object HTMLUnknownElement]"){
			if(!elem.hasChildNodes()){
				srclist = [];
				var onElem = elem;
				var closeElemName = onElem.nodeName;
				var closedElemName = "/" + closeElemName;
				do {
					onElem = onElem.nextSibling;
					if(onElem.nodeName === "SOURCE"){ srclist.push(onElem); }
					if(!onElem.nextSibling){ break; }
				} while (onElem.nextSibling.nodeName !== closeElemName && onElem.nextSibling.nodeName !== closedElemName); }}
		for(var i = 0, imax = srclist.length; i < imax; i += 1){
			tempSourceObj = new MediaSourceObject({
					"src" : getAttributer(elem, 'src'), 
					"type" : getAttributer(elem, "type"), 
					"codec" : getAttributer(elem, "codec")});
			if(tempSourceObj.valid){ this.sourcelist.push(tempSourceObj); }}
		this.rationalSourcelist();
		tempSourceObj = ""; }};

MediaObject.prototype.rationaliseSourceList = function(){
	var pluginValid = false;
	for(var i = 0; i < this.sourcelist.length; i += 1){
		pluginValid = (this.sourcelist[i].type !== null) ? (new MimeLibrary()).checkMimeType(this.sourcelist[i].type) : true;
		if(!pluginValid){
			this.sourcelist.splice(i, 1);
			i -= 1;
			if(this.sourcelist.length === 0){ break; }}}
	this.valid = (this.sourcelist.length > 0) ? true : false;
	return this.valid; };
	
MediaObject.prototype.writeHTML4Object = function(){
	if(this.valid){
		var addElem, addElemList = [], str = "", isIE = false;
		for(var i = 0, imax = this.sourcelist.length; i < imax; i += 1){
			var objElem = document.createElement('object');
			if(objElem !== "[object HTMLObjectElement]"){
				isIE = true;
				objElem = document.createElement('iefixforinvalid'); }
			setAttributer(objElem, 'data', this.sourcelist[i].src);
			if(this._class !== null){ setAttributer(objElem, "class", this._class); }
			if(this.sourcelist[i].type){ setAttributer(objElem, "type", this.sourcelist[i].type); }
			if(this._width !== 0){ setAttributer(objElem, "width", this._width); }
			// if(this._height != 0){ setAttributer(objElem, "height", this._height); //for some reason - controls? crashing ie;
			objElem.appendChild(this.createParamTag('autoplay', this._autoplay));
			objElem.appendChild(this.createParamTag('loop', this._loop));
			objElem.appendChild(this.createParamTag('preload', this._preload));
			objElem.appendChild(this.createParamTag('controller', this._controls));
			//bathwater;
			objElem.appendChild(this.createParamTag('controller', this._controls));
			objElem.appendChild(this.createParamTag('src', getAttributer(objElem, 'data')));
			objElem.appendChild(this.createParamTag('filename', getAttributer(objElem, 'data')));
			objElem.appendChild(this.createParamTag('url', getAttributer(objElem, 'data')));
			if(i === 0){
				//these are the ones that should only be added once;
				if(this._id !== null){ setAttributer(objElem, 'id', this._id); }
				if(this._name !== null){ setAttributer(objElem, 'name', this._name); }
				addElemList.push(objElem); }
			if(this._poster !== ""){
				var imgElem = document.createElement('img');
				setAttributer(imgElem, 'src', this._poster);
				if(this._width !== null){ setAttributer(imgElem, 'width', this._width); }
				if(this._height !== null){ setAttributer(imgElem, 'height', this._height); }
				addElemList.push(objElem); }
			addElem = addElemList.shift();
			for(var n = 0, nmax = addElemList.length; n < nmax; n += 1){ addElem.appendChild(addElemList[i]); }
			var tarNode = this.element.parentNode;
			if(isIE){
				var tempElem = document.createElement('div');
				tempElem.appendChild(addElem);
				str = tempElem.innerHTML;
				str = str.replace(/iefixforinvalid/g, 'OBJECT');
				addElem = document.createElement('div');
				addElem.innerHTML = str; }
			tarNode.insertBefore(addElem, this.element);
			if(this.element === "[object HTMLUnknownElement]" && !this.element.hasChildNodes()){
				var onElem = this.element;
				var closeElemName = this.element.nodeName;
				var closedElemName = '/' + closeElemName;
				do {
					var theElem = onElem;
					onElem = onElem.nextSibling;
					theElem.parentNode.removeChild(theElem);
				} while (onElem !== undefined && onElem.nodeName !== closeElemName && onElem.nodeName !== closedElemName);
				onElem.parentNode.removeChild(onElem);
			} else { tarNode.removeChild(this.element); }}}};
MediaObject.prototype.createParamTag = function(n, v){
	var paramElem = document.createElement('param');
	setAttributer(paramElem, 'name', n);
	setAttributer(paramElem, 'value', v);
	return paramElem; };


function MediaSourceObject(){
	this.src = "";
	this.type = "";
	this.codec = "";
	this.valid = false;
	this.exists = true;
	
	if(arguments && arguments.length > 0){
		if(arguments.length === 1 && typeof arguments[0] === 'object'){
			this.src = ('src' in arguments[0] && arguments[0].src !== null) ? arguments[0].src : this.src;
			this.type = ('type' in arguments[0] && arguments[0].type !== null) ? arguments[0].type : this.type;
			this.codec = ('codec' in arguments[0] && arguments[0].codec !== null) ? arguments[0].codec : this.codec;
		} else {
			if(arguments[0] !== undefined && arguments[0] !== null){ this.src = arguments[0]; }
			if(arguments[1] !== undefined && arguments[1] !== null){ this.type = arguments[1]; }
			if(arguments[2] !== undefined && arguments[2] !== null){ this.codec = arguments[2]; }}}
	this.valid = (this.src !== null) ? true : false; }



