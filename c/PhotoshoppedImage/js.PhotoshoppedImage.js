"use strict";
/*global isHTMLElement, Coordinates, isChildOf, htmlNodesToArray, findParent, fetter, Attributer, SupportedCSSProperty, hasClass, MouseRecorder, PhotoshoppedImage, document, window, console, isArray, isNumber, BoundaryCoordinates, HTMLClass, findElementStyle, unfetter, debounce, setInterval, clearInterval */
/*jshint -W069 */
function PhotoshoppedImages(){
	if(PhotoshoppedImages.prototype.singleton !== undefined){ return PhotoshoppedImages.prototype.singleton; } else { PhotoshoppedImages.prototype.singleton = this; }
	this.idcount = -1;
	this.tested = 'pending';
	this.shopped_class = 'shopped';
	this.unshopped_class = 'unshopped';
	this.direction = 'right';
	this.mouserecord = '';
	this.varyclip = true;
	this.psimages = []; 
	this.construct(); }
PhotoshoppedImages.prototype.construct = function(){
	this.psimages = [];
	this.mouserecord = new MouseRecorder();
	this.mouserecord.setRecord({
		'name' : 'photoshopped', 
		'jsObject' : this, 
		'type' : 'both'}); };
PhotoshoppedImages.prototype.addImage = function(psi){
	if(psi instanceof PhotoshoppedImage){
		var checked = this.findImage(psi);
		if(!(checked instanceof PhotoshoppedImage)){
			this.psimages.push(psi);
			this.idcount += 1;
			return this.idcount; }} else { return false; }
	return false; };
PhotoshoppedImages.prototype.findImageIdFromHolder = function(holder){
	var id = -1;
	if(holder !== undefined){
		for(var i=0, imax = this.psimages.length; i<imax; i+=1){
			if(holder === this.psimages[i].holder){ return i; }}}
	return id; };
PhotoshoppedImages.prototype.findImageFromHolder = function(holder){
	var id = (holder !== undefined) ? this.findImageIdFromHolder(holder) : -1;
	if(id === -1){
		return null;
	} else { return this.psimages[id]; }};
PhotoshoppedImages.prototype.findImageFromInstance = function(obj){
	if(obj instanceof PhotoshoppedImage){
		for(var i=0, imax=this.psimages.length; i<imax; i+=1){
			if(obj === this.psimages[i]){ return this.psimages[i]; }}}
	return null; };
PhotoshoppedImages.prototype.findImage = function(obj){
	if(obj instanceof PhotoshoppedImage){
		this.findImageFromInstance(obj);
	} else if(isNumber(obj) && obj > -1 && obj < this.psimages.length && parseInt(obj) === obj){
		return this.psimages[obj];
	} else if(obj !== undefined && isHTMLElement(obj)){ return this.findImageFromHolder(obj); }
	return null; };
PhotoshoppedImages.prototype.isCSSReady = function(test){
	if(this.tested !== 'pending'){ 
		return this.tested;
	} else {
		var result = null;
		test = (test !== undefined && test instanceof PhotoshoppedImage) ? test : false;
		result = (test !== false) ? (new SupportedCSSProperty('clip', test.holder)).exists() : (new SupportedCSSProperty('clip')).exists();
		this.tested = result;
		PhotoshoppedImages.prototype.isCSSReady = function(){ return this.tested; }; //overwrite isCSSReady;
		return result; }};
PhotoshoppedImages.prototype.setClipDirection = function(dir, obj){ //obj is optional, when omitted does all;
	dir = (dir === 'up') ? 'bottom' : dir;
	dir = (dir === 'down') ? 'top' : dir;
	if(dir !== undefined){
		if(dir === 'left' || dir === 'right' || dir === 'top' || dir === 'bottom'){
			if(obj !== undefined){
				var n = this.findImage(obj);
				if(n instanceof PhotoshoppedImage){ 
					n.setClipDirection(dir);
					return true;
				} else { return false;  }
			} else {
				this.direction = dir;
				for(var i = 0, imax = this.psimages.length; i<imax; i+=1){
					this.psimages[i].setClipDirection(dir); }}
				return true;
		} else { return false; }
	} else { return false; }};
PhotoshoppedImages.prototype.varyClipDirection = function(boo, obj){
	boo = (boo !== undefined && (boo === true || boo === false)) ? boo : -1;
	boo = (boo === -1) ? !this.varyclip : boo;
	if(obj !== undefined){
		var n = this.findImage(obj);
		if(n instanceof PhotoshoppedImage){ 
			n.varyClipDirection(boo);
			return true;
		} else { return false; }
	} else {
		this.varyclip = boo;
		for(var i=0, imax = this.psimages.length; i<imax; i+=1){
			this.psimages[i].varyClipDirection(boo); }
		return true; }};

function PhotoshoppedImage(o){ 
	this.id = -1;
	this.holder = '';
	this.shopped_image = '';
	this.unshopped_image = '';
	this.master = new PhotoshoppedImages();
	this.full_width = 300;
	this.full_height = 1000;
	this.direction = this.master.direction;
	this.varyclip = this.master.varyclip;
	this.initiated = false;
	this.working = false;
	this.currentpos = new Coordinates();
	return (o !== undefined) ? this.init(o) : this; }
PhotoshoppedImage.prototype.init = function(o){
	var initHolder = "", initShopped = "", initUnshopped = "";
	if(o !== undefined && isHTMLElement(o)){
		initHolder = o;
	} else if('holder' in o){
		initHolder = ('holder' in o && o.holder !== undefined && isHTMLElement(o.holder)) ? o.holder : "";
		initShopped = ('shopped' in o && o.shopped !== undefined && isHTMLElement(o.shopped)) ? o.shopped : "";
		initUnshopped = ('unshopped' in o && o.unshopped !== undefined && isHTMLElement(o.unshopped)) ? o.unshopped : ""; }
	if(initHolder !== ""){
		var n = this.master.findImageIdFromHolder(initHolder);
		if(n !== -1){
			return n;
		} else {
			var childrenArr = [], on = "";
			this.id = this.master.addImage(this);
			this.holder = initHolder;
			if(initShopped !== "" && isChildOf(initShopped, initHolder)){
				this.shopped_image = initShopped;
			} else {
				childrenArr = htmlNodesToArray(this.holder.childNodes);
				while(childrenArr.length > 0){
					if(isHTMLElement(childrenArr[0])){
						if((new HTMLClass()).hasClass(childrenArr[0], this.master.shopped_class)){
							this.shopped_image = childrenArr[0];
							childrenArr = [];
						} else {
							if(childrenArr[0].childNodes){ childrenArr.concat(htmlNodesToArray(childrenArr[0].childNodes)); }}}
					if(childrenArr.length > 0){ childrenArr.shift(); }}}
			if(initUnshopped !== "" && isChildOf(initUnshopped, initHolder)){
				this.unshopped_image = initUnshopped;
			} else {
				childrenArr = htmlNodesToArray(this.holder.childNodes);
				while(childrenArr.length > 0){
					if(isHTMLElement(childrenArr[0])){
						if((new HTMLClass()).hasClass(childrenArr[0], this.master.unshopped_class)){
							this.unshopped_image = childrenArr[0];
							childrenArr = [];
						} else {
							if(childrenArr[0].childNodes){ childrenArr.concat(htmlNodesToArray(childrenArr[0].childNodes)); }}}
					if(childrenArr.length > 0){ childrenArr.shift(); }}}
			this.initiated = (this.id !== false && this.shopped_image !== "" && this.unshopped_image !== "") ? true : false; }
		this.initiated = (this.initiated) ? this.build() : false; }
	return this; };
PhotoshoppedImage.prototype.build = function(){ return (this.prepareHolder() && this.prepareShoppedImage() && this.prepareUnshoppedImage()); };
PhotoshoppedImage.prototype.active = function(){ 
	if(this.initiated && this.holder !== undefined && isHTMLElement(this.holder) && this.shopped_image !== undefined && isHTMLElement(this.shopped_image) && this.unshopped_image !== undefined && isHTMLElement(this.unshopped_image)){
		this.active = function(){ return true; };
	} else { this.active = function(){ return false; }; }
	return this.active; };
PhotoshoppedImage.prototype.calculateFullWidth = function(){
	if(this.active() && this.shopped_image !== undefined && isHTMLElement(this.shopped_image)){
		this.full_width = Math.floor(parseFloat(findElementStyle(this.shopped_image, 'width')));
		return this.full_width;
	} else {
		this.full_width = 0;
		return 0; }};
PhotoshoppedImage.prototype.calculateFullHeight = function(){
	if(this.active() && this.shopped_image !== undefined && isHTMLElement(this.shopped_image)){
		this.full_height = Math.floor(parseFloat(findElementStyle(this.shopped_image, 'height')));
		return this.full_height;
	} else {
		this.full_height = 0;
		return 0; }};
PhotoshoppedImage.prototype.prepareHolder = function(){
	if(this.active() && this.holder !== undefined && isHTMLElement(this.holder)){
		var curr = findElementStyle(this.holder, 'position');
		if(!(curr === 'relative' || curr === 'absolute')){ this.holder.style['position'] = 'relative'; }
		this.setDownActions();
		return true;
	} else { return false; }};
PhotoshoppedImage.prototype.prepareShoppedImage = function(){
	if(this.active() && this.shopped_image !== undefined && isHTMLElement(this.shopped_image)){
		if(findElementStyle(this.shopped_image, 'position') !== 'relative'){ this.shopped_image.style['position'] = 'relative'; }
		//disable ondrag?
		this.currentpos = new Coordinates(this.calculateFullWidth(), this.calculateFullHeight());
		return (this.currentpos.x === 0 || this.currentpos.y === 0) ? false : true;
	} else { return false; }};
PhotoshoppedImage.prototype.prepareUnshoppedImage = function(){
	if(this.active() && this.unshopped_image !== undefined && isHTMLElement(this.unshopped_image)){
		if(findElementStyle(this.unshopped_image, 'position') !== 'absolute'){
			this.unshopped_image.style['position'] = 'absolute';
			this.unshopped_image.style['top'] = 0;
			this.unshopped_image.style['left'] = 0; }
		this.doClip(this.offCoordinates());
		if(findElementStyle(this.unshopped_image, 'visibility') !== 'visible'){ this.unshopped_image.style['visibility'] = 'visible'; }
		return true;
	} else { return false; }};
PhotoshoppedImage.prototype.setMoveActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	obj.removeMoveActions();
	var m = obj;
	obj.interval_id = setInterval(function(){ debounce(function(){ m.moveActions(m); }, 50); });
	return true; };
PhotoshoppedImage.prototype.removeMoveActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	if(obj.interval_id !== null){
		clearInterval(obj.interval_id);
		obj.interval_id = null; }
	return true; };
PhotoshoppedImage.prototype.moveActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	if(obj.working){
		var onCoords = new Coordinates(obj.master.mouserecord.x, obj.master.mouserecord.y);
		var bounds = new BoundaryCoordinates(obj.holder);
		if((onCoords.x >= bounds.x1 && onCoords.x <= bounds.x2) && (onCoords.y >= bounds.y1 && onCoords.y <= bounds.y2)){
			if(this.currentpos.x !== obj.master.mouserecord.x || this.currentpos.y !== obj.master.mouserecord.y){
				var clipCoords = new Coordinates(Math.round(onCoords.x - bounds.x1), Math.round(onCoords.y - bounds.y1));
				this.doClip(clipCoords); }
		} else {
			obj.removeMoveActions();
			obj.removeUpActions();
			obj.setDownActions(); }
	} else { obj.removeMoveActions(); }
	this.currentpos = new Coordinates(obj.master.mouserecord.x, obj.master.mouserecord.y); };
PhotoshoppedImage.prototype.detectClipDirection = function(){
	var onCoords = new Coordinates(this.master.mouserecord.x, this.master.mouserecord.y);
	if(!this.working){
		var bounds = new BoundaryCoordinates(this.holder);
		var o = {
			'top' : onCoords.y - bounds.y1, 
			'bottom' : onCoords.y - bounds.y2, 
			'left' : onCoords.x - bounds.x1, 
			'right' : onCoords.x - bounds.x2 };
		var dir = '', lowest = bounds.y2;
		for(var prop in o){
			if(o.hasOwnProperty(prop)){
				if(Math.abs(o[prop]) <= lowest){
					lowest = Math.abs(o[prop]);
					dir = prop; }}}
		switch(dir){
			case "top":
				dir = 'bottom';
				break;
			case "bottom":
				dir = 'top';
				break;
			case "right":
				dir = 'left';
				break;
			case "left":
			/*falls through*/
			default:
				dir = 'right';
				break; }
		this.setClipDirection(dir); }};
PhotoshoppedImage.prototype.setDownActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	fetter(obj.holder, "mouseenter", function(){ if(obj.varyclip){ obj.detectClipDirection(); }}, true);
	fetter(obj.holder, "mouseenter touchstart", function(){ obj.downActions(obj); }, false);
	return true; };
PhotoshoppedImage.prototype.removeDownActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	unfetter(obj.holder, "mouseenter", function(){ if(obj.varyclip){ obj.detectClipDirection(); }}, true);
	unfetter(obj.holder, "mouseenter touchstart", function(){ obj.downActions(obj); }, false);
	return true; };
PhotoshoppedImage.prototype.downActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	obj.working = true;
	obj.removeDownActions(obj);
	obj.setUpActions(obj);
	obj.setMoveActions(obj);
	return true; };
PhotoshoppedImage.prototype.setUpActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	obj.removeUpActions(obj);
	obj.setDownActions(obj);
	fetter(obj.holder, "mouseleave touchend", function(){ obj.upActions(obj); }, false);
	return true; };
PhotoshoppedImage.prototype.removeUpActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	unfetter(obj.holder, "mouseleave touchend", function(){ obj.upActions(obj); }, false);
	return true; };
PhotoshoppedImage.prototype.upActions = function(obj){
	obj = (obj instanceof PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
	obj.working = false;
	obj.doClip(obj.offCoordinates());
	obj.removeUpActions();
	obj.removeDownActions();
	obj.setDownActions(); 
	return true; };
PhotoshoppedImage.prototype.offCoordinates = function(){ return (new Coordinates((this.direction === 'left') ? this.full_width : 0, (this.direction === 'top') ? this.full_height : 0)); };
PhotoshoppedImage.prototype.varyClipDirection = function(boo){
	boo = (boo !== undefined && (boo === true || boo === false)) ? boo : -1;
	boo = (boo === -1) ? !this.varyclip : boo;
	this.varyclip = boo;
	return true; };
PhotoshoppedImage.prototype.setClipDirection = function(dir){
	dir = (dir === 'up') ? 'bottom' : dir;
	dir = (dir === 'down') ? 'top' : dir;
	if(dir !== undefined && (dir === 'left' || dir === 'right' || dir === 'top' || dir === 'bottom')){
		this.direction = dir;
		var onCoords = this.currentpos;
		var bounds = new BoundaryCoordinates(this.holder);
		if(this.working){
			if((onCoords.x >= bounds.x1 && onCoords.x <= bounds.x2) && (onCoords.y >= bounds.y1 && onCoords.y <= bounds.y2)){
				if(this.currentpos.x !== this.master.mouserecord.x || this.currentpos.y !== this.master.mouserecord.y){
					var clipCoords = new Coordinates(Math.round(onCoords.x - bounds.x1), Math.round(onCoords.y - bounds.y1));
					this.doClip(clipCoords); }}
		} else { this.doClip(this.offCoordinates()); }}};
PhotoshoppedImage.prototype.prepareHolderActions = function(){
	if(this.active() && this.holder !== undefined && isHTMLElement(this.holder)){ 
		this.working = false;
		this.setDownActions(this); }};
PhotoshoppedImage.prototype.doClip = function(coords){
	if(this.direction === 'right' || this.direction === 'left'){
		if(this.active() && this.initiated){
			this.unshopped_image.style['clip'] = 'rect(auto ' + ((this.direction === 'right') ? ((Math.ceil(coords.x)) + 'px') : 'auto') + ' auto ' + ((this.direction === 'left') ? (Math.ceil(coords.x) + 'px') : 'auto') + ')'; }
	} else if(this.direction === 'top' || this.direction === 'bottom'){
		if(this.active() && this.initiated){
			this.unshopped_image.style['clip'] = 'rect(' + ((this.direction === 'top') ? (Math.ceil(coords.y) + 'px') : 'auto') + ', auto, ' + ((this.direction === 'bottom') ? (Math.ceil(coords.y) + 'px') : 'auto') + ', auto)'; }}};