"use strict";
/* global SupportedCSSProperty, IMDebugger, isElementAnOnlyChild, ImageInterpolater, ImageInterpolateMethod, isElementOnlyChild, console, window, document, HTMLImageElement, navigator, $ */
/*jshint -W069 */ // Turn off dot notation

/**
 * InterpolateImages.js
 * Javascript Interpolate Image Catch
 * 
 * @module InterpolateImages
 * @class InterpolateImages
 * @constructor
 * 
 * @requires SupportedCSSProperty, ImageInterpolater, ImageInterpolateMethod, isElementOnlyChild
 * 
 * @author JDB - jim@immaturedawn.co.uk 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
 * @version - 0.2
 * to call
 * 			var i = new InterpolateImages();
 * 				i.init(); //After Document Ready;
 */


function InterpolateImages(){
	if(InterpolateImages.prototype.singletonInstance){ return InterpolateImages.prototype.singletonInstance; }
	InterpolateImages.prototype.singletonInstance = this;
	this.list = [];
	this.active = false;
	this.resamplingMethod = -1;
	this.methods = []; 
	if('immaturedawn' in window && 'prepopulatedIIMethods' in window.immaturedawn && (window.immaturedawn.prepopulatedIIMethods.length > 0)){
		for(var i=0; i < window.immaturedawn.prepopulatedIIMethods.length; i+=1){ this.addMethod(window.immaturedawn.prepopulatedIIMethods[i]); }
	}
}
/**
 * InterpolateImages.hasResamplingMethod
 * @method hasResamplingMethod
 * @requires SupportedCSSProperty
 */
InterpolateImages.prototype.hasResamplingMethod = function(){
	if(this.resamplingMethod === -1){ this.resamplingMethod = ((new SupportedCSSProperty('image-rendering').exists) || (new SupportedCSSProperty('msInterpolationMode').exists) || (new SupportedCSSProperty('msZoom').exists)) ? true : false; }
	return this.resamplingMethod; };

InterpolateImages.prototype.init = function(){
	//need to detect if document is ready;
	var i = 0;
	if(!this.hasResamplingMethod()){
		this.list = [];
		for(i=0; i < this.methods.length; i += 1){
			if(!this.methods[i].test()){
				this.methods.splice(i, 1);
				i -= 1; }}
		var allImages = ('getElementsByTagName' in document) ? document.getElementsByTagName('img') : (('all' in document) ? document.all.tags('IMG') : (('images' in document) ? document.images : []));
		if((this.methods.length > 0) && allImages.length > 0){
			for(i=0; i < allImages.length; i += 1){
				var tempObj = new ImageInterpolater();
				for(var j=0, jmax = this.methods.length; j<jmax; j += 1){
					if(this.methods[j].init(tempObj) && tempObj.valid){
						this.addImage(tempObj);
						break; }}}}
		if(this.list.length > 0){
			this.active = true;
			//add a resolve;
		}
		//If possible add a prototype that detects a new image being added to the document and sorts it;
	}
	return this.active; };
InterpolateImages.prototype.imageExists = function(img){
	if(img instanceof HTMLImageElement){
		for(var i=0, max = this.list.length; i < max; i += 1){
			if(this.list[i].image === img){ return true; }}
		return false;
	} else {
		(new IMDebugger()).pass("InterpolateImages.imageExists was supplied an invalid image object");
		return false; }};

InterpolateImages.prototype.addImage = function(obj){
	if(obj instanceof ImageInterpolater){
		if(!this.imageExists(obj.image)){ 
			this.list.push(obj);
			return true;
		} else { return false; }
	} else {
		(new IMDebugger()).pass("InterpolateImages.addImage expects an ImageInterpolater Object");
		return false; }};

InterpolateImages.prototype.methodExists = function(obj){
	if(obj instanceof ImageInterpolateMethod){
		for(var i=0, max = this.methods.length; i < max; i += 1){
			if(obj.name === this.methods[i].name){ return this.methods[i]; }}
		return false;
	} else {
		(new IMDebugger()).pass("InterpolateImages.method Exists expects an ImageInterpolateMethod Object");
		return false; }};

InterpolateImages.prototype.addMethod = function(obj){
	if(obj instanceof ImageInterpolateMethod){
		if(!this.methodExists(obj)){
			this.methods.push(obj);
			return true;
		} else {
			return false;
		}
	} else {
		(new IMDebugger()).pass("InterpolateImages.addMethod expects an ImageInterpolateMethod Object");
	}};
InterpolateImages.prototype.resolve = function(){
	if(this.list.length > 0 && this.active){
		for(var i=0; i < this.list.length; i += 1){ 
			try {
				this.imageExists(this.list[i].image);
				if(this.methodExists(this.list[i].method)){ this.methodExists(this.list[i].method).apply(this.list[i]); }
			} catch(e){
				this.list.splice(i, 1);
				i -= 1; }}
		if(this.list.length > 0){ return true; }
	} else { return false; }};

function ImageInterpolater(){
	this.image = null;
	this.src = "";
	this.styleWidth = null;
	this.styleHeight = null;
	this.offsetWidth = null;
	this.offsetHeight = null;
	this.initalised = false;
	this.ratio = null;
	this.w_h_ratio = 1;
	this.h_w_ratio = 1;
	this.method = "untested"; //can be alpha-image-loader || background-size;
	this.requiresReset = false;
	this.transparentImagePath = "img/spacer.png"; //Must be 32bit png
	this.valid = false; }
ImageInterpolater.prototype.valid = function(){ return (((this.styleWidth === 'auto' && this.styleHeight !== 'auto') || (this.styleHeight === 'auto' && this.styleWidth !== 'auto')) ? true : false); };
ImageInterpolater.prototype.w_h_ratio = function(){ return this.offsetWidth/this.offsetHeight; };
ImageInterpolater.prototype.h_w_ratio = function(){ return this.offsetHeight/this.offsetWidth; };
ImageInterpolater.prototype.calculateWidth = function(){
	switch(this.ratio()){
		case 'width':
			return this.image.offsetWidth + 'px';
		case 'height':
			/* falls through */
		default:
			return (this.image.offHeight * this.h_w_ratio) + 'px'; }};
ImageInterpolater.prototype.calculateHeight = function(){
	switch(this.ratio()){
		case 'height':
			return this.image.offsetHeight + 'px';
		case 'width':
			/* falls through */
		default:
			return (this.image.offsetWidth * this.w_h_ratio) + 'px'; }};
ImageInterpolater.prototype.determineMethod = function(){
	if(this.method === "untested"){
		return false;
		//search through available methods and create;
	} else { return this.method; }};

ImageInterpolater.prototype.init = function(img){
	var isimage = (img instanceof HTMLImageElement) ? true : false;
	if(isimage){
		this.image = img;
		this.method = this.determineMethod();
		this.src = img.src;
		this.offsetWidth = img.offsetWidth;
		this.offsetHeight = img.offsetHeight;
		this.valid = true; }};

//ImageInterpolateMethod, name, create, requiresReset, test, apply;
//requires im_supportedcssproperty
//requires isElementAnOnlyChild
function ImageInterpolateMethod(args){
	this.name = "";
	this.applicable = false;
	this.tested = false;
	this._requiresReset = false;
	this._init = null;
	this._test = null;
	this._apply = null;
	this.construction(args); }
ImageInterpolateMethod.prototype.correctObject = function(obj){ return ((obj instanceof ImageInterpolater) ? true : false); };
ImageInterpolateMethod.prototype.construction = function(args){
	args = (args !== undefined && args.length === 1) ? args[0] : args;
	if('name' in args){
		this.name = args['name'];
		var neededProps = ['requiresRestart', 'init', 'test', 'apply'];
		var locationProps = ['_requiresRestart', '_init', '_test', '_apply'];
		for(var i = 0, imax = neededProps.length; i < imax; i += 1){
			if(neededProps[i] in args){
				if(args.hasOwnProperty(neededProps[i])){
					if(typeof args[neededProps[i]] === 'function'){
						this[locationProps[i]] = args[neededProps[i]];
					} else if(args[neededProps[i]] || !args[neededProps[i]]){
						this[locationProps] = (args[neededProps[i]]) ? true : false; }}}}}};
ImageInterpolateMethod.prototype.handleMethod = function(method, args){
	method = '_' + method;
	if(method in this){
		if(typeof this[method] === 'function'){
			return ('args' in arguments && args.length > 0) ? this[method](args) : this[method]();
		} else { return ((this[method]) ? true : false); }
	} else { return false; }};
ImageInterpolateMethod.prototype.requiresReset = function(obj){ return this.handleMethod('requiresReset', obj); };
ImageInterpolateMethod.prototype.init = function(obj){ return this.handleMethod('init', obj); };
ImageInterpolateMethod.prototype.apply = function(obj){ return this.handleMethod('apply', obj); };
ImageInterpolateMethod.prototype.test = function(obj){ return this.handleMethod('test', obj); };
/* ::::::::::::::: Alpha Image Loader Methods ::::::::::::::::::::::::::::::::::::::::::::::::::::: */
window.immaturedawn = {};
window.immaturedawn.prepopulatedIIMethods = [];
window.immaturedawn.prepopulatedIIMethods.push(new ImageInterpolateMethod({
	'name' : 'alpha_image_loader',
	'init' : function(obj){
		if(this.correctObject(obj) && !obj.initialised && this.applicable){
			if(this.test() && this.requiresReset()){
				obj.image.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\"" + obj.src + "\",sizingMethod=\"scale\")";
				obj.image.style.width = obj.image.offsetWidth + 'px';
				obj.image.style.height = obj.image.offsetHeight + 'px';
				obj.image.src = obj.transparentImagePath;
				obj.requiresReset = true;
				obj.initialised = true;
				return true;
			} else { return false; }
		} else {
			(new IMDebugger()).pass("Method expects an ImageInterpolater Object");
			return false; }}, 
	'requiresReset' : function(obj){
		if(this.correctObject(obj)){
			var needsReset = false, styleWidth = obj.image.currentStyle.width, styleHeight = obj.image.currentStyle.height;
			if(styleWidth === 'auto' || styleHeight === 'auto'){
				needsReset = true;
				if(styleWidth === 'auto' && styleHeight !== 'auto'){
					obj.ratio = "height";
				} else if(obj.styleHeight === 'auto' && obj.styleWidth !== 'auto'){
					obj.ratio = "width";
				} else {
					needsReset = false;
					obj.ratio = "null"; }}
			return needsReset;
		} else {
			(new IMDebugger()).pass("Method expects an ImageInterpolater Object");
			return false;
		}
	},
	'test' : function(obj){
		if(!this.tested){
			this.tested = true;
			var testObject = (this.correctObject(obj)) ? obj.image : "";
			if(testObject === null || testObject === undefined){
				if(document.all){
					testObject = document.all.body;
				} else if('getElementsByTagName' in document){
					testObject = document.getElementsByTagName('body')[0];
				}
			}
			this.applicable = ((new SupportedCSSProperty('filter')).exists && !((new SupportedCSSProperty('imageRendering')).exists) && !((new SupportedCSSProperty('interpolationMode')).exists) && ('appVersion' in navigator && (parseInt(navigator.appVersion) < 9)) && (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) && !('opera' in window)) ? true : false;
		}
		return this.applicable;
	}, 
	'apply' : function(obj){
		if(this.correctObject(obj) && this.applicable && obj.requiresReset){
			switch(obj.ratio()){
				case "width":
					obj.image.style.height = (obj.image.offsetWidth * obj.h_w_ratio) + "px";
					break;
				case "height":
					obj.image.style.width = (obj.image.offsetHeight * obj.w_h_ratio) + "px";
					break;
				default:
					obj.image.style.width = obj.image.offsetWidth * obj.h_w_ratio + "px";
					obj.image.style.height = obj.image.offsetHeight * obj.w_h_ratio + "px";
					break;
			}
			return true;
		} else {
			(new IMDebugger()).pass("Method expects an ImageInterpolater Object");
			return false;
		}
	}
}));
/* ::::::::::::::: End Alpha Image Loader Methods ::::::::::::::::::::::::::::::::::::::::::::::::: */
/* ::::::::::::::: Background Sizing Interpolate :::::::::::::::::::::::::::::::::::::::::::::::::: */
window.immaturedawn.prepopulatedIIMethods.push(new ImageInterpolateMethod({
	'name' : 'background-size', 
	'test' : function(obj){
		if(!this.tested){
			this.tested = true;
			if(this.correctObj(obj)){
				this.applicable = ((new SupportedCSSProperty('backgroundSize')).exists && !((new SupportedCSSProperty('imageRendering')).exists) && !((new SupportedCSSProperty('interpolationMode')).exists) && 'jQuery' in window) ? true : false; 
				return this.applicable;
			} else {
				(new IMDebugger()).pass("Method expects an ImageInterpolater Object");
				return false; }
		} else { return this.applicable; }
	}, 
	'init' : function(obj){
		if(this.correctObj(obj) && !obj.initialised && this.test(obj)){
			if(isElementAnOnlyChild(obj.image)){
				var parentObj = $(obj.image).parent();
				if((parentObj.css('display') === 'block' || parentObj.css('display') === 'inline-block') && parentObj.contents().length <= 1  && parentObj.css('background-image') === 'none' && $(obj.image).css('background-color') === 'transparent'){
					parentObj.css('background-image', 'url(' + $(obj.image).attr('src') + ')')
						.css('background-repeat', 'no-repeat')
						.css((new SupportedCSSProperty('backgroundSize')).cssProperty, $(obj.image).css('width') + ' ' + $(obj.image).css('height'));
					if($(obj.image).css('background-color') !== 'transparent'){ parentObj.css('background-color', $(obj.image).css('background-color')); }
					var topPosition = $(obj.image).css('margin-top');
					var leftPosition = $(obj.image).css('margin-left');
					var parentTopPosition = $(obj.image).parent().css('margin-top');
					var parentLeftPosition = $(obj.image).parent().css('margin-left');
					topPosition = (topPosition === 'auto' || parentTopPosition === 'auto') ? '50%' : topPosition;
					leftPosition = (leftPosition === 'auto' || parentLeftPosition === 'auto') ? '50%' : leftPosition;
					parentObj.css('background-position', leftPosition + ' ' + topPosition);
					$(obj.image).css('visibility', 'hidden');
					obj.requiresReset = false;
					obj.initialised = true;
					return true;
				} else { return false; }}
		} else {
			(new IMDebugger()).pass("Method expects an ImageInterpolater Object");
			return false; }}, 
	'requiresReset' : false, 
	'apply' : function(){ return false; }
}));