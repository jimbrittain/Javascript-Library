"use strict";
/* jshint sub:true */
/* global __imns, setInterval, clearInterval, document, window, Image, setTimeout, clearTimeout, navigator */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('SVGFallback' in adr)){


    /* 
     * SVGFalLback.js & SVGFallback.min.js
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2013
     * @version - 0.1
     * Requires isHTMLElement, WhenWindowLoads and findElementByID
     * To Call, use WhenWindowLoads.add(a function which defines a new SVGFallback Instance)
     * To Define js_librarypath, i.e. the location of svgweb, supply the relative file location as an arguement string on construction
    */
    adr.SVGFallback = function(a){
        var uc = __imns('util.classes');
        if(uc.SVGFallback.prototype.singleton){ return uc.SVGFallback.prototype.singleton; }
        uc.SVGFallback.prototype.singleton = this;
        this.js_libraryPath = "../../../javascript-library/svgweb/";
        this.js_Path = '../../../javascript-library/svgweb/svg.min.js';
        this.svg_testPath =  "../../../javascript-library/svgweb/spacer.svg";
        this.ready = false;
        this.imageSupported = false;
        this.imageTested = false; 
        this.imageTimeout = null;
        this.objectSupported = false;
        this.objectTested = false;
        this.elementsProcessed = [];
        this.testImage = null;
        this.testImageLocation = this.svg_testPath;
        this.svgScriptInterval = null;
        this.svgScriptId = '__svgFallback_id_1'; 
        if(arguments && arguments.length === 1){
            this.init(a);
        } else { this.init(); }};
    adr.SVGFallback.prototype.insertBloatedSVGInclusion = function(){
        var ud = __imns('util.dom'),
            udb = __imns('util.debug');
        var theHead = document.getElementsByTagName('head')[0];
        theHead = ('getElementsByTagName' in document) ? document.getElementsByTagName('head')[0] : ('all' in document) ? document.all.tags('HEAD')[0] : null;
        if(theHead !== null && ud.findElementByID(this.svgScriptId) === undefined){
            var c = this;
            var svgScript = document.createElement('SCRIPT');
            svgScript.type = 'text/javascript';
            svgScript.id = c.svgScriptId;
            svgScript.onload = function(){ c.loadedSVGInclusion(); };
            svgScript.onerror = function(){ if(c.svgScriptInterval !== null){ clearInterval(this.svgScriptInterval); }};
            svgScript.onreadystatechange = function(){ if(this.readyState === 'complete'){ c.checkLoadingSVGInclusion(); }};
            svgScript.src = c.js_Path;
            theHead.appendChild(svgScript);
            this.svgScriptInterval = setInterval(function(){ c.checkLoadingSVGInclusion(); }, 50);
            try {
                if(document.getElementById(this.svgScriptId).readyState === 'complete'){ c.checkLoadingSVGInclusion(); }
            } catch(e){}
        } else {
            if(ud.findElementByID(this.svgScriptId) !== undefined){
                this.checkLoadingSVGInclusion();
            } else {
                (new udb.IMDebugger()).pass("SVGFallback: Document does not have or allow access to the DOM/Head tag."); }}};
    adr.SVGFallback.prototype.loadedSVGInclusion = function(){
        this.ready = true;
        this.objectSupported = true;
        this.processSVGImages();
        if(this.svgScriptInterval !== null){ clearInterval(this.svgScriptInterval); }};
    adr.SVGFallback.prototype.checkLoadingSVGInclusion = function(){ 
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var elem = ud.findElementByID(this.svgScriptId);
        if(elem !== undefined && uv.isHTMLElement(elem) && elem.readyState === 'complete'){ this.loadedSVGInclusion(); }};
    adr.SVGFallback.prototype.isSVGObjectSupported = function(){
        if(document.all && (parseFloat(navigator.appVersion.split('MSIE ')[1]) < 9) && !('opera' in window)){
            this.processSVGObjectDowngrade();
            return false;
        } else { return true; }};
    adr.SVGFallback.prototype.processSVGObjectDowngrade = function(){
        var objArray = [];
        if('getElementsByTagName' in document){
            objArray = document.getElementsByTagName('object');
        } else if(document.all && 'tags' in document.all){
            objArray = document.all.tags("OBJECT"); }
        for(var o=0, omax = objArray.length; o < omax; o += 1){ 
            if(this.isSVGObject(objArray[o]) && !(this.hasElementBeenProcessed(objArray[o]))){ 
                this.downGradeSVGObject(objArray[o]); }}};
    adr.SVGFallback.prototype.isSVGObject = function(el){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        if(uv.isHTMLElement(el)){
            var theTag = ('tagName' in el) ? el.tagName : ' ';
            var theType = ('attributes' in el && 'type' in el.attributes) ? el.attributes['type'] : ('type' in el) ? el.type : ' ';
            return (theTag.toLowerCase() === 'object' && (theType === 'image/svg+xml')) ? true : false;
        } else { 
            (new udb.IMDebugger()).pass("SVGFallback.isSVGObject: Needs to be supplied a valid HTML Element");
        }};

    adr.SVGFallback.prototype.hasElementBeenProcessed = function(el){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        if(uv.isHTMLElement(el)){
            var beenProcessed = false;
            for(var i=0, imax = this.elementsProcessed.length; i<imax; i += 1){
                if(this.elementsProcessed[i] === el){
                    beenProcessed = true;
                    return true; }}
            return beenProcessed;
        } else { 
            (new udb.IMDebugger()).pass("SVGFallback.hasElementBeenProcessed: Needs to be supplied a valid HTML Element"); }};
    adr.SVGFallback.prototype.downGradeSVGObject = function(el){
        this.testAndSetAttribute(el, 'classid', 'image/svg+xml');
        var theFile = ('attributes' in el && 'data' in el.attributes) ? el.attributes['data'] : ('data' in el) ? el.data : '';
        if(theFile !== ''){ this.testAndSetAttribute(el, 'src', theFile); }
        if('attributes' in el){
            if('data' in el.attributes){ 
                if('removeAttribute' in el){ el.removeAttribute('data'); }}
            if('type' in el){
                if('removeAttribute' in el){ el.removeAttribute('type'); }}}
        this.elementsProcessed.push(el); };
    adr.SVGFallback.prototype.isSVGImage = function(el){
        var theTag = ('tagName' in el) ? el.tagName : " ";
        var theSrc = ('src' in el) ? el.src : " ";
        return (theTag.toLowerCase() === 'img'&& (theSrc.lastIndexOf('.svg') === theSrc.length - 4 || theSrc.lastIndexOf('.svgz') === theSrc.length - 5)) ? true : false; };
    adr.SVGFallback.prototype.addEventHandler = function(obj, fun, evt){
        if('addEventListener' in obj){
            obj.addEventListener(evt, fun, true);
        } else if('attachEvent' in obj){
            evt = 'on' + evt;
            obj.attachEvent(evt, fun);
        } else {
            evt = 'on' + evt;
            if(evt in obj){ obj[evt] = fun; }}};
    adr.SVGFallback.prototype.svgImageError = function(){
        this.imageTested = true;
        this.imageSupported = false;
        this.insertBloatedSVGInclusion(); };
    adr.SVGFallback.prototype.svgImageLoad = function(el){
        if(this.imageTimeout !== null){ clearTimeout(this.imageTimeout); this.imageTimeout = null; }
        var naturalWidth = ('naturalWidth' in el && ((el.naturalWidth + el.naturalHeight) === 0)) ? false : true;
        var defaultWidth = ('width' in el && (el.width + el.height) === 0) ? false : true;
        if(!naturalWidth && !defaultWidth){
            this.svgImageError();
            return;
        } else {
            this.ready = true;
            this.imageSupported = true;
            this.imageTested = true; }};
    adr.SVGFallback.prototype.svgImageReadyState = function(el){
        if('readyState' in el){
            if(el.readyState === 'complete'){
                if('complete' in el){
                    this.svgImageLoad(el);
                } else { this.svgImageLoad(el); }
            } else { this.svgImageError(); }
        } else { this.svgImageError(); }};
    adr.SVGFallback.prototype.isSVGImageSupported = function(el){
        var uv = __imns('util.validation');
        if(this.imageTested){
            return this.imageSupported;
        } else {
            var isComplete = (el !== undefined && uv.isHTMLElement(el) && this.isSVGImage(el) && 'complete' in el)? el.complete : '';
            if(isComplete === ''){
                if(this.testImage === null){
                    this.testImage = new Image();
                    var c = this;
                    this.addEventHandler(this.testImage, function(){ c.svgImageError(); }, 'error');
                    this.addEventHandler(this.testImage, function(){ c.svgImageError(c.testImage); }, 'abort');
                    this.addEventHandler(this.testImage, function(){ c.svgImageLoad(c.testImage); }, 'load');
                    this.addEventHandler(this.testImage, function(){ c.svgImageReadyState(c.testImage); }, 'readystatechange');
                    this.imageTimeout = setTimeout(function(){ c.svgImageError(); }, 2000);
                    this.testImage.src = this.testImageLocation; }
            } else {
                if(!isComplete){
                    this.imageSupported = false;
                    this.imageTested = true;
                    this.processSVGImages(); }}}};
    adr.SVGFallback.prototype.processSVGImages = function(){
        var imgArray = [];
        if('getElementsByTagName' in document){
            imgArray = document.getElementsByTagName('img');
        } else if(document.all){ imgArray = document.all.tags("IMG"); }
        for(var s=0, smax = imgArray.length; s<smax; s += 1){ 
            if(this.isSVGImage(imgArray[s]) && !(this.hasElementBeenProcessed(imgArray[s]))){
                this.replaceSVGImage(imgArray[s]); }}};
    adr.SVGFallback.prototype.testAndSetAttribute = function(el, attr, val){
        var tested = false;
        var exists = false;
        if(!document.all){
            if('hasOwnProperty' in el){ tested = true; exists = (el.hasOwnProperty(attr)) ? true : false; }
            if(!tested && 'attributes' in el && 'getNamedItem' in el.attributes){ tested = true; exists = (el.attributes.getNamedItem(attr)) ? true : false; }
            if(!tested && 'hasOwnProperty' in el){ tested = true; exists = (el.hasOwnProperty(attr)) ? true : false; }
            if(!tested){ tested = true; exists = (attr in el) ? true : false; }
        } else { exists = true; }
        if(exists){
            if('setAttribute' in el){
                el.setAttribute(attr, val);
            } else if('createAttribute' in document){
                var newAttr = document.createAttribute(attr);
                newAttr.nodeValue = val;
                el.setAttributeNode(newAttr); }}};
    adr.SVGFallback.prototype.replaceSVGImage = function(el){
        var uv = __imns('util.validation');
        if(uv.isHTMLElement(el) && this.isSVGImage(el)){
            var theFile = ('src' in el) ? el.src : "";
            var newObject = null;
            newObject = document.createElement("object", true);
            this.testAndSetAttribute(newObject, 'data', theFile);
            this.testAndSetAttribute(newObject, 'src', theFile);
            if(document.all && parseFloat(navigator.appVersion.split('MSIE ')[1]) < 9){ this.testAndSetAttribute(newObject, 'classid', 'image/svg+xml'); }
            this.testAndSetAttribute(newObject, 'type', 'image/svg+xml');
            if('attributes' in el){ 
                for(var i=0, imax = el.attributes.length; i < imax; i += 1){ 
                    this.testAndSetAttribute(newObject, el.attributes[i].nodeName, el.attributes[i].nodeValue); }}
            var container = el.parentNode;
            if('offsetWidth' in container){ this.testAndSetAttribute(newObject, 'width', parseFloat(container.offsetWidth)); }
            if('offsetHeight' in container){ this.testAndSetAttribute(newObject, 'height', parseFloat(container.offsetHeight)); }
            var refNode = null;
            if(window.svgweb){
                refNode = window.svgweb.appendChild(newObject, el.parentNode);
            } else { refNode = el.parentNode.appendChild(newObject); }
            if(refNode !== null){ this.elementsProcessed.push(refNode); }
            el.parentNode.removeChild(el); }};
    adr.SVGFallback.prototype.init = function(){
        var ut = __imns('util.tools');
        var c = this;
        if(arguments && arguments.length === 1){
            this.js_libraryPath = (arguments[0] !== null) ? arguments[0] : this.js_libraryPath;
            window.js_libraryPath = (!window.js_libraryPath) ? this.js_libraryPath : window.js_libraryPath;
            this.js_Path = this.js_libraryPath + '/svg.min.js';
            this.svg_testPath =  this.js_libraryPath + '/spacer.svg';
            this.testImageLocation = this.svg_testPath; }
        var fireOn = function(){
            c.isSVGImageSupported();
            c.isSVGObjectSupported(); };
        ut.fetter(window, 'load', [c, fireOn], true); };


}
