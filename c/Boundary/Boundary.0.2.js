"use strict";
/*global isHTMLElement, window, jquery, $ */
/**
 * Boundary.js
 * Boundary Class - Version 0.2
 * @author JDB - jim@immaturedawn.co.uk 2012, 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
**/
function Boundary(obj){
	this.top = 0;
	this.left = 0;
	this.bottom = 0;
	this.right = 0;
	if(arguments && arguments.length > 0){
		if(arguments.length === 1){
			this.init(arguments[0]);
		} else { this.init(arguments); }}}
Boundary.prototype.init = function(args){
	var isHTML = false;
	if(isHTMLElement !== undefined && window.jquery){
		if(isHTMLElement(args)){
			isHTML = true;
			var thePos = $(args).position();
			this.top = thePos.top;
			this.bottom = thePos.top + parseFloat($(args).innerHeight);
			this.left = thePos.left;
			this.right = thePos.left + parseFloat($(args).innerWidth); }}
	if(!isHTML && typeof args === 'object'){
		var obj = args;
		this.top = ('top' in obj) ? obj.top : 0;
		this.left = ('left' in obj) ? obj.left : 0;
		this.bottom = ('bottom' in obj) ? obj.bottom : 0;
		this.right = ('right' in obj) ? obj.right : 0; }};
Boundary.prototype.width = function(){ return this.right - this.left; };
Boundary.prototype.height = function(){ return this.bottom - this.top; };
