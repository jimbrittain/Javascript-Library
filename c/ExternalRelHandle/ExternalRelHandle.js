"use strict";
/*global window, console, document, IMDebugger, $, fetter*/
/**
 * jq.ExternalRelHandle.js
 * Requires jQuery
 * rel="external" handler for anchor linkages, to use either pop-ups/alt. tabs
 * @author JDB - jim@immaturedawn.co.uk 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
 * @version - 0.2
 */
function ExternalWindowProfile(classname, options, windowname){
	this.classname = (classname !== undefined) ? classname : "";
	this.options = (options !== undefined) ? options : "";
	this.windowname = (windowname !== undefined) ? windowname : ""; }
function ExternalWindowProfiles(){
	if(ExternalWindowProfiles.prototype.singletonInstance){ return ExternalWindowProfiles.prototype.singletonInstance; }
	ExternalWindowProfiles.prototype.singletonInstance = this;
	this.list = []; }
ExternalWindowProfiles.prototype.returnSettings = function(class_arr){
	if(!$.isArray(class_arr)){ class_arr = (typeof class_arr === "string") ? class_arr.split(' ') : []; }
	var theProfile = null;
	var i = 0;
	while(i < this.list.length && theProfile === null){
		for(var j=0, max = class_arr.length; j < max; j += 1){
			if(this.list[i].classname === class_arr[j]){
				theProfile = this.list[i];
				break; }}
		i += 1; }
	theProfile = (theProfile === null) ? new ExternalWindowProfile() : theProfile;
	return theProfile; };
ExternalWindowProfiles.prototype.addProfile = function(p){
	if(p instanceof ExternalWindowProfile){
		var existingProfile = false;
		for(var i=0, max = this.list.length; i < max; i += 1){
			if(this.list[i].classname === p.classname){
				existingProfile = true;
				break; }}
		if(!existingProfile){
			this.list.push(p);
			return true;
		} else { return false; }
	} else {
		(new IMDebugger()).pass("ExternalRefHandle.addProfile: Requires ExternalRefProfile.");
		return false; }};
function ExternalRelHandle(){
	if(ExternalRelHandle.prototype.singletonInstance){ return ExternalRelHandle.prototype.singletonInstance; }
	ExternalRelHandle.prototype.singletonInstance = this;
	this.windowsAllowed = (window.open && typeof window.open === 'function') ? true : false;
	this.firstUse = true;
	this.ext_window_reference = null;
	this.profiles = new ExternalWindowProfiles();
	this.processedElements = []; 
	this.buildInit(); }
ExternalRelHandle.prototype.buildInit = function(){
	var c = this;
	if(window.jQuery){
		$(document).ready(function(){ c.init(); });
	} else if(fetter !== undefined && typeof fetter === 'function'){
		fetter(window, 'DOMContentLoaded', function(){ c.init(); }, true, 'both'); }};
ExternalRelHandle.prototype.elementProcessed = function(elem){
	var exists = false;
	for(var i=0, max = this.processedElements.length; i < max; i += 1){
		if(this.processedElements[i] === elem){
			exists = true;
			return true; }}
	return exists; };
ExternalRelHandle.prototype.init = function(){
	if(this.windowsAllowed){
		var c = this;
		$('a[rel="external"]').each(function(){
			if(!c.elementProcessed(this)){
				c.processedElements.push(this);
				$(this).bind('click', function(e){ 
					e = e || window.event;
					var good = false;
					if(c.windowsAllowed){
						var targetURL = $(this).attr('href');
						var profileName = $(this).attr('class');
						var theProfile = c.profiles.returnSettings(profileName);
						good = c.openWindow(targetURL, theProfile.options, theProfile.windowName);
					} else { good = true; }
					if(!good){
						if('stopPropagation' in e){ e.stopPropagation(); }
						if('cancelBubble' in e){ e.cancelBubble = true; }
						if('preventDefault' in e){ e.preventDefault(); }
						return false;
					} else { return true; }});}});
	} else { this.createTargets(); }};
ExternalRelHandle.prototype.openWindow = function(url, opts, windowName){
	var theName = (windowName !== '') ? windowName : 'name';
	var theOpts = (opts !== '') ? opts : '';
	if(this.windowsAllowed){
		if(this.ext_window_reference !== null){
			try { this.ext_window_reference.close(); } catch(e){}
		}
		this.ext_window_reference = window.open(url, theName, theOpts);
		if(this.firstUse){
			this.firstUse = false;
			try {
				this.ext_window_reference.focus();
			} catch(e) {
				this.windowsAllowed = false;
				this.createTargets(); 
				return true; }
		} else { this.ext_window_reference.focus(); }
		return false;
	} else { return true; }};
ExternalRelHandle.prototype.createTargets = function(){
	var c = this;
	$('a[rel="external"]').each(function(){
		$(this).unbind('click', c.clickAction);
		$(this).attr('target', '_blank');
	});};
