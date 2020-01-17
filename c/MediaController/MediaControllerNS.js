"use strict";
/* global window, document, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('MediaController' in adr)){
    adr.checkHTML4ObjectTags = function(){ 
        var ut = __imns('util.tools');
        if('all' in document && window.vbsActive){ ut.vbsObjectCorrection(); }};

    adr.MediaController = function(){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        if(cc.MediaController.prototype.singleton !== undefined){ return cc.MediaController.prototype.singleton; }
        cc.MediaController.prototype.singleton = this;
        this.taglist = [];
        var c = this;
        ut.fetter(document, "DOMContentLoaded", [c, function(){ c.checkAll();}], true); };
    adr.MediaController.prototype.canHTML5Audio = function(){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(cc.MediaController.prototype._canHTML5Audio !== undefined){ return cc.MediaController.prototype._canHTML5Audio; }
        var elem = document.createElement('audio');
        cc.MediaController.prototype._canHTML5Audio = (!uv.isHTMLElement(elem) || elem !== "[object HTMLAudioElement]") ? false : true;
        return cc.MediaController.prototype._canHTML5Audio; };
    adr.MediaController.prototype.canHTML5Video = function(){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(cc.MediaController.prototype._canHTML5Video !== undefined){ return cc.MediaController.prototype._canHTML5Video; }
        var elem = document.createElement('video');
        cc.MediaController.prototype._canHTML5Video = (!uv.isHTMLElement(elem) || elem !== "[object HTMLVideoElement]") ? false : true;
        return cc.MediaController.prototype._canHTML5Video; };
    adr.MediaController.prototype.needsVBSCorrection = function(){
        var cc = __imns('component.classes');
        if(cc.MediaController.prototype._needsVBSCorrection !== undefined){ return cc.MediaController.prototype._needsVBSCorrection; }
        cc.MediaController.prototype._needsVBSCorrection = ('all' in document && window.vbsActive) ? true : false; };
    adr.MediaController.prototype.checkHTML5VideoTags = function(){
        var ud = __imns('util.dom'),
            cc = __imns('component.classes');
        if(!this.canHTML5Video()){
            var videoTagList = ud.findElementsByTag('video');
            for(var i=0, imax = videoTagList.length; i < imax; i += 1){
                if(!this.beenChecked(videoTagList[i])){
                    this.taglist.push(videoTagList[i]);
                    var tempVideoObj = new cc.MediaObject();
                    tempVideoObj.processMediaObject(videoTagList[i]);
                    tempVideoObj.writeHTML4Object(); //need to do an add here for this.taglist;
                }}}};
    adr.MediaController.prototype.checkHTML5AudioTags = function(){
        var ud = __imns('util.dom'),
            cc = __imns('component.classes');
        if(!this.canHTML5Audio()){
            var audioTagList = ud.findElementsByTag('audio');
            for(var i=0, imax = audioTagList.length; i < imax; i += 1){
                if(!this.beenChecked(audioTagList[i])){
                    this.taglist.push(audioTagList[i]);
                    var tempAudioObj = new cc.MediaObject();
                    tempAudioObj.process(audioTagList[i]);
                    tempAudioObj.writeHTML4Object(); //need to do an add here for this.taglist;
                }}}};
    adr.MediaController.prototype.checkAll = function(){
        var ut = __imns('util.tools');
        this.checkHTML5AudioTags();
        this.checkHTML5AudioTags();
        if(this.needsVBSCorrection()){ ut.vbsObjectCorrection(); }
        return true; };
    adr.MediaController.prototype.beenChecked = function(elem){
        var found = false;
        for(var i=0, imax = this.taglist.length; i < imax; i += 1){
            if(elem === this.taglist[i]){ found = true; break; }}
        return found; };
    adr.MediaObject = function(){
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
        this.element = ""; };
    adr.MediaObject.prototype.process = function(elem){
        var ut = __imns('util.tools');
        this._autoplay = (ut.getAttribute(elem, "autoplay") !== null) ? ut.getAttribute(elem, "autoplay") : this._autoplay;
        this._class = (ut.getAttribute(elem, "class") !== null) ? ut.getAttribute(elem, "class") : this._class;
        this._controls = (ut.getAttribute(elem, "controls") !== null) ? ut.getAttribute(elem, "controls") : this._controls;
        this._height = (ut.getAttribute(elem, "height") !== null) ? ut.getAttribute(elem, "height") : this._height;
        this._id = (ut.getAttribute(elem, "id") !== null) ? ut.getAttribute(elem, "id") : this._id;
        this._loop = (ut.getAttribute(elem, "loop") !== null) ? ut.getAttribute(elem, "loop") : this._loop;
        this._name = (ut.getAttribute(elem, "name") !== null) ? ut.getAttribute(elem, "name") : this._name;
        this._poster = (ut.getAttribute(elem, "poster") !== null) ? ut.getAttribute(elem, "poster") : this._poster;
        this._preload = (ut.getAttribute(elem, "preload") !== null) ? ut.getAttribute(elem, "preload") : this._preload;
        this._width = (ut.getAttribute(elem, "width") !== null) ? ut.getAttribute(elem, "width") : this._width;

        this.element = elem;
        this.processSourceList(elem);
        this.valid = (this.sourcelist.length > 0) ? true : false; };
    adr.MediaObject.prototype.processSourceList = function(elem){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var tempSourceObj = "";
        if(ut.getAttribute(elem, "src") !== null){
            tempSourceObj = new cc.MediaSourceObject({
                'src' : ut.getAttribute(elem, 'src'), 
                'type' : ut.getAttribute(elem, 'type')});
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
                tempSourceObj = new cc.MediaSourceObject({
                        "src" : ut.getAttribute(elem, 'src'), 
                        "type" : ut.getAttribute(elem, "type"), 
                        "codec" : ut.getAttribute(elem, "codec")});
                if(tempSourceObj.valid){ this.sourcelist.push(tempSourceObj); }}
            this.rationalSourcelist();
            tempSourceObj = ""; }};
    adr.MediaObject.prototype.rationaliseSourceList = function(){
        var cc = __imns('component.classes');
        var pluginValid = false;
        for(var i = 0; i < this.sourcelist.length; i += 1){
            pluginValid = (this.sourcelist[i].type !== null) ? (new cc.MimeLibrary()).checkMimeType(this.sourcelist[i].type) : true;
            if(!pluginValid){
                this.sourcelist.splice(i, 1);
                i -= 1;
                if(this.sourcelist.length === 0){ break; }}}
        this.valid = (this.sourcelist.length > 0) ? true : false;
        return this.valid; };
    adr.MediaObject.prototype.writeHTML4Object = function(){
        var ut = __imns('util.tools');
        if(this.valid){
            var addElem, addElemList = [], str = "", isIE = false;
            for(var i = 0, imax = this.sourcelist.length; i < imax; i += 1){
                var objElem = document.createElement('object');
                if(objElem !== "[object HTMLObjectElement]"){
                    isIE = true;
                    objElem = document.createElement('iefixforinvalid'); }
                ut.setAttribute(objElem, 'data', this.sourcelist[i].src);
                if(this._class !== null){ ut.setAttribute(objElem, "class", this._class); }
                if(this.sourcelist[i].type){ ut.setAttribute(objElem, "type", this.sourcelist[i].type); }
                if(this._width !== 0){ ut.setAttribute(objElem, "width", this._width); }
                // if(this._height != 0){ setAttributer(objElem, "height", this._height); //for some reason - controls? crashing ie;
                objElem.appendChild(this.createParamTag('autoplay', this._autoplay));
                objElem.appendChild(this.createParamTag('loop', this._loop));
                objElem.appendChild(this.createParamTag('preload', this._preload));
                objElem.appendChild(this.createParamTag('controller', this._controls));
                //bathwater;
                objElem.appendChild(this.createParamTag('controller', this._controls));
                objElem.appendChild(this.createParamTag('src', ut.getAttribute(objElem, 'data')));
                objElem.appendChild(this.createParamTag('filename', ut.getAttribute(objElem, 'data')));
                objElem.appendChild(this.createParamTag('url', ut.getAttribute(objElem, 'data')));
                if(i === 0){
                    //these are the ones that should only be added once;
                    if(this._id !== null){ ut.setAttribute(objElem, 'id', this._id); }
                    if(this._name !== null){ ut.setAttribute(objElem, 'name', this._name); }
                    addElemList.push(objElem); }
                if(this._poster !== ""){
                    var imgElem = document.createElement('img');
                    ut.setAttribute(imgElem, 'src', this._poster);
                    if(this._width !== null){ ut.setAttribute(imgElem, 'width', this._width); }
                    if(this._height !== null){ ut.setAttribute(imgElem, 'height', this._height); }
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
    adr.MediaObject.prototype.createParamTag = function(n, v){
        var ut = __imns('util.tools');
        var paramElem = document.createElement('param');
        ut.setAttribute(paramElem, 'name', n);
        ut.setAttribute(paramElem, 'value', v);
        return paramElem; };
    adr.MediaSourceObject = function(){
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
        this.valid = (this.src !== null) ? true : false; };


}
