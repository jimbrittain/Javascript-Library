"use strict";
/* global console, HTMLDivElement, HTMLAudioElement, HTMLSourceElement, __imns, document */
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
        ut.fetter(document, 'DOMContentLoaded', function(){ (new cc.SoundCSSMaster()).setup(); }, 'after'); };
    /**
        @class SoundMasterCSS
        @method setup
        @description sets initialised to true, builds container element
     */
    adr.SoundCSSMaster.prototype.setup = function(){
        console.log('setting up');
        this.initialised = true;
        this.addContainer(); };
    /**
        @class SoundMasterCSS
        @method addContainer
        @description builds DOM Compliant element and creates references on master;
     */
    adr.SoundCSSMaster.prototype.addContainer = function(){
        var ud = __imns('util.dom'), bodyElem = ud.findElementsByTag('body')[0];
        var elem = '';
        if(HTMLDivElement !== undefined && typeof HTMLDivElement === 'function'){
            elem = new HTMLDivElement();
        } else if('createElement' in document){
            elem = document.createElement('div'); }
        ud.setAttribute(elem, 'style', 'display:none; overflow: hidden; width: 1px; height: 1px;');
        if('appendChild' in bodyElem){ bodyElem.appendChild(elem); }
        this.element = elem; };

    adr.SoundCSSMaster.prototype.mute = function(boo){
        var i = this.soundElements.length;
        if(boo === true || boo === false){
            this.muted = boo;
        } else { this.muted = !this.muted; }
        if(this.muted){
            while(i > -1){
                if(this.soundElements[i].endless){
                    this.soundElements[i].stop(); }
                i -= 1; }
        } else {
            while(i > -1){
                if(this.soundElements[i].endless){
                    this.soundElements[i].play(); }
                i -= 1; }}
        return this.muted; };

    adr.SoundCSSMaster.prototype.play = function(srcset){
        var uv = __imns('util.validation');
        if(uv.isNumber(srcset) && srcset > -1 && srcset < this.soundElements.length){ srcset = this.soundElements[srcset].srcset; }
        if(uv.isArray(srcset)){
            var el = this.findStoppedSoundElement(srcset);
            el.play();  }};

    adr.SoundCSSMaster.prototype.findSrcFromIndex = function(i){
        var uv = __imns('util.validation');
        if(uv.isNumber(i) && i > -1 && i < this.soundElements.length){ return this.soundElements[i]; }
        return ''; };

    adr.SoundCSSMaster.prototype.matchSrc = function(src){
        var i = this.findSrcIndex(src);
        if(i !== false){ return this.soundElements[i]; }
        return false; };

    adr.SoundCSSMaster.prototype.findSrcIndex = function(src){
        var i = this.soundElements.length;
        while(i > 0){
            i -= 1;
            if(this.soundElements[i].hasSrc(src)){ return i; }}
        return false; };

    adr.SoundCSSMaster.prototype.findStoppedSoundElement = function(src){
        var i = this.soundElements.length, cc = __imns('component.classes');
        while(i > 0){
            i -= 1;
            if(this.soundElements[i].hasSrc(src) && this.soundElements[i].hasEnded()){ return this.soundElements[i]; }}
        var sce = new cc.SoundCSSElement(src);
        this.soundElements.push(sce);
        return this.soundElements[this.soundElements.length - 1]; };

    adr.SoundCSSMaster.prototype.createSound = function(src, evt, element){
        var elem = this.matchSrc(src), srcIndex = this.findSrcIndex(src), uv = __imns('util.validation'), cc = __imns('component.classes');
        if(elem === false){
           var sce = new cc.SoundCSSElement(src);
           this.soundElements.push(sce);
           if(evt === 'endless'){
               sce.endless();
               sce.play(); 
           } else {
               if(uv.isHTMLElement(element)){ this.attach(element, evt, srcIndex); }}}};

    adr.SoundCSSMaster.prototype.attach = function(element, evt, src){ 
        var ut = __imns('util.tools'), cc = __imns('component.classes');
        ut.fetter(element, evt, function(){ (new cc.SoundCSSMaster()).play(src); }); };

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
    adr.SoundCSSElement.prototype.getElement = function(){ return (this.element === null) ? this.buildElement() : this.element; };
    adr.SoundCSSElement.prototype.buildElement = function(){
        var cc = __imns('component.classes'), masterElement = (new cc.SoundCSSMaster()).elem, ut = __imns('util.tools'), ud = __imns('util.dom');
        this.element = null;
        if(HTMLAudioElement !== undefined && typeof HTMLAudioElement === 'function'){
            this.element = new HTMLAudioElement();
        } else { this.element = document.createElement('audio'); }
        ud.setAttribute(this.element, 'controls', 'false');
        ud.setAttribute(this.element, 'loop', 'false');
        for(var i=0, imax = this.src.length; i<imax; i+=1){
            var subelem = '';
            if(HTMLSourceElement !== undefined && typeof HTMLSourceElement === 'function'){
                subelem = new HTMLSourceElement();
            } else { subelem = document.createElement('source'); }
            ud.setAttribute(subelem, 'src', this.src[i]);
            var srctype = ut.determineMimeTypeFromFileExtension(this.src[i]);
            if(srctype !== null){
                ud.setAttribute(subelem, 'type', srctype);
                this.element.appendChild(subelem); }}
        masterElement.appendChild(this.element);
        return this.element; };

    adr.SoundCSSElement.prototype.hasEnded = function(){
        if(this.endless){ return false; }
        if(this.element.hasOwnProperty('ended')){
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
            this.elem.play();
        }
    };
    adr.SoundCSSElement.prototype.stop = function(){
        var elem = this.getElement();
        if('stop' in elem){ this.elem.stop(); }};

    var ut = __imns('util.tools');
    ut.soundcss = function(srcset, element, event){
        var cc = __imns('component.classes'), sm = new cc.SoundCSSMaster();
        if(sm.initialised){ sm.createSound(srcset, element, event); }};
}
