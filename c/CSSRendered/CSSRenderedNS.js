"use strict";
/* global window, IMDebugger, $, __imns, document */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CSSRendered' in adr)){
    adr.CSSRendered = function(){
        var uc = __imns('util.classes');
        if(uc.CSSRendered.prototype.singleton !== undefined){
            return uc.CSSRendered.prototype.singleton;
        } else { uc.CSSRendered.prototype.singleton = this; }
        this._hasRendered = false;
        this.event = null;
        this.itvl = null;
        this.init(); 
        uc.CSSRendered.prototype.init = function(){};
    };
    adr.CSSRendered.prototype.init = function(){
        var ut = __imns('util.tools'),
            uc = __imns('util.classes');
        ut.fetter(document, 'DOMContentLoaded', [this, function(){
                var uc = __imns('util.classes');
                (new uc.CSSRendered()).domload();
            }], true, 'after');
        this.evt = new uc.CustomEvent({
            'name' : 'CSSContentRendered',
            'data' : ''}); };
    adr.CSSRendered.prototype.hasRendered = function(){ return (this._hasRendered !== true) ? this.checkCSSLoaded() : this._hasRendered; };
    adr.CSSRendered.prototype.domload = function(){
        this.itvl = window.setInterval(function(){
            var uc = __imns('util.classes');
            (new uc.CSSRendered()).checkCSSLoaded(); }, 50); };
    adr.CSSRendered.prototype.clearInterval = function(){
        if(this.itvl !== null){
            window.clearInterval(this.itvl);
            this.itvl = null; }};
    adr.CSSRendered.prototype.checkCSSLoaded = function(){
        var ud = __imns('util.dom');
        var linktags = ud.findElementsByTag('link'), 
            sheettags = [],
            done = true,
            i, imax, el;
        for(i=0, imax = linktags.length; i<imax; i+=1){
            el = linktags[i];
            if(ud.hasAttribute(el, 'rel') && (ud.getAttribute(el, 'rel')).match('/^stylesheet$/i')){
                sheettags.push(el); }}
        for(i=0, imax = sheettags.length; i<imax; i+=1){
            el = sheettags[i];
            if('readyState' in el){
                if(el.readyState === 'loading' || el.readyState === 'uninitialized'){
                    done = false;
                    break; }}
            if('sheet' in el){
                if(el.sheet === null){
                    done = false;
                    break; }}}
        return (done) ? this.loaded() : false; };
    adr.CSSRendered.prototype.loaded = function(){
        this.evt.fire(document);
        this._hasRendered = true;
        this.clearInterval();
        return true; };
    __imns('util.tools').CSSRendered = new adr.CSSRendered();
}
