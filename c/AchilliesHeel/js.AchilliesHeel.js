/*jshint -W069 */
/*globals window, document, ScreenProperties, BoundaryCoordinates, debouce, fetter, findElementStyle, findElementByID, isNumber, isHTMLElement, measure, console */
"use strict";
/**
 * @class AchilliesHeel
 * @singleton
 * @param {HTMLElement} e
 * @param {HTMLElement} f
 */
function AchilliesHeel(e, f){
    if(AchilliesHeel.prototype.singleton !== undefined){ return AchilliesHeel.prototype.singleton; }
    AchilliesHeel.prototype.singleton = this;
    this.element = null;
    this.lastY = 0;
    this.fixedElement = null;
    this.initialized = false;
    this.active = false;
    this.method = 'absolute';
    this.offset = -100;
    this._overlap = 'waiting';
    this.scr = new ScreenProperties();
    this.init(e,f); }
/**
 * @method overlap
 * @return {Number} pixel value of overlap returned by bottom offset;
 */
AchilliesHeel.prototype.overlap = function(n){
    console.log('H@' + this.element);
    n = (n === undefined) ? 'a' : n;
    if(isNumber(n)){
        this._overlap = n;
    } else if(this._overlap === 'waiting'){
        if(isHTMLElement(this.element)){
            console.log('M');
            var o = findElementStyle(this.element, 'bottom');
            o = measure(o,'px',this.element);
            console.log('N');
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
AchilliesHeel.prototype.setElement = function(e){
    if(e !== undefined && isHTMLElement(e)){
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
AchilliesHeel.prototype.setFixedElement = function(e){
    if(e !== undefined && isHTMLElement(e)){
        this.fixedElement = e;
        this.reinitialize(); 
        if(e === this.fixedElement){ return true; }}
    return false; };
/**
 * @method reinitialize
 * attempts to reinitialize the AchilliesHeel if changed
 *  CAN I reinitialize? does it break shit?
 */
AchilliesHeel.prototype.reinitialize = function(){
    if(this.initialized){
        this.initialized = false;
        this.build(); }};
/**
 * @method activate
 * @return {Boolean} if !active and was able to set active = true;
 */
AchilliesHeel.prototype.activate = function(){
    if(!this.active && this.initialized){
        this.active = true;
        return true;
    } else { return false; } };
/**
 * @method suspend
 * @return {Boolean} TRUE always sets active to false even if uninit 
 */
AchilliesHeel.prototype.suspend = function(){
    this.active = false;
    return true;
};
/**
 * @method calculateHeightOffset
 * @return {Number:Float} pixel height offset, but number not a 0px string
 */
AchilliesHeel.prototype.calculateHeightOffset = function(){
    var t = findElementStyle(this.element, 'offsetTop'), s = this.scr.innerWindowHeight();
    t = parseFloat(t) - parseFloat(s);
    console.log('calculateHeightOffset::' + t + ':: should be a negative');
    console.log(this.overlap() + ':: hello');
    if(!isNumber(t)){
        t = measure((parseFloat(findElementStyle(this.element, 'height'))), 'px', this.element);
        t -= this.overlap();
    }
    AchilliesHeel.offset = t;
    return this.offset; };
/**
 * @method isBaseLocked
 * @return {Boolean}
 * Checks fixedElement position, if => element then confirms that element should be
 * allowed to move or reincluded in content position;
 */
AchilliesHeel.prototype.isBaseLocked = function(){
    var sof =  (this.element['style'].position !== 'absolute') ? parseFloat(this.scr.offsetY()) : 0, 
        mtop = findElementStyle(this.element, 'offsetTop'), 
        ftop = findElementStyle(this.fixedElement, 'offsetTop');
    if(findElementStyle(this.element, 'position') !== 'static'){
        return ((mtop + sof) >= ftop) ? true: false;
    } else {
        var iwh = parseFloat(this.scr.innerWindowHeight()), 
            fo = parseFloat((new BoundaryCoordinates(this.fixedElement)).y1);
        if((sof + iwh) < fo){
            return false;
        } else {
            var mh = parseFloat((new BoundaryCoordinates(this.element)).height), 
                tl = sof + iwh - (mh + this.offset);
            return (tl < fo) ? false : true; }}};
/**
 * @method fixedBaseLock
 * Adjust element style based on whether the element should be in content flow or fixed
 */
AchilliesHeel.prototype.fixedBaseLock = function(){
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
AchilliesHeel.prototype.jsMethod = function(){
    if(this.active){
        this.fixedBaseLock();
        var st = this.scr.getPageBounds();
        var b = (st.top + st.height) - AchilliesHeel.prototype.heightOffset;
        this.element.style['top'] = b + 'px'; }};
/**
 * @method runMethod
 * defaults to fixedBaseLock on scroll as css handles 'normal' positioning
 * then fixedBaseLock will position within content if condition hits
 */
AchilliesHeel.prototype.runMethod = AchilliesHeel.prototype.fixedBaseLock;
/**
 * @method init
 * @param {HTMLElement} e The Heel
 * @param {HTMLElement} f fixedElement = the foot
 * Init sets the two elements and builds the object
 */
AchilliesHeel.prototype.init = function(e, f){
    this.setElement(e);
    this.setFixedElement(f);
    this.build(); };
AchilliesHeel.prototype.setBaseOffset = function(d){
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
AchilliesHeel.prototype.build = function(){
    var c = this, s = findElementStyle(this.element, 'position');
    if(AchilliesHeel.prototype.heightOffset === undefined){ this.calculateHeightOffset(); }
    if(s !== 'fixed'){
        if(s !== 'absolute'){
            this.element.style.position = 'absolute'; //needed to hide the expression fix in IE7
            var nh = parseFloat((new BoundaryCoordinates(this.element)).height);
            this.element.style['height'] = (nh - this.offset) + 'px';
            AchilliesHeel.prototype.runMethod = AchilliesHeel.prototype.jsMethod; 
            this.method = 'absolute';
            this.jsMethod();
        } else {
            var str = 'expression(((document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop) + this.offset)';
            this.element.style.bottom = str;
        }
    } else { this.method = 'fixed'; }
    fetter(window, 'scroll', function(){
        var ny = c.scr.offsetY();
        if(ny !== c.lastY){ c.runMethod(); }
        c.lastY = ny;
    }, true);
    this.active = true;
    this.initialized = true;};
