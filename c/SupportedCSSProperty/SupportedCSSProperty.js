"use strict";
/*global window, console, IMDebugger, document, isHTMLElement, VendorList, SupportedCSSProperties*/
/**
 * SupportedCSSProperty.js
 * Javascript CSS Support Dection
 * Requires isHTMLElement.js
 * @module SupportedCSSProperty
 * @class SupportedCSSProperty
 * @constructor
 * @author Immature Dawn
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - JDB 2014
 * @version - 0.2
 * @requires isHTMLElement
 * @param {String} prop
 * @param {HTMLElement} htmlElem [optional]
 * @return {SupportedCSSProperty} use .exists, .cssProperty, .jsProperty
 * @notes To call new SupportedCSSProperty(prop htmlElem - opt), .exists, .cssProperty, .jsProperty
 */
function SupportedCSSProperty(prop, htmlElem){
	this.tested = false;
	this.exists = false;
	this.searchedProperty = "";
	this.jsProperty = "";
	this.cssProperty = "";
	this._cssProperty = "";
	this._jsProperty = "";
	this.jsRE = /^[A-Za-z0-9]+$/g;
	this.cssRE = /^[a-z0-9\-]+$/g;
	this.vendorlist = new VendorList();
	this.prefixedRE = /^(-webkit-|Webkit|ms|-ms-|-moz-|Moz|O|-o-|-khtml-|Khtml)/g;
	if(!('im_supportedcache' in window) || (window.im_supportedcache instanceof SupportedCSSProperties)){ window.im_supportedcache = new SupportedCSSProperties(); }
	this.supportedCache = new SupportedCSSProperties();
	if(!('im_vendorlist' in window) || !(window.im_vendorlist instanceof VendorList)){ 
		window.im_vendorlist = new VendorList();
		window.im_vendorlist.add('ie', 'ms', '-ms-');
		window.im_vendorlist.add('webkit', 'Webkit', '-webkit-');
		window.im_vendorlist.add('mozilla', 'Moz', '-moz-');
		window.im_vendorlist.add('opera', 'O', '-o-');
		window.im_vendorlist.add('konqueror', 'Khtml', '-khtml-'); }
	this.vendorlist = new VendorList();
	if(typeof prop === "string"){
		this.searchedProperty = prop;
		prop = (this.isPropertyPrefixed) ? this.removePropertyPrefix(prop) : prop;
		this._cssProperty = (this.isCSSProperty(prop)) ? prop : this.returnCSSProperty(prop);
		this._jsProperty = (this.isJSProperty(prop)) ? prop : this.returnJSProperty(prop);
		if(this.supportedCache.cached(this)){
			var acting = this.supportedCache.cached(this);
			//could you just return acting here?
			return acting;
			//for(var onprop in acting){ 
				//if(acting.hasOwnProperty(onprop)){ this[onprop] = acting[onprop]; }}
		} else {
			if(htmlElem !== undefined){
				this.test(htmlElem);
			} else { this.test(); }}
	} else { throw new Error("SupportedCSSProperty must be constructed with a named property."); }}
/**
 * SupportedCSSProperty.removePropertyPrefix
 * @method removePropertyPrefix
 * @param {string} prop Property String
 * @return {string} prop Corrected, revised property string
 */
SupportedCSSProperty.prototype.removePropertyPrefix = function(prop){
	if(typeof prop === "string"){
		for(var i=0, max = this.vendorlist.list.length; i < max; i += 1){
			var done = false, onlist = this.vendorlist.list[i];
			if(prop.indexOf(onlist.js_extension) === 0){
				prop = prop.slice(onlist.js_extension.length);
				done = true;
			} else if(prop.indexOf(onlist.css_extension) === 0){
				prop = prop.slice(onlist.css_extension.length);
				done = true;
			} else { continue; }
			if(done){
				var firstCharRE = /^[A-Z]/g;
				prop = (firstCharRE.test(prop)) ? prop.charAt(0).toLowerCase() + prop.slice(1) : prop;
				break; }}
		return prop;
	} else {
		(new IMDebugger()).pass("SupportedCSSPropery.removePrefixFromProperty: Must be supplied a property string");
		return prop; }};
/**
 * SupportedCSSProperty.returnJSPropertyPrefixedArray
 * @method returnJSPropertyPrefixedArray
 * @param {none}
 * @return {string} valid prefixed javascript string
 */
SupportedCSSProperty.prototype.returnJSPropertyPrefixedArray = function(){
	var _a = [ this._jsProperty ];
	var ucProp = this._jsProperty.charAt(0).toUpperCase() + this._jsProperty.slice(1);
	for(var i = 0, max = this.vendorlist.list.length; i < max; i += 1){ _a.push(this.vendorlist.list[i].js_extension + ucProp); }
	return _a; };
/**
 * SupportedCSSProperty.isPropertyPrefixed
 * @method isPropertyPrefixed
 * @param {string} prop
 * @return {boolean}
 */
SupportedCSSProperty.prototype.isPropertyPrefixed = function(prop){
	if(typeof prop === "string"){ return (this.prefixedRE.test(prop)) ? true : false;
	} else { 
		(new IMDebugger()).pass("SupportedCSSProperty.isPropertyPrefixed: Must be supplied a property string");
		return false; }};
/**
 * SupportedCSSProperty.isCSSProperty
 * @method isCSSProperty
 * @param {string} prop
 * @return {boolean}
 */
SupportedCSSProperty.prototype.isCSSProperty = function(prop){
	if(typeof prop === "string"){ return (this.cssRE.test(prop)) ? true : false;
	} else { 
		(new IMDebugger()).pass("SupportedCSSProperties.isCSSProperty: Should be supplied a string");
		return false; }};
/**
 * SupportedCSSProperty.isJSProperty
 * @method isJSProperty
 * @param {string} prop
 * @return {boolean}
 */
SupportedCSSProperty.prototype.isJSProperty = function(prop){
	if(typeof prop === "string"){ return (this.jsRE.test(prop)) ? true : false;
	} else { 
		(new IMDebugger()).pass("SupportedCSSProperties.isJSProperty: Should be supplied a string");
		return false; }};

SupportedCSSProperty.prototype.returnCSSProperty= function(prop){
	if(typeof prop === "string"){
		if(prop.match(/[A-Z]/)){
			var rebuiltString = "";
			for(var i=0, max = prop.length; i<max; i += 1){
				var ch = prop.charAt(i);
				if(ch.match(/[A-Z]/)){
					ch = ch.toLowerCase();
					ch = (i > 0) ? '-' + ch : ch; }
				rebuiltString += ch; }
			prop = rebuiltString; }
		return prop;
	} else {
		(new IMDebugger()).pass("SupportedCSSProperties.returnCSSPropertyName: Should be supplied a string");
		return prop; }};
SupportedCSSProperty.prototype.returnJSProperty= function(prop){
	if(typeof prop === "string"){
		if(prop.match(/\-/)){
			var stringNameArray = prop.split(/\-/);
			var rebuiltProperty = "";
			for(var i=0; i<stringNameArray.length; i+=1){
				if(stringNameArray[i].length < 1){
					var startArray = stringNameArray.slice(0, i);
					var endArray = stringNameArray.slice(i + 1);
					stringNameArray = startArray.concat(endArray);
					i -= 1;
					continue; }
				var str = (i > 0) ? stringNameArray[i].charAt(0).toUpperCase() + stringNameArray[i].slice(1) : stringNameArray[i];
				rebuiltProperty += str; }
			prop = rebuiltProperty; }
		return prop;
	} else {
		(new IMDebugger()).pass("SupportedCSSProperties.returnJSPropertyName: Should be supplied a string");
		return false; }};
/**
 * SupportedCSSProperty.test
 * @method test
 * @param {HTMLElement | none}
 * @return {Boolean}
 */
SupportedCSSProperty.prototype.test = function(htmlElem){
	if(this._jsProperty !== null){
		if(!this.tested){
			if(htmlElem === undefined){ 
				if('all' in document && 'body' in document.all){
					htmlElem = document.all.body;
				} else if('getElementsByTagName' in document && document.getElementsByTagName('body').length > 0){
					htmlElem = document.getElementsByTagName('body')[0]; }}
			var p = null, prop = null, prop_array = this.returnJSPropertyPrefixedArray(), tgt = ("currentStyle" in htmlElem) ? htmlElem.currentStyle : (("getComputedStyle" in window) ? window.getComputedStyle(htmlElem) : null);
			if(prop_array.length > 0){
				if(tgt !== null){
					for(p in prop_array){
						if(prop_array.hasOwnProperty(p)){
							prop = prop_array[p];
							if(prop in tgt){
								this.jsProperty = prop;
								this.exists = true;
								break; }}}
				} else {
					if("style" in htmlElem){
						if("getPropertyCSSValue" in htmlElem.style){
							for(p in prop_array){
								if(prop_array.hasOwnProperty(p)){
									prop = prop_array[p];
									if(htmlElem.style.getPropertyCSSValue(prop) !== null){
										this.jsProperty = prop;
										this.exists = true;
										break; }}}}
						if("getPropertyValue" in htmlElem.style && !this.exists){
							for(p in prop_array){
								if(prop_array.hasOwnProperty(p)){
									prop = prop_array[p];
									if(htmlElem.style.getPropertyValue(prop) !== null){
										this.jsProperty = prop;
										this.exists = true;
										break; }}}}
						if(!this.exists){
							for(p in prop_array){
								if(prop_array.hasOwnProperty(p)){
									prop = prop_array[p];
									if(prop in htmlElem.style && htmlElem.style[prop] !== null){
										this.jsProperty = prop;
										this.exists = true;
										break; }}}}}}}
			this.tested = true;
			if(!this.exists){ this.jsProperty = this._jsProperty; }
			if(this.isPropertyPrefixed(this.jsProperty)){
				for(var i=0, max = this.vendorlist.list.length; i < max; i += 1){
					var onlist = this.vendorlist.list[i];
					if(this.jsProperty.indexOf(onlist.js_extension) === 0){
						this.cssProperty = onlist.css_extension + this._cssProperty;
						break; }}
			} else { this.cssProperty = this._cssProperty; }
			this.supportedCache.addToCache(this);
			return this.exists;
		} else { return this.exists; }
	} else {
		(new IMDebugger()).pass("SupportedCSSProperty is not correctly initialised");
		return false; }};
/**
 * @module SupportedCSSProperty
 * @submodule SupportedCSSProperties
 * @class SupportedCSSProperties
 * 	@type Singleton
 * 	@constructor
 */
function SupportedCSSProperties(){
	if(SupportedCSSProperties.prototype.singletonInstance){ return SupportedCSSProperties.prototype.singletonInstance; }
	SupportedCSSProperties.prototype.singletonInstance = this;
	this.cache = []; }
/**
 * SupportedCSSProperties.cached
 * @method cached
 * @param {SupportedCSSProperty|string} supportedCSSProperty or potential string of CSS Property
 * @return {SupportedCSSProperty | false }
 */
SupportedCSSProperties.prototype.cached = function(supportedCSSProperty){
	if(!(supportedCSSProperty instanceof SupportedCSSProperty)){
		if(typeof supportedCSSProperty === "string"){ supportedCSSProperty = new SupportedCSSProperty(supportedCSSProperty); }}
	for(var i=0, max = this.cache.length; i < max; i += 1){
		if(supportedCSSProperty._jsProperty === this.cache[i]._jsProperty){
			return this.cache[i]; }}
	return false; };
/**
 * SupportedCSSProperties.addToCache
 * @method addToCache
 * @param {SupportedCSSProperty} obj
 * @return {boolean}
 */
SupportedCSSProperties.prototype.addToCache = function(obj){
	if(obj instanceof SupportedCSSProperty){
		var exists = false;
		for(var i=0, max = this.cache.length; i < max; i += 1){
			if(obj._jsProperty === this.cache[i]._jsProperty){
				exists = true;
				break; }}
		if(!exists){
			this.cache.push(obj);
			return true;
		} else { return false; }
	} else {
		(new IMDebugger()).pass("SupportedCSSProperties.addToCache: Should be supplied a SupportedCSSProperty");
		return false; }};
/**
 * SupportedCSSProperties.detectProperty
 * @method detectProperty
 * @param {string} prop
 * @param {HTMLElement} htmlElem
 * @requires isHTMLElement
 * @return {SupportedCSSProperty}
 */
SupportedCSSProperties.prototype.detectProperty = function(prop, htmlElem){
	if(typeof prop === "string"){
		var tempProperty = new SupportedCSSProperty(prop);
		if(this.cached(tempProperty)){
			return this.cached(tempProperty);
		} else {
			tempProperty.test(((isHTMLElement(htmlElem)) ? htmlElem : undefined));
			this.addToCache(tempProperty);
			return tempProperty; }
	} else {
		(new IMDebugger()).pass("SupportedCSSProperties.detectProperty: The property must be a valid string");
	}};
/**
 * @module SupportedCSSProperty
 * @submodule VendorDefinition
 * @class VendorDefinition
 * @constructor
 * @param {string} name
 * @param {string} jsExtension
 * @param {string} cssExtension
 */
function VendorDefinition(name, jsExtension, cssExtension){
	this.name = name;
	this.js_extension = jsExtension;
	this.css_extension = cssExtension; }
/**
 * @module SupportedCSSProperty
 * @submodule VendorList
 * @class VendorList
 * @constructor
 * 	@type singleton
 */
function VendorList(){
	if(VendorList.prototype.singletonInstance){ return VendorList.prototype.singletonInstance; }
	VendorList.prototype.singletonInstance = this;
	this.list = []; }
/**
 * VendorList.add
 * @method add
 * @param {String} name
 * @param {String} jsExtension
 * @param {String} cssExtension
 * @return {Boolean}
 */
VendorList.prototype.add = function(name, jsExtension, cssExtension){
	var alreadyExists = false, replaceId = -1;
	for(var i=0, max = this.list.length; i < max; i += 1){
		if(this.list[i].name === name){
			replaceId = i;
			break;
		} else {
			if(this.list[i].js_extension === jsExtension || this.list[i].css_extension === cssExtension){
				alreadyExists = true;
				break; }
			continue; }}
	if(replaceId !== -1){
		this.list[i].js_extension = jsExtension;
		this.list[i].css_extension = cssExtension;
		return true;
	} else if(!alreadyExists){
		this.list.push(new VendorDefinition(name, jsExtension, cssExtension));
		return true; }};
