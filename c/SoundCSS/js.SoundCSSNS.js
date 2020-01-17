"use strict";
/* global HTMLDivElement, HTMLAudioElement, HTMLSourceElement, __imns, document, window, console */
var adr = __imns('component.classes');
//var adr = window //uncomment line for standalone;
if(!('SoundCSSMaster' in adr)){
    /**
        @module SoundCSS
        @class SoundCSSMaster
        @singleton
        @constructor
     */
    adr.SoundCSSMaster = function(){
        var cc = __imns('component.classes');
        if(cc.SoundCSSMaster.prototype.singleton !== undefined){ return cc.SoundCSSMaster.prototype.singleton; }
        cc.SoundCSSMaster.prototype.singleton = this;
        this.muted = false;
        this.shouldPreload = true;
        this.soundElements = [];
        this.srcFiles = [];
        this.element = null;
        this.initialised = false;
        this.init(); };
    /**
        @class SoundMasterCSS
        @method init
        @description creates fetter to fire after DOMContentLoaded to fire setup
     */
    adr.SoundCSSMaster.prototype.init = function(){
        var ut = __imns('util.tools'), cc = __imns('component.classes');
        var c = this;
        ut.fetter(document, 'DOMContentLoaded', [c, function(){ (new cc.SoundCSSMaster()).setup(); }], true, 'both'); };
    /**
        @class SoundMasterCSS
        @method setup
        @description sets initialised to true, builds container element
     */
    adr.SoundCSSMaster.prototype.setup = function(){
        this.initialised = true;
        this.addContainer(); 
        if(this.shouldPreload){
            var ut = __imns('util.tools'), cc = __imns('component.classes');
            var c = this;
            ut.fetter(window, 'load', [c, function(){ (new cc.SoundCSSMaster()).preload(); }], true, 'both'); }};
    adr.SoundCSSMaster.prototype.cancelPreload = function(){ this.shouldPreload = false; };
    adr.SoundCSSMaster.prototype.preload = function(){ for(var i=0, imax=this.soundElements.length; i<imax; i+=1){ this.soundElements[i].getElement(); }};
    /**
        @class SoundMasterCSS
        @method addContainer
        @description builds DOM Compliant element and creates references on master;
     */
    adr.SoundCSSMaster.prototype.addContainer = function(){
        if(this.element === null){
        var ud = __imns('util.dom'), bodyElem = ud.findElementsByTag('body')[0];
        var elem = '';
        if((HTMLDivElement !== undefined && typeof HTMLDivElement === 'function') || 'createElement' in document){ elem = document.createElement('div'); }
        ud.setAttribute(elem, 'style', 'display:none; overflow: hidden; width: 1px; height: 1px;');
        if('appendChild' in bodyElem){ bodyElem.appendChild(elem); }
        this.element = elem; }};

    adr.SoundCSSMaster.prototype.mute = function(boo){
        var i = this.soundElements.length;
        if(boo === true || boo === false){
            this.muted = boo;
        } else { this.muted = !this.muted; }
        if(this.muted){
            while(i > 0){
                i -= 1;
                if(this.soundElements[i].endless){
                    this.soundElements[i].stop(); }}
        } else {
            while(i > 0){
                i -= 1;
                if(this.soundElements[i].endless){
                    this.soundElements[i].play(); }}}
        return this.muted; };

    adr.SoundCSSMaster.prototype.play = function(srcset){
        if(!this.muted){
        var uv = __imns('util.validation');
        if(uv.isNumber(srcset) && srcset > -1 && srcset < this.soundElements.length){ srcset = this.soundElements[srcset].srcset; }
        if(uv.isArray(srcset)){
            var el = this.findStoppedSoundElement(srcset);
            el.play(); }}};

    adr.SoundCSSMaster.prototype.findSrcFromIndex = function(i){
        var uv = __imns('util.validation');
        if(uv.isNumber(i) && i > -1 && i < this.soundElements.length){ return this.soundElements[i]; }
        return ''; };

    adr.SoundCSSMaster.prototype.matchSrc = function(src){
        var i = this.findSrcIndex(src);
        if(i !== -1){ return this.soundElements[i]; }
        return false; };

    adr.SoundCSSMaster.prototype.findSrcIndex = function(src){
        var i = this.soundElements.length;
        while(i > 0){
            i -= 1;
            if(this.soundElements[i].hasSrc(src)){ return i; }}
        return -1; };

    adr.SoundCSSMaster.prototype.findStoppedSoundElement = function(src){
        var i = this.soundElements.length, cc = __imns('component.classes');
        while(i > 0){
            i -= 1;
            if(this.soundElements[i].hasSrc(src) && this.soundElements[i].hasEnded()){ return this.soundElements[i]; }}
        var sce = new cc.SoundCSSElement(src);
        this.soundElements.push(sce);
        return this.soundElements[this.soundElements.length - 1]; };

    adr.SoundCSSMaster.prototype.createSound = function(src, element, evt){
        var elem = this.matchSrc(src), uv = __imns('util.validation'), cc = __imns('component.classes');
        if(elem === false){
           var sce = new cc.SoundCSSElement(src);
           this.soundElements.push(sce); 
           elem = sce; }
       if(evt === 'endless'){
           elem = this.findStoppedSound(src);
           elem.endless();
           elem.play(); 
       } else {
           var srcIndex = this.findSrcIndex(src);
           if(element !== undefined && (uv.isHTMLElement(element) || element === document)){ 
               if(evt !== 'now'){
                   if(this.initialised){ elem.getElement(); }
                    this.attach(element, evt, srcIndex); 
               } else {
                   this.play(src); }
           } else { elem.getElement(); }}};

    adr.SoundCSSMaster.prototype.attach = function(element, evt, src){ 
        var ut = __imns('util.tools'), cc = __imns('component.classes');
        ut.fetter(element, evt, [element, function(){ 
            (new cc.SoundCSSMaster()).play(src); }]); };
    adr.SoundCSSMaster.prototype.error = function(e){
        if('srcElement' in e && (__imns('util.validation')).isHTMLElement(e.srcElement)){
            var s = (__imns('util.dom')).getAttribute(e.srcElement, 'src');
            (new (__imns('util.debug')).IMDebugger()).pass('SoundCSS could not load ' + s);
            this.removeSrc(s); }};
    adr.SoundCSSMaster.prototype.__removeSingleSrc = function(src){
        var i = 0;
        while(i < this.soundElements.length){
            if(this.soundElements[i].hasSrc(src)){
                this.soundElements[i].removeSrc(src);
                if(this.soundElements[i].srcset.length < 1){ 
                    i -= 1;
                    this.soundElements.splice(i, 1); }}
             i += 1; }};
    adr.SoundCSSMaster.prototype.removeSrc = function(src){
        var uv = __imns('util.validation');
        src = (!(uv.isArray(src)) && typeof src === 'string') ? [src] : src;
        if(uv.isArray(src)){
            for(var i=0, imax=src.length; i<imax; i+=1){ this.__removeSingleSrc(src[i]); }
            return true; }
        return false; };

    adr.SoundCSSElement = function(src){
        this.element = null;
        this.endless = false;
        this.srcset = [];
        this.mediaObject = null; 
        this.setSrc(src); };
    adr.SoundCSSElement.prototype.setSrc = function(src){
        var uv = __imns('util.validation');
        src = (!(uv.isArray(src))) ? [src] : src;
        this.srcset = src; };
    adr.SoundCSSElement.prototype.hasSrc = function(filename){
        var uv = __imns('util.validation');
        filename = (uv.isArray(filename)) ? filename[0] : filename;
        var i = this.srcset.length;
        while(i > 0){
            i -= 1;
            if(this.srcset[i] === filename){ return true; }}
        return false; };
    adr.SoundCSSElement.prototype.removeSrc = function(filename){
        var i = this.srcset.length;
        while(i > 0){
            i -= 1;
            if(this.srcset[i] === filename){ this.srcset.splice(i, 1); }}};
    adr.SoundCSSElement.prototype.getElement = function(){ return (this.element === null) ? this.buildElement() : this.element; };
    adr.SoundCSSElement.prototype.buildElement = function(){
        if(this.srcset.length > 0){
        var cc = __imns('component.classes'), masterElement = (new cc.SoundCSSMaster()).element, ut = __imns('util.tools'), ud = __imns('util.dom');
        this.element = null;
        if(HTMLAudioElement !== undefined && typeof HTMLAudioElement === 'function'){
            //this.element = new HTMLAudioElement();
            this.element = document.createElement('audio');
        } else { this.element = document.createElement('audio'); }
        for(var i=0, imax = this.srcset.length; i<imax; i+=1){
            var subelem = '';
            if(HTMLSourceElement !== undefined && typeof HTMLSourceElement === 'function'){
                //subelem = new HTMLSourceElement();
                subelem = document.createElement('source');
            } else { 
                subelem = document.createElement('source'); }
            ud.setAttribute(subelem, 'src', this.srcset[i]);
            var srctype = (new cc.MimeTypeLibrary()).determineMimeTypeFromFileName(this.srcset[i]);
            if(srctype !== null && srctype !== undefined){
                ud.setAttribute(subelem, 'type', srctype);
                this.element.appendChild(subelem); }}
        masterElement.appendChild(this.element);
        ud.setAttribute(this.element, 'controls', 'false');
        ud.setAttribute(this.element, 'loop', 'false');
        if('loop' in this.element){ this.element.loop = false; }
        this.errorHandler();
        return this.element; }};
    adr.SoundCSSElement.prototype.errorHandler = function(){
        var ut = __imns('util.tools');
        ut.fetter(this.element, 'error', [this.element, function(e){ 
            var cc = __imns('component.classes');
            (new cc.SoundCSSMaster()).error(e); }], true);
    };

    adr.SoundCSSElement.prototype.hasEnded = function(){
        if(this.endless){ return false; }
        if(this.element === null){
            return true;
        } else if('ended' in this.element){
            return this.element.ended;
        }
    };
    adr.SoundCSSElement.prototype.endless = function(){
        var ud = __imns('util.dom');
        ud.setAttribute(this.element, 'loop', 'true');
        this.element.loop = true;
        this.endless = true;
        return true; };
    adr.SoundCSSElement.prototype.play = function(){
        var elem = this.getElement();
        if('play' in elem){
            elem.play();
        }
    };
    adr.SoundCSSElement.prototype.stop = function(){
        var elem = this.getElement();
        if('stop' in elem){ this.elem.stop(); }};

    var ut = __imns('util.tools');
    ut.soundcss = function(srcset, element, evt){
        var cc = __imns('component.classes'), sm = new cc.SoundCSSMaster(), uv = __imns('util.validation'), ud = __imns('util.dom');
        if(typeof srcset === 'object' && !(uv.isArray(srcset))){
            evt = ('evt' in srcset) ? srcset.evt : undefined;
            element = ('element' in srcset) ? srcset.element : undefined;
            if('src' in srcset){
                srcset = srcset.src;
            } else {
                srcset = ('srcset' in srcset) ? srcset.srcset : undefined; }}
        var okay = (evt === undefined || element === undefined || srcset === undefined) ? false : true;
        if(sm.initialised && okay){ 
            element = (uv.isHTMLElement(element) || element === document) ? [element] : ud.htmlNodesToArray(element);
            evt = (uv.isArray(evt)) ? evt : ut.commaStringToArray(evt);
            srcset = (uv.isArray(srcset)) ? srcset : ut.commaStringToArray(srcset);
            var i, imax, n, nmax;
            for(i=0, imax = element.length; i<imax; i+=1){
                for(n=0, nmax = evt.length; n<nmax; n+=1){
                    sm.createSound(srcset, element[i], evt[n]); }}}};
}
