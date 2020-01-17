/*jshint -W069 */
/*globals window, document, __imns, console */
"use strict";
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('AchilliesHeel' in adr)){
    /**
     * @class AchilliesHeel
     * @requiries BoundaryCoordinates, fetter, measure, isHTMLElement, findElementStyle, ScreenProperties, isNumber
     * @singleton
     * @param {HTMLElement} e
     * @param {HTMLElement} f
     */
    adr.AchilliesHeel = function(e, f){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        if(cc.AchilliesHeel.prototype.singleton !== undefined){ return cc.AchilliesHeel.prototype.singleton; }
        cc.AchilliesHeel.prototype.singleton = this;
        this.element = null;
        this.lastY = 0;
        this.fixedElement = null;
        this.initialized = false;
        this.active = false;
        this.method = 'absolute';
        this.offset = -100;
        this._overlap = 'waiting';
        this._suspend = null;
        this._activate = null;
        this.scr = new uc.ScreenProperties();
        this.init(e,f); };
    /**
     * @method overlap
     * @return {Number} pixel value of overlap returned by bottom offset;
     */
    adr.AchilliesHeel.prototype.overlap = function(n){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools'),
            ud = __imns('util.dom');
        n = (n === undefined) ? 'a' : n;
        if(uv.isNumber(n)){
            this._overlap = n;
        } else if(this._overlap === 'waiting'){
            if(uv.isHTMLElement(this.element)){
                var o = ud.findElementStyle(this.element, 'bottom');
                o = ut.measure(o,'px',this.element);
                o = parseFloat(o);
                this._overlap = o; 
                return this._overlap;
            } else { return 0; }
        } else { return this._overlap; }};
    /**
     * @method setElement
     * @param {HTMLElement} e
     * @return {Boolean}
     * Attempts to set AchilliesHeel main element, if .initialized, attempts to rebuild
     */
    adr.AchilliesHeel.prototype.setElement = function(e){
        var uv = __imns('util.validation');
        if(e !== undefined && uv.isHTMLElement(e)){
            this.element = e;
            this.reinitialize();
            if(e === this.element){ return true; }}
        return false; };
    /**
     * @method setFixedElement
     * @param {HTMLElement} e
     * @return {Boolean}
     * Attempts to set AchilliesHeel fixed element, if .initialized, attempts to rebuild
     */
    adr.AchilliesHeel.prototype.setFixedElement = function(e){
        var uv = __imns('util.validation');
        if(e !== undefined && uv.isHTMLElement(e)){
            this.fixedElement = e;
            this.reinitialize(); 
            if(e === this.fixedElement){ return true; }}
        return false; };
    /**
     * @method reinitialize
     * attempts to reinitialize the AchilliesHeel if changed
     *  CAN I reinitialize? does it break shit?
     */
    adr.AchilliesHeel.prototype.reinitialize = function(){
        if(this.initialized){
            this.initialized = false;
            this.build(); }};
    /** @method setActivate **/
    adr.AchilliesHeel.prototype.setActivate = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._activate = f; }
        return f === this._activate; };
    /**
     * @method activate
     * @return {Boolean} if !active and was able to set active = true;
     */
    adr.AchilliesHeel.prototype.activate = function(){
        if(!this.active && this.initialized){
            this.active = true;
            if(this._activate !== null && typeof this._activate === 'function'){
                this._activate(this); }
            return true; }
        return false; };
    /**
     * @method suspend
     * @return {Boolean} TRUE always sets active to false even if uninit 
     */
    adr.AchilliesHeel.prototype.setSuspend = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._suspend = f; }
        return f === this._suspend; };

    adr.AchilliesHeel.prototype.suspend = function(){
        if(this.active){
            this.active = false;
            if(this._suspend !== null && typeof this._suspend === 'function'){
                this._suspend(this); }
            return true; }
        return false; };
    /**
     * @method calculateHeightOffset
     * @return {Number:Float} pixel height offset, but number not a 0px string
     */
    adr.AchilliesHeel.prototype.calculateHeightOffset = function(){
        var ud = __imns('util.dom'),
            cc = __imns('component.classes'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var t = ud.findElementStyle(this.element, 'offsetTop'), s = this.scr.innerWindowHeight();
        t = parseFloat(t) - parseFloat(s);
        if(!uv.isNumber(t)){
            t = ut.measure((parseFloat(ud.findElementStyle(this.element, 'height'))), 'px', this.element);
            t -= this.overlap();
        }
        cc.AchilliesHeel.offset = t;
        return this.offset; };
    /**
     * @method isBaseLocked
     * @return {Boolean}
     * Checks fixedElement position, if => element then confirms that element should be
     * allowed to move or reincluded in content position;
     */
    adr.AchilliesHeel.prototype.isBaseLocked = function(){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        var sty = ud.findElementStyle(this.element, 'position'),
            sof =  (sty !== 'absolute') ? parseFloat(this.scr.offsetY()) : 0, 
            mtop = ud.findElementStyle(this.element, 'offsetTop'), 
            ftop = ud.findElementStyle(this.fixedElement, 'offsetTop');
        if(ud.findElementStyle(this.element, 'position') !== 'static'){
            return ((mtop + sof) >= ftop) ? true: false;
        } else {
            var iwh = parseFloat(this.scr.innerWindowHeight()), 
                fo = parseFloat((new uc.BoundaryCoordinates(this.fixedElement)).y1);
            if((sof + iwh) < fo){
                return false;
            } else {
                var mh = parseFloat((new uc.BoundaryCoordinates(this.element)).height), 
                    tl = sof + iwh - (mh + this.offset);
                return (tl < fo) ? false : true; }}};
    /**
     * @method fixedBaseLock
     * Adjust element style based on whether the element should be in content flow or fixed
     */
    adr.AchilliesHeel.prototype.fixedBaseLock = function(){
        if(this.active){
            var n = (this.isBaseLocked()) ? 'content' : 'fixed',
            p = this.element.style['position'];
            switch (n) {
                case 'fixed':
                    if(p === 'static'){ this.element.style['position'] = (this.method === 'fixed') ? 'fixed' : 'absolute'; } 
                    break;
                case 'content':
                    if(p !== 'static'){ this.element.style['position'] = 'static'; }
                    break; }}};
    /**
     * @method jsMethod
     * Alternate javascript method for positioning element if fixed is not available
     */
    adr.AchilliesHeel.prototype.jsMethod = function(){
        var cc = __imns('component.classes');
        if(this.active){
            this.fixedBaseLock();
            var st = this.scr.getPageBounds();
            var b = (st.top + st.height) - cc.AchilliesHeel.prototype.heightOffset;
            this.element.style['top'] = b + 'px'; }};
    /**
     * @method runMethod
     * defaults to fixedBaseLock on scroll as css handles 'normal' positioning
     * then fixedBaseLock will position within content if condition hits
     */
    adr.AchilliesHeel.prototype.runMethod = adr.AchilliesHeel.prototype.fixedBaseLock;
    /**
     * @method init
     * @param {HTMLElement} e The Heel
     * @param {HTMLElement} f fixedElement = the foot
     * Init sets the two elements and builds the object
     */
    adr.AchilliesHeel.prototype.init = function(e, f){
        this.setElement(e);
        this.setFixedElement(f);
        var c = this;
        (__imns('util.tools')).fetter(window, 'load', function(){ c.build(); }, true, 'after');
    };
    adr.AchilliesHeel.prototype.setBaseOffset = function(d){
        this.offset = -d;
        if(this.initialized){
           //added some crap to stop fail;
           var crap = 'needsRemoving and proper coding you fuckwit!';
        }
    };
    /* DONT THINK NEEDED
    AchilliesHeel.prototype.setBasePosition = function(){
        var nh = parseFloat((new BoundaryCoordinates(this.element)).height);
        this.element.style['height'] = (nh - this.offset) + 'px';
    };*/
    adr.AchilliesHeel.prototype.build = function(){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools'),
            uc = __imns('util.classes'), 
            ud = __imns('util.dom');
        var c = this, s = ud.findElementStyle(this.element, 'position');
        if(cc.AchilliesHeel.prototype.heightOffset === undefined){ this.calculateHeightOffset(); }
        if(s !== 'fixed'){
            if(s !== 'absolute'){
                this.element.style.position = 'absolute'; //needed to hide the expression fix in IE7
                var nh = parseFloat((new uc.BoundaryCoordinates(this.element)).height);
                this.element.style['height'] = (nh - this.offset) + 'px';
                cc.AchilliesHeel.prototype.runMethod = cc.AchilliesHeel.prototype.jsMethod; 
                this.method = 'absolute';
                this.jsMethod();
            } else {
                var str = 'expression(((document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop) + this.offset)';
                this.element.style.bottom = str;
            }
        } else { this.method = 'fixed'; }
        ut.fetter(window, 'scroll', [c, function(){
            var ny = c.scr.offsetY();
            if(ny !== c.lastY){ c.runMethod(); }
            c.lastY = ny;
        }], true);
        this.initialized = true;
        this.activate();
    };

}
