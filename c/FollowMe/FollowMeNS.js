"use strict";
/* global __imns, window */
/* jshint -W069 */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('FollowMe' in adr)){


    adr.FollowMe = function(){
        var cc = __imns('component.classes');
        if(cc.FollowMe.prototype.singleton !== undefined){ return cc.FollowMe.prototype.singleton; }
        cc.FollowMe.prototype.singleton = this;
        this.enabled = false;
        this.anim = null;
        this.element = null;
        this.top_limit = 0;
        this.bottom_limit = 0;
        this.offset = 12;
        this.duration = 150;
        this.destination = null;
        this.bottom_offset = 0;
        this.animation_started = new Date().getTime();
        this.__cssanimate = -1;
        this.__functional = null; };
    adr.FollowMe.prototype.shouldCSSAnimate = function(){
        var uc = __imns('util.classes');
        if(this.__cssanimate === -1){ this.__cssanimate = (new uc.SupportedCSSProperty('transition-property').exists) ? true : false; }
        return this.__cssanimate; };
    adr.FollowMe.prototype.getAnimationTime = function(){
        var curr = this.animation_started - (new Date().getTime());
        return (curr > this.duration) ? this.duration : 150; };
    adr.FollowMe.prototype.isFunctional = function(){
        if(this.__functional !== null && typeof this.__functional === 'function'){ return (this.__functional()) ? true : false; }
        return true; };
    adr.FollowMe.prototype.assignFunctional = function(f){
        if(f !== undefined && typeof f === 'function'){ 
            this.__functional = f;
            return true; } else { return false; }};
    adr.FollowMe.prototype.init = function(e){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ut = __imns('util.tools');
        if(e !== undefined){
            if(uv.isHTMLElement(e)){
                this.element = e;
            } else if(typeof e === 'object'){
                if('element' in e){ this.setElement(e.element); }
                if('duration' in e){ this.setDuration(e.duration); }
                if('functional' in e){ this.assignFunctional(e.functional); }
                if('offset' in e){ this.setOffset(e.offset); }
                if('limit' in e && ('top' in e.limit || 'bottom' in e.limit)){
                    if('top' in e.limit){ this.setTopLimit(e.limit.top); }
                    if('bottom' in e.limit){ this.setBottomLimit(e.limit.bottom); }}
                if('bottom_offset' in e){ this.setBottomOffset(e.bottom_offset); }}
        }
        this.anim = new uc.Animation({
            'element' : this.element, 
            'descriptor' : 'FollowMe' });
        this.anim.master.fps = 60;
        var c = this;
        ut.fetter(window, "scroll", [c, function(){ 
            var ut = __imns('util.tools');
            ut.debounce(function(){ c.apply(c); }, 20); }]);
        this.enabled = this.isFunctional(); };
    adr.FollowMe.prototype.setElement = function(e){ 
        var uv = __imns('util.validation');
        if(e !== undefined && uv.isHTMLElement(e)){ this.element = e; return true; } else { return false; }};
    adr.FollowMe.prototype.setDuration = function(n){
        var uv = __imns('util.validation');
        if(n !== undefined){
            var num = parseFloat(n);
            if(uv.isNumber(num)){
                num *= (uv.isSeconds(n)) ? 1000 : 1;
                this.duration = num;
                return true; }}
        return false; };
    adr.FollowMe.prototype.setOffset = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0){
            this.offset = n;
            return true;
        } else { return false; }};
    adr.FollowMe.prototype.setBottomOffset = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0){
            this.bottom_offset = n;
            return true; 
        } else { return false; }};
    adr.FollowMe.prototype.setTopLimit = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0){
            this.top_limit = n;
            return true;
        } else { return false; }};
    adr.FollowMe.prototype.setBottomLimit = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0){
            this.bottom_limit = n;
            return true;
        } else { return false; }};
    adr.FollowMe.prototype.refreshLimits = function(n){
        var uc = __imns('util.classes');
        var s = (new uc.ScreenProperties());
        this.bottom_limit = s.documentHeight() - this.bottom_offset; };
    adr.FollowMe.prototype.moveTo = function(y){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom');
        if(this.destination !== y){
            this.destination = y;
            if(this.shouldCSSAnimate()){
                this.element.style[(new uc.SupportedCSSProperty('transition-duration')).jsProperty] = this.getAnimationTime();
                this.element.style['top'] = this.destination + 'px';
            } else {
                this.anim.pause();
                var theStart = ud.findElementStyle(this.element, 'top');
                this.anim.addProperty({
                    'property' : 'top', 
                    'end' : this.destination + 'px' });
                this.anim.run(); }}};
    adr.FollowMe.prototype.apply = function(c){
        var uc = __imns('util.classes');
        if(this.enabled && this.isFunctional()){
            var s = (new uc.ScreenProperties()).offsetY();
            this.refreshLimits();
            if(!isNaN(Number(s))){
                var y = s + this.offset;
                y = (y < this.top_limit) ? this.top_limit : y;
                y = (y > this.bottom_limit) ? this.bottom_limit : y;
                this.moveTo(y);
                this.animation_started = new Date().getTime();
            } else { this.enabled = this.isFunctional(); }}};


}
