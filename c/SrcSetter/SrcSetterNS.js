"use strict";
/* global __imns, window, Image, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Srcsetter' in adr)){


    adr.SrcSetter = function(){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        if(cc.SrcSetter.prototype.singleton !== undefined){ return cc.SrcSetter.prototype.singleton; }
        cc.SrcSetter.prototype.singleton = this;
        this.supportsSrcset = -1;
        this.dppx = -1;
        this.processed = [];
        var c = this;
        ut.fetter(window, 'load', [c, function(){ c.processAll(); }], true, 'both'); };
    adr.SrcSetter.prototype.returnPixelRatio = function(){
        if(this.dppx !== -1){
            return this.dppx;
        } else if('devicePixelRatio' in window){
            this.dppx = Math.floor(window.devicePixelRatio);
            return this.dppx;
        } else if('matchMedia' in window){
            var test = "";
            test = "(-webkit-min-device-pixel-ratio: 3), (min--moz-device-pixel-ratio:3), (min-device-pixel-ratio:3), (min-resolution: 3dppx), (min-resolution:288dpi)";
            if(window.matchMedia(test).matches){ 
                this.dppx = 3;
                return this.dppx; }
            test = "(-webkit-min-device-pixel-ratio: 2), (min--moz-device-pixel-ratio:2), (min-device-pixel-ratio:2), (min-resolution: 2dppx), (min-resolution:192dpi)";
            if(window.matchMedia(test).matches){ 
                this.dppx = 2;
                return this.dppx; }}
        this.dppx = 1;
        return 1; };
    adr.SrcSetter.prototype.isSrcsetSupported = function(){
        if(this.supportsSrcset !== -1){
            return this.supportsSrcset;
        } else {
            var i = new Image();
            if('hasOwnProperty' in i){
                this.supportsSrcset = (i.hasOwnProperty('srcset')) ? true : false;
                return this.supportsSrcset;
            } else {
                this.supportsSrcset = ('srcset' in i) ? true : false;
                return this.supportsSrcset; }}};
    adr.SrcSetter.prototype.beenProcessed = function(e){
        for(var i=0, imax=this.processed.length; i<imax; i+=1){
            if(e === this.processed[i]){ return true; }}
        return false; };
    adr.SrcSetter.prototype.processAll = function(){
        var ud = __imns('util.dom');
        if(!this.isSrcsetSupported()){
            var arr = ud.findElementsByTag('img'), a = null;
            for(var i=0, imax=arr.length; i<imax; i+=1){ this.processImage(arr[i]); }
            return true;
        } else { return false; }};
    adr.SrcSetter.prototype.processImage = function(e){
        if(!this.isSrcsetSupported() && (e.hasAttribute('srcset') || 'srcset' in e) && !this.beenProcessed(e)){
            var t = this.getSrcFromSrcSet(e);
            this.processed.push(e);
            if(t !== ""){
                if('currentSrc' in e && e.currentSrc !== t){ 
                    e.currentSrc = t; 
                    return true;
                } else if('src' in e && e.src !== t){
                    e.src = t;
                    return true;
                } else { return true; }}}};
    adr.SrcSetter.prototype.getSrcFromSrcSet = function(e){
        var i, imax, imin;
        var s = this.getImageSrcSet(e);
        var d = this.returnPixelRatio();
        for(i=d, imin=0; i>imin; i-=1){
            if(s[i] !== undefined){ return s[i]; }}
        for(i=d, imax=s.length; i<imax; i+=1){
            if(s[i] !== undefined){ return s[i]; }}
        return ""; };
    adr.SrcSetter.prototype.getImageSrcSet = function(e){
        var ut = __imns('util.tools');
        var srcset = [], m;
        var _src = ut.getAttribute(e, 'src');
        var _srcset = ut.getAttribute(e, 'srcset');
        var _set = (typeof _srcset === 'string') ? _srcset.split(',') : [];
        var reg = /\s*([A-Za-z0-9\:\.\/\-\_]+)\s*([0-9])x\s*/;
        for(var i=0,imax=_set.length; i<imax; i+=1){
            if(typeof _set[i] === 'string' && reg.test(_set[i])){
                m = _set[i].match(reg);
                if(m[1] !== undefined && m[2] !== undefined){ srcset[Number(m[2])] = m[1]; }}}
        if(srcset[1] === undefined && typeof _src === 'string'){ srcset[1] = _src; }
        return srcset; };


}
