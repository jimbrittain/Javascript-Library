"use strict";
/* jshint -W069 */
/* global window, IMDebugger, $, __imns, setTimeout, console */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('SpriteAnimation' in adr)){
    adr.SpriteAnimation = function(elem){
        this.initiated = false;
        this.element = null;
        this.container = null;
        this.direction = 'left';
        this.fps = 24;
        this.end = 'end';
        this._end = null;
        this.endKeywords = ['start', 'end', 'bounce', 'infinite'];
        this.animation = null;
        this.starttime = null;
        this.to = null;
        this.clean = true;

        var ut = __imns('util.tools'),
            c = this;
        ut.fetter(window, 'load', [c, function(){ c.init(elem); }], true, 'after');
    };
    adr.SpriteAnimation.prototype.init = function(o){
        var dv = __imns('application.vars'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        this.fps = (dv.fps !== undefined && uv.isNumber(dv.fps)) ? dv.fps : this.fps;
        if(uv.isHTMLElement(o)){
            this.setElement(o);
            this.setContainer(); 
            this.determineDirection();
        } else if(typeof o === 'object'){
            var obj = {
                element : null,
                container: null,
                direction: null,
                clean: false,
                end: null,
                endFunction: null,
                fps: null };
            var args = ut.handlePassedArguments(o, obj);
            this.setClean(args.clean);
            this.setElement(args.element);
            this.setContainer(args.container);
            this.setFPS(args.fps);
            this.setDirection(args.direction);
            if(this.endFunction !== null){
                this.setEnd(args.endFunction);
            } else { this.setEnd(args.end); }
        }
        this.establish(); };
    adr.SpriteAnimation.prototype.determineDirection = function(){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom');
        if(this.element !== null){
            var eb = new uc.BoundaryCoordinates(this.element);
            var cb = new uc.BoundaryCoordinates(this.container);
            if(cb.width < eb.width){
                return (eb.x1 < cb.x1) ? 'right' : 'left';
            } else if(cb.height < eb.height){
                return (eb.y1 < cb.y1) ? 'bottom' : 'top'; }}
        return 'left'; };
    adr.SpriteAnimation.prototype.play = function(){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools');
        uc.SpriteAnimation.prototype.id = (uc.SpriteAnimation.prototype.id === undefined) ? 1 : uc.SpriteAnimation.prototype.id + 1;
        var name = 'imspriteanimation' + uc.SpriteAnimation.prototype.id;
        if((new uc.SupportedCSSProperty('animation')).exists){
            var keyframesString = '',
                c = this;
            this.element.style[(new uc.SupportedCSSProperty('animation-timing-function')).jsProperty] = 'steps(' + (this.frames() - 1) + ')';
            if(this.end !== 'bounce'){
                this.element.style[(new uc.SupportedCSSProperty('animation-duration')).jsProperty] = this.duration() + 's';
                keyframesString = '0% { ' + this.direction + ': 0; } 100% { ' + this.direction + ': ' + this.distance() + 'px; }'; 
            } else {
                this.element.style[(new uc.SupportedCSSProperty('animation-duration')).jsProperty] = (this.duration() * 2) + 's';
                keyframesString = '0% { ' + this.direction + ': 0; } 50% { ' + this.direction + ': ' + this.distance() + 'px; } 100% { ' + this.direction + ':0; }'; }
            switch (this.end){
                case 'bounce':
                case 'infinite':
                    this.element.style[(new uc.SupportedCSSProperty('animation-fill-mode')).jsProperty] = 'infinite';
                    break;
                case 'start':
                    this.element.style[(new uc.SupportedCSSProperty('animation-fill-mode')).jsProperty] = 'backwards';
                    break;
                case 'end':
                    this.element.style[(new uc.SupportedCSSProperty('animation-fill-mode')).jsProperty] = 'forwards';
                    break;
                case 'function':
                    this.element.style[(new uc.SupportedCSSProperty('animation-fill-mode')).jsProperty] = 'forwards';
                    break; }
            if(!(this.end === 'bounce' || this.end === 'infinite')){
                this.to = setTimeout(function(){ c.complete(); }, (parseInt(this.duration() * 1000) + 50)); }
            var t = ut.addKeyframes(name, keyframesString);
            this.element.style[(new uc.SupportedCSSProperty('animation-name')).jsProperty] = name;
            return true; 
        } else {
            var args = ({
                'element' : this.element,
                'descriptor' : name,
                'duration' : parseInt(this.duration() * 1000) + 'ms',
                'timing-function': 'linear',
                'property' : [this.direction, 0, this.distance()],
                'endFunction' : function(){ c.complete(); }
            });
            this.animation = new uc.Animation(args);
            this.animation.setFPS(this.fps);
            this.animation.forceJSAnimate();
            this.animation.run(); }};
    adr.SpriteAnimation.prototype.duration = function(){ return (this.frames()/this.fps); };
    adr.SpriteAnimation.prototype.setClean = function(b){
        var uv = __imns('util.validation');
        if(uv.isBoolean(b)){
            this.clean = b;
            return true; }
        return false; };
    adr.SpriteAnimation.prototype.setEnd = function(f){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        if(uv.isString(f) && ut.inArray(f, this.endKeywords)){
            this.end = f;
            return true;
        } else if(uv.isFunction(f)){
            this.end = 'end';
            this._end = f;
            return true; }
        return false; };
    adr.SpriteAnimation.prototype.complete = function(){
        var uc = __imns('util.classes');
        if(this.animation !== null){
            this.animation = null;
        } else {
            if(this.clean){
                this.element.style[(new uc.SupportedCSSProperty('animation-name')).jsProperty] = '';
                this.element.style[(new uc.SupportedCSSProperty('animation-timing-function')).jsProperty] = '';
                this.element.style[(new uc.SupportedCSSProperty('animation-property')).jsProperty] = '';
                this.element.style[(new uc.SupportedCSSProperty('animation-fill-mode')).jsProperty] = ''; }}
        if(this.end === 'function' && this._end !== null){ this._end(); }};
    adr.SpriteAnimation.prototype.setElement = function(el){
        var uv = __imns('util.validation');
        if(uv.isHTMLElement(el)){
            this.element = el;
            return true; }
        return false; };
    adr.SpriteAnimation.prototype.setContainer = function(el){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(uv.isHTMLElement(el) && uv.isChildOf(this.element, el)){
            this.container = el;
            return true;
        } else {
            this.container = ud.findParent(this.element);
            return false; }};
    adr.SpriteAnimation.prototype.setDirection = function(d){
        var uv = __imns('util.validation');
        if(uv.isString(d)){
            d = d.toLowerCase();
            switch (d) {
                case 'lr':
                case 'left':
                case 'l':
                    this.direction = 'left';
                    return true;
                case 'rl':
                case 'right':
                case 'r':
                    this.direction = 'right';
                    return true;
                case 'tb':
                case 'top':
                case 't':
                    this.direction = 'top';
                    return true;
                case 'bt':
                case 'bottom':
                case 'b':
                    this.direction = 'bottom';
                    return true; }}
        return false; };
    adr.SpriteAnimation.prototype.setFPS = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0 && parseFloat(n) === parseInt(n)){ 
            this.fps = n; 
            return true; }
        return false; };
    adr.SpriteAnimation.prototype.length = function(){
        var ud = __imns('util.dom');
        return (this.direction === 'left' || this.direction === 'right') ? parseFloat(ud.findElementStyle(this.element, 'offsetWidth')) : parseFloat(ud.findElementStyle(this.element, 'offsetHeight')); };
    adr.SpriteAnimation.prototype.distance = function(){ return ((0 - this.length()) + this.frameWidth()); };
    adr.SpriteAnimation.prototype.frameWidth = function(){
        var ud = __imns('util.dom');
        var m = (this.direction === 'left' || this.direction === 'right') ? 'Width' : 'Height',
            cw = parseFloat(ud.findElementStyle(this.container, 'inner' + m));
        return cw; };
    adr.SpriteAnimation.prototype.frames = function(){
        var ud = __imns('util.dom');
        var m = (this.direction === 'left' || this.direction === 'right') ? 'Width' : 'Height',
            cw = parseFloat(ud.findElementStyle(this.container, 'inner' + m)),
            ew = parseFloat(ud.findElementStyle(this.element, 'offset' + m));
        return (Math.round(ew/cw)); };
    adr.SpriteAnimation.prototype.currentFrame = function(){
        var ud = __imns('util.dom');
        var m = (this.direction === 'left' || this.direction === 'right') ? 'Width' : 'Height',
            ew = parseFloat(ud.findElementStyle(this.container, 'inner' + m)),
            cp = parseFloat(ud.findElementStyle(this.element, this.direction));
        return Math.round(cp/ew); };
    adr.SpriteAnimation.prototype.establish = function(){
        var ud = __imns('util.dom');
        if(this.element !== null && this.container !== null){
            if(ud.findElementStyle(this.container, 'position') !== 'relative'){ this.container.style['position'] = 'relative'; }
            if(ud.findElementStyle(this.element, 'position') !== 'absolute'){ this.element.style['position'] = 'absolute'; }
            this.ensureContainerOverflow(); }
        return false; };
    adr.SpriteAnimation.prototype.ensureContainerOverflow = function(){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var ov, o;
        if(uv.isHTMLElement(this.container)){
            o = ud.findElementStyle(this.container, 'overflow');
            if(o !== 'hidden' && (new uc.SupportedCSSProperty('overflow-x')).exists){
                if(this.direction === 'top' || this.direction === 'bottom'){
                    ov = ud.findElementStyle(this.container, (new uc.SupportedCSSProperty('overflow-y')).cssProperty);
                    if(ov !== 'hidden'){ this.container.style[(new uc.SupportedCSSProperty('overflow-y')).jsProperty] = 'hidden'; }
                    return true;
                } else {
                    ov = ud.findElementStyle(this.container, (new uc.SupportedCSSProperty('overflow-x')).cssProperty);
                    if(ov !== 'hidden'){ this.container.style[(new uc.SupportedCSSProperty('overflow-x')).jsProperty] = 'hidden'; }
                    return true; }
            }
            this.container.style['overflow'] = 'hidden';
            return true; }
        return false; };
}
