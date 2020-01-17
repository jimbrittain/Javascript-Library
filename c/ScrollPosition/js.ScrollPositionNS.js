"use strict";
/*jshint -W069 */
/*globals clearTimeout, setTimeout, console, window, document, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ScrollPosition' in adr)){


    /* needs 
     * 		check new AnimationMaster,
     * 		quick and dirty scroller;
     * 		better way of adding the ScrollPositions and ScrollPositionals, ScrollPositionals in particular should be noted in Master;
     */


    /* 
     * js.ScrollPosition.js and js.ScrollPosition.min.js
     * @module ScrollPositional
     * @author JDB - jim@immaturedawn.co.uk 2015
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2015
     * @version - 0.2
     * @requires isHTMLElement, inVisibleDOM, BoundaryCoordinates, getAttributer, isArray, ScrollPositional, console, Animation, ScreenProperties, findElementStyle, window, fetter
    */

    /*
     * @submodule ScrollPositionMaster
     * @constructor
     * @param none
     * @notes singleton, used to refer to ScrollPositional instances, provide global modules,
     * 			and through use of (new ScrollPositionMaster()).scrollToElement(), a quick scroller;
     * 			Also contains default scrolling animation properties, and animation instance.
     */
    adr.ScrollPositionMaster = function(){
        var cc = __imns('component.classes');
        if(cc.ScrollPositionMaster.prototype.singleton !== undefined){ return cc.ScrollPositionMaster.prototype.singleton; }
        cc.ScrollPositionMaster.prototype.singleton = this;
        this.child_id = 0;
        this.default_anim_props = {
            'duration' : 2000, 
            'timingFunction' : 'ease-in-out'};
        this.anim = null; //all share same animation as can only function independently;
        this.scrollCheckElement = null;
        this.possible = false;
        this.justdone = false;
        this.timeout_id = null;
        this.timeout_ms = 5;
        this.init();
        return this; };
    /*
     * @method ScrollPositionMaster.init
     * @param none
     * @notes 
     * 	currently only used to build scroll hider, could add ability to change default_anim_props here?
     */
    adr.ScrollPositionMaster.prototype.init = function(){ this.createScrollHider(); };
    /*
     * @method ScrollPositionMaster.createScrollHider
     * @param none
     * @notes 
     * 	builds a hidden element, which is used to control scrolling with a unique id;
     * 	must be fired after DOMContentLoaded, handled by use of fetter.
     */
    adr.ScrollPositionMaster.prototype.userCancelInit = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.fetter(window, 'scroll', [c, function(){ (new cc.ScrollPositionMaster()).userCancel(); }], true); };
    adr.ScrollPositionMaster.prototype.userCancelAbort = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.unfetter(window,'scroll', [c, function(){ (new cc.ScrollPositionMaster()).userCancel(); }], true); };
    adr.ScrollPositionMaster.prototype.userCancel = function(){
        if(!this.justdone){
            if(this.anim.animating){ 
                this.anim.pause(); 
                this.anim.clear(); 
                this.userCancelAbort(); }
        } else { return true; }};
    adr.ScrollPositionMaster.prototype.createScrollHider = function(){
        var ut = __imns('util.tools'),
            ud = __imns('util.dom'),
            uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var c = this;
        if(this.scrollCheckElement === null){
            ut.fetter(document, 'DOMContentLoaded', [c, function(){
                var el = null;
                if('createElement' in document && 'appendChild' in document.body){
                    el = document.createElement('div');
                    ud.setAttribute(el, 'id', 'spm_scrollcheckelement');
                    ud.setAttribute(el, 'style', 'visibility:hidden !important;position:absolute;top:0;left:0;z-index:10000000;');
                    document.body.appendChild(el);
                } else {
                    el = "<div id=\"spm_scrollcheckelement\" style=\"visibility:hidden !important;position:absolute;top:0;left:0;z-index:10000000;\"></div>";
                    if('body' in document && 'innerHTML' in document.body){ document.body.innerHTML += el; }
                    el = ud.findElementByID('spm_scrollcheckelement'); }
                (new cc.ScrollPositionMaster()).scrollCheckElement = (el !== undefined && uv.isHTMLElement(el)) ? el : null;
                (new cc.ScrollPositionMaster()).possible = ((new cc.ScrollPositionMaster().scrollCheckElement) !== null) ? true : false;
            }], true, 'after'); }};
    adr.ScrollPositionMaster.prototype.animateTo = function(dest, axis){
        var uc = __imns('util.classes'),
            cc = __imns('component.classes'),
            ud = __imns('util.dom');
        if(this.anim !== null){ this.anim.pause(); this.anim.clear(); }
        this.anim = new uc.Animation(this.default_anim_props);
        this.anim.element = this.scrollCheckElement;
        this.anim.element.style['top'] = (new uc.ScreenProperties()).offsetY() + 'px';
        this.anim.element.style['left'] = (new uc.ScreenProperties()).offsetX() + 'px';
        this.anim.forceJSAnimation = true;
        this.userCancelAbort();
        this.userCancelInit();
        this.anim.addEndFunction(function(){
            (new cc.ScrollPositionMaster()).userCancelAbort();
        });
        if(!(dest instanceof uc.Coordinates) && !isNaN(Number(dest))){ dest = new uc.Coordinates(dest, dest); }
        axis = (axis === 'x' || axis === 'y' || axis === 'both') ? axis : 'y';
        if(axis === 'y' || axis === 'both'){
            this.anim.addProperty({
                'name' : 'custom_scroll_y', 
                'start' : (new uc.ScreenProperties()).offsetY(), 
                'end' : dest.y, 
                'custom' : {
                    'get' : function(e){ 
                        var cc = __imns('component.classes'),
                            ud = __imns('util.dom');
                        var elem = (new cc.ScrollPositionMaster()).scrollCheckElement;
                        return ud.findElementStyle(elem, 'top');
                    }, 
                    'set' : function(e, v){ 
                        var cc = __imns('component.classes'),
                            ud = __imns('util.dom');
                        var n = new cc.ScrollPositionMaster();
                        var elem = n.scrollCheckElement;
                        elem.style['top'] = v;
                        n.justdone = true;
                        window.scroll(Math.round(parseFloat(ud.findElementStyle(elem, 'left'))), Math.round(parseFloat(v)));
                        if(n.timeout_id !== null){ clearTimeout(n.timeout_id); n.timeout_id = null; }
                        n.timeout_id = setTimeout(function(){ 
                            (new cc.ScrollPositionMaster()).justdone = false;
                            n.timeout_id = null; }, n.timeout_ms); }}
            }); }
        if(axis === 'x' || axis === 'both'){
            this.anim.addProperty({
                'name' : 'custom_scroll_x', 
                'start' : (new uc.ScreenProperties()).offsetX(), 
                'end' : dest.x, 
                'custom' : {
                    'get' : function(e){ 
                        var cc = __imns('component.classes'),
                            ud = __imns('util.dom');
                        var elem = (new cc.ScrollPositionMaster()).scrollCheckElement;
                        return ud.findElementStyle(elem, 'left');
                    }, 
                    'set' : function(e, v){ 
                        var cc = __imns('component.classes'),
                            ud = __imns('util.dom');
                        var n = new cc.ScrollPositionMaster();
                        n.scrollCheckElement.style['left'] = v;
                        var elem = n.scrollCheckElement;
                        n.justdone = true;
                        window.scroll(parseInt(v), parseInt(ud.findElementStyle(elem, 'top')));
                        if(n.timeout_id !== null){ clearTimeout(n.timeout_id); n.timeout_id = null; }
                        n.timeout_id = setTimeout(function(){ 
                            (new cc.ScrollPositionMaster()).justdone = false;
                            n.timeout_id = null; }, n.timeout_ms);
                    }
                }
            }); }
        this.anim.run();
        return true;
    };
    adr.ScrollPositionMaster.prototype.scrollToElement = function(elem, axis){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var n = new cc.ScrollPositional({'elements': elem});
            if(axis !== undefined){ n.setAxis(axis); }
            n.goto(elem); }};
    adr.ScrollPosition = function(elem){
        this.element = null;
        this.coordinates = null;
        this.id = '';
        if(elem !== undefined){ this.init(elem); }};
    adr.ScrollPosition.prototype.init = function(elem){ this.setElement(elem); };
    adr.ScrollPosition.prototype.setElement = function(elem){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(elem !== undefined && uv.isHTMLElement(elem) && ut.inVisibleDOM(elem)){
            this.element = elem;
            this.coordinates = new uc.BoundaryCoordinates(this.element);
            this.id = ut.getAttribute(this.element, 'id'); 
            return true; }
        return false; };
    adr.ScrollPositional = function(o){
        var cc = __imns('component.classes');
        this.master = new cc.ScrollPositionMaster();
        this.enabled = false;
        this._functional = null;
        this.positions = [];
        this.axis = 'y'; 
        if(o !== undefined){ this.init(o); }};
    adr.ScrollPositional.prototype.init = function(o){
        if('elements' in o){ this.addElements(o.elements); }
        if('functional' in o){ this.setFunctional(o.functional); }};
    adr.ScrollPositional.prototype.isFunctional = function(){ return (this._functional !== null && typeof this._functional === 'function')? this._functional() : true; };
    adr.ScrollPositional.prototype.setFunctional = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._functional = f;
            return true; }
        return false; };
    adr.ScrollPositional.prototype.setAxis = function(a){
        if(typeof a === 'string'){
            a = a.toLowerCase();
            switch(a){
                case 'x':
                /*falls through*/
                case 'horizontal':
                    this.axis = 'x';
                    break;
                case 'both':
                    this.axis = 'both';
                    break;
                case 'y':
                /*falls through*/
                case 'vertical':
                /*falls through*/
                default:
                    this.axis = 'y'; }
        } else {
            this.axis = 'y';
        }
        return this.axis; };
    adr.ScrollPositional.prototype.addElement = function(arr){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var sp, starting = this.positions.length;
        arr = (!uv.isArray(arr)) ? [arr] : arr;
        for(var i=0, imax = arr.length; i<imax; i+=1){
            if(arr[i] !== undefined && uv.isHTMLElement(arr[i])){
                sp = new cc.ScrollPosition();
                if(sp.setElement(arr[i])){ this.positions.push(sp); }}}
        if(this.positions.length > 0){
            this.enabled = true;
            return (this.positions.length > starting) ? true : false; //this checks if has added any, not full passed;
        }
        return false; };
    adr.ScrollPositional.prototype.addElements = adr.ScrollPositional.prototype.addElement; //pseudonym for addElement

    //pass element, returns i in this.positions[i] or -1 if not exists;
    adr.ScrollPositional.prototype.findPositionByElement = function(elem){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        if(elem !== undefined && uv.isHTMLElement(elem) && ut.inVisibleDOM(elem)){
            for(var i=0, imax = this.positions.length; i<imax; i += 1){
                if(this.positions[i].element === elem){ return this.positions[i]; }}}
        return -1; };
    //pass id string, returns i in this.positions[i] or -1 if not exists;
    adr.ScrollPositional.prototype.findPositionById = function(id){
        if(id !== undefined && typeof id === 'string' && id.length > 0){
            for(var i=0, imax = this.positions.length; i<imax; i += 1){
                if(this.positions[i].id === id){ return this.positions[i]; }}}
        return -1; };
    //pass i returns this.positions[i] if i, and this.positions[i] instanceof ScrollPosition, or -1 if not;
    adr.ScrollPositional.prototype.findPositionByIndex = function(n){
        var cc = __imns('component.classes');
        n = Number(n);
        return (!isNaN(n) && n > -1 && parseInt(n) === n && n < this.positions.length && this.positions[n] instanceof cc.ScrollPosition) ? this.positions[n] : -1; };
    //returns correct ScrollPosition for o or -1 if invalid; 
    adr.ScrollPositional.prototype.findPositional = function(o){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(!(o instanceof cc.ScrollPosition)){
            var check = o;
            o = (check !== undefined && uv.isHTMLElement(check)) ? this.findPositionByElement(check) : -1;
            o = (o === -1) ? this.findPositionByIndex(check) : o;
            o = (o === -1) ? this.findPositionById(check) : o;
            if(o === -1){ return -1; } //else carries on;
        } else {
            var f = false;
            for(var i = 0, imax = this.positions.length; i<imax; i+=1){
                if(o === this.positions[i]){ o = this.positions[i]; f = true; break; }}
            if(!f){ return -1; }}
        return (o instanceof cc.ScrollPosition) ? o : -1; };
    adr.ScrollPositional.prototype.whichIndex = function(){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var o, y = (new uc.ScreenProperties()).offsetY(), last = -1, y1;
        for(var i=0, imax = this.positions.length; i<imax; i+=1){
            o = this.positions[i];
            if(o.element !== undefined && uv.isHTMLElement(o.element) && ut.inVisibleDOM(o.element)){
                var b = new uc.BoundaryCoordinates(o.element);
                if(b.isOver((new uc.ScreenProperties()).offsetX(), (new uc.ScreenProperties()).offsetY())){ return i; }}}
        return last; };
    adr.ScrollPositional.prototype.whichPosition = function(){
        var o = this.whichIndex();
        return (o !== -1) ? this.positions[o] : -1; };
    //Significant, returns empty string if id is undefined on ScrollPosition/element
    adr.ScrollPositional.prototype.whichId = function(){
        var o = this.whichIndex();
        return (o !== -1 && this.positions[o].id !== '') ? this.positions[o].id : ''; };
    //Significant, returns null if element is undefined on ScrollPosition, shouldn't ever happen
    adr.ScrollPositional.prototype.whichElement = function(){
        var o = this.whichIndex();
        return (o !== -1) ? this.positions[o].element : null; };
    adr.ScrollPositional.prototype.goto = function(o){
        var uc = __imns('util.classes');
        if(this.enabled && this.isFunctional()){
            o = this.findPositional(o);
            var n = this.whichPosition();
            if(o !== n && o !== -1){
                //var newY = o.coordinates.getY1();
                var d = new uc.Coordinates(o.coordinates.getX1(), o.coordinates.getY1());
                return this.master.animateTo(d, this.axis); }}
        return false; };


}
