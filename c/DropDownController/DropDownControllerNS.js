"use strict";
/* globals window, document, setTimeout, clearTimeout, setInterval, clearInterval, __imns, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('DropDownController' in adr)){


    /* 
     * DropDownController & DropDownController.min.js
     * @module DropDownController
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2014
     * @version - 0.2.5
     * @requires MouseRecorder, isHTMLElement, JQuery
     * Revisions
     * 		0.2.6 - Replace JQuery
     * 		0.2.5 - Rewrites
     * 		0.2.4 - Added a better canceller for open and close, so if it returns false, cancels the open and/or close;
     * 		0.2.3 - Adds an anywhereBut last second check to softOff;
     * 		0.2.2 - Removes document bind collisions;
     * 		0.2.1 - Removes the resetting of MouseRecorder x and y on SetClose, replaces console and error with IMDebugger implementation
     * 		0.2 - fixes TouchError, adds a none setting
     * Requires MouseRecorder, isHTMLElement, fetter, unfetter, findParent, findElementsBySelector, findEvent, findEventElement, 
     * To Call,
    */


    /*
     * @module DropDownController
     * @class DropDownController
     * @constructor
     * @property active {Boolean} - used to confirm activity
     * @property active_id {Integer} - last active id
     * @property active_ids {Array} - array of active ids
     * @property dropdown_arr {Array} - Array to collect DropDown Objects
     * @property useCodeOpen {Boolean} ?
     * @property mouserecoder MouseRecorder
     * @property mr_instance ?
     * @property mouseover_int {Integer || null} ?
     * @property determinant {HTMLElement} * 
     * @requires uc.MouseRecorder;
    */
    adr.DropDownController = function(args){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        this.id = 0;
        this.active = false;
        this.active_id = -1;
        this.active_ids = [];
        this.dropdown_arr = [];
        this.useCodeOpen = false;
        this.touched = false;
        this.mouserecorder = new uc.MouseRecorder();
        this.mr_instance = { 'jsObject' : this };
        this.mouseover_int = null;
        this.determinant = null;
        this.subElement = null;
        this.subElement_reference = null;
        this.outer = null;

        this.settings = {
            'on' : new cc.DropDownSet(), 
            'off' : new cc.DropDownSet() };

        this.ddtDeterminant = null;
        this.ddtOuter = null;
        this.ddtSubElement = null;
        this.ddtUIElement = null;

        this._close = null;
        this._functional = null;
        this._open = null;
        this._testOpen = null;
        this._twiceOpen = null;

        this.timing = { 
            'open' : {'time' : 500, 'min': 250 },
            'close' : {'time' : 3000, 'min' : 1000 },
            'on': 3000, 
            'forgiveness' : 3000 };
        this.delay_change = 0.3333333;

        if(args !== null && args !== undefined){
            var test = this.init(args);
            return (test) ? this : false; 
        }};

    /**
     * @method findDropDownId
     * @class DropDownController
     * @param o {DropDown|HTMLElement|id|Event}
     * @return id of DropDown in DropDownController.dropdown_arr, or -1 if not found
     * @requires imns.util.validation.isHTMLElement, imns.util.tools.findEventElement, imns.util.validation.isNumber
     */
    adr.DropDownController.prototype.findDropDownId = function(o){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var f = -1, i = 0, imax = 0;
        if('Event' in window && (o instanceof window.Event)){ o = ut.findEventElement(o); }
        if(o !== undefined && uv.isHTMLElement(o)){
            f = this.findDropDownIdFromChild(o);
        } else if(o instanceof cc.DropDown){
            for(i=0, imax = this.dropdown_arr.length; i<imax; i+=1){
                if(this.dropdown_arr[i] === o){ f = i; break; }}
        } else if(uv.isNumber(o)){
            if(Math.round(o) === o && o > -1 && o < this.dropdown_arr.length && this.dropdown_arr[o] !== undefined){ f = o; }}
        return f; };
    /**
     * @method findDropDownIdFromChild
     * @class DropDownController
     * @param elem {HTMLElement}
     * @return id, or -1 if not found
     */
    adr.DropDownController.prototype.findDropDownIdFromChild = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            udb = __imns('util.debug'),
            cc = __imns('component.classes');
        var f = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var breakParent = ud.findParent(this.determinant);
            while(!this.isMenu(elem) && elem !== -1){
                elem = (elem === breakParent || !uv.isHTMLElement(elem)) ? -1 : ud.findParent(elem); }
            return (elem !== -1) ? this.indexOf(elem) : -1;
        } else {
            (new udb.IMDebugger()).pass("DropDownController.findMenuItemId must be supplied a HTMLElement");
            return -1; }};
    adr.DropDownController.prototype.findMenuItemId = adr.DropDownController.prototype.findDropDownIdFromChild; //legacy support;
    adr.DropDownController.prototype.findDropDownIdFromDDElement = function(elem){
        var f = -1;
        for(var i = 0, imax = this.dropdown_arr.length; i < imax; i += 1){
            if(this.dropdown_arr[i].element === elem){ f = i; break; }}
        return f; };
    adr.DropDownController.prototype.indexOf = adr.DropDownController.prototype.findDropDownIdFromDDElement; //legacy support;
    adr.DropDownController.prototype.isDropDown = function(o){
        return (this.findDropDownId(o) === -1) ? false : true; };
    adr.DropDownController.prototype.findDropDown = function(o){
        var f = this.findDropDownId(o);
        return (f === -1) ? false : this.dropdown_arr[f]; };
    adr.DropDownController.prototype.isOpen = function(o){
        var dd = this.findDropDown(o);
        return (this.useCodeOpen) ? dd.state : this.testOpen(dd); };
    adr.DropDownController.prototype.isClosed = function(o){ return (this.isOpen(o)) ? false : true; };
    adr.DropDownController.prototype.whichIdsOpen = function(){
        var f = [];
        for(var i=0, imax = this.dropdown_arr.length; i < imax; i+=1){
            if(this.isOpen(this.dropdown_arr[i])){
                f.push(i); }}
        return f; };
    adr.DropDownController.prototype.theOpen = function(){
        var l = this.whichIdsOpen(), r = [];
        for(var i = 0, imax = l.length; i < imax; i += 1){
            r.push(this.dropdown_arr[l[i]]); }
        if(r.length === 1){
            return r[0];
        } else if(r.length > 1){
            return r;
        } else { return false; }};
    adr.DropDownController.prototype.areAnyOpen = function(){ return ((this.whichIdsOpen()).length > 0) ? true : false; };
    adr.DropDownController.prototype.isIndividual = function(){ return ((this.ddtDeterminant.findElements()).length === 1) ? true : false; };
    adr.DropDownController.prototype.isMenu = function(elem){
        var uv = __imns('util.validation');
        var f = false;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            for(var i = 0, imax = this.dropdown_arr.length; i<imax; i+=1){
                if(this.dropdown_arr[i].element === elem){ return true; }}}
        return false; };
    adr.DropDownController.prototype.closeOthers = function(o){
        var udb = __imns('util.debug');
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                for(var i=0, imax = this.dropdown_arr.length; i<imax; i+=1){
                    var t = this.dropdown_arr[i];
                    if(t !== dd){ this.close(t); }}
                return true;
            } else {
                (new udb.IMDebugger()).pass('DropDownController.closeOthers supplied an object/value that could not resolve to a DropDown.');
            }}
        return false; };
    adr.DropDownController.prototype.closeAll = function(){
        if(this.isFunctional()){
            for(var i = 0, imax = this.dropdown_arr.length; i<imax; i+=1){ this.close(this.dropdown_arr[i]); }
            return true;
        } else { return false; }};
    adr.DropDownController.prototype.getID = function(){
        var cd = __imns('component.data');
        if(this.id !== 0){ return this.id; }
        cd.ddc_master = ('ddc_master' in cd) ? cd.ddc_master + 1 : 1;
        this.id = cd.ddc_master;
        return this.id; };
    /*
     * @method DropdownController.init
     * @class DropdownController
     * @param obj {Object}
     *      expects { 
     *          element: HTMLElement, 
     *          container: HTMLElement, 
     *          outer (optional):HTMLElement, 
     *          open: function, 
     *          close: function, 
     *          testOpen: function,
     *          twiceOpen: function,
     *          functional: function,
     */
    adr.DropDownController.prototype.setFunctionalFunction = function(fun){
        this._functional = (fun !== undefined && typeof fun === 'function') ? fun : null;
        this.doesWork = (this._functional === null) ? true : false;
        return !(this.doesWork); };
    adr.DropDownController.prototype.setTestOpenFunction = function(fun){
        this._testOpen = (fun !== undefined && typeof fun === 'function') ? fun : null;
        this.useCodeOpen = (this._testOpen === null) ? true : false;
        return !(this.useCodeOpen); };
    adr.DropDownController.prototype.setOpenFunction = function(fun){ 
        this._open = (fun !== undefined && typeof fun === 'function') ? fun : null;
        return (this._open === fun); };
    adr.DropDownController.prototype.setDeterminant = function(d){
        var cc = __imns('component.classes');
        if(d !== null && d !== undefined){
            this.ddtDeterminant = new cc.DropDownTargetElement(d);
            this.determinant = this.ddtDeterminant.element_string;
            return this.ddtDeterminant.valid; }};
    adr.DropDownController.prototype.setSubElement = function(s){
        var cc = __imns('component.classes');
        if(s !== null && s !== undefined){
            this.ddtSubElement = new cc.DropDownTargetElement(s);
            this.subElement = this.ddtSubElement.element_string;
            this.subElement_reference = this.ddtSubElement.reference;
            return this.ddtSubElement.valid; }};
    adr.DropDownController.prototype.setOuter = function(o){
        var cc = __imns('component.classes');
        if(o !== null && o !== undefined){
            this.ddtOuter = new cc.DropDownTargetElement(o);
            var t = this.ddtOuter.returnElement(o);
            this.outer = (t.length > 0) ? t[0] : null; 
            return (this.outer === null) ? false : true; }};
    adr.DropDownController.prototype.setCloseFunction = function(fun){
        if(fun !== undefined && typeof fun === 'function'){ this._close = fun; }
        return (this._close === fun); };
    adr.DropDownController.prototype.setTwiceOpenFunction = function(fun){
        if(fun !== undefined && typeof fun === 'function'){ this._twiceOpen = fun; }
        return (this._twiceOpen = fun);  };

    adr.DropDownController.prototype.init = function(obj){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools'),
            udb = __imns('util.debug');
        var defaultArgs = {
            element : null,
            container: null,
            outer: null,
            open: null,
            close: null,
            testOpen: null,
            twiceOpen: null,
            functional: null,
            delay: null,
            closeDelay: null,
            openDelay: null,
            settings: 'null'
        };
        obj = ut.handlePassedArguments(obj, defaultArgs);
        if(this.setDeterminant(obj.element) && this.setSubElement(obj.container)){
            this.id = this.getID();
            this.setOuter(obj.outer);
            this.setOpenFunction(obj.open);
            this.setCloseFunction(obj.close);
            this.setTestOpenFunction(obj.testOpen);
            this.setTwiceOpenFunction(obj.twiceOpen);
            this.setFunctionalFunction(obj.functional);
            this.setDelayChange(obj.delay);
            this.setCloseDelay(obj.closeDelay);
            this.setOpenDelay(obj.openDelay);

            this.timing.open.time /= this.delay_change;
            this.timing.close.time /= this.delay_change;

            this.settings = { 'on' : null, 'off' : null };
            this.settings.on = new cc.DropDownSet();
            this.settings.off = new cc.DropDownSet();
            if('settings' in obj){
                if(typeof obj.settings === 'string'){
                    this.settings.on.set(obj.settings);
                    this.settings.off.set(obj.settings);
                } else if(typeof obj.settings === 'object'){
                    if('on' in obj.settings){ this.settings.on.set(obj.settings.on); }
                    if('off' in obj.settings){ this.settings.off.set(obj.settings.off); }}}
            var c = this;
            var fun = function(){ c.create(); };
            fun.bind(c);
            ut.fetter(document, 'DOMContentLoaded', [c, fun], true, 'both');
            return true;
        } else {
            (new udb.IMDebugger()).pass("Cannot initialise Drop Down: This breaks the Drop Down Functionality");
            return false; }};
    adr.DropDownController.prototype.create = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            cc = __imns('component.classes');
        var c = this;
        this.dropdown_arr = [];
        this.outer = this.ddtOuter.returnElement();
        var l = this.ddtDeterminant.returnElements();
        this.outer = (!(this.outer !== undefined && uv.isHTMLElement(this.outer))) ? ud.findParent(l[0]) : this.outer;
        for(var i=0, imax = l.length; i<imax; i+=1){
            var dd = new cc.DropDown({
                'element' : l[i], 
                'controller' : this, 
                'container' : this.ddtSubElement.returnElements(l[i])[0]
            });
            this.dropdown_arr.push(dd); }
        this.createControls(); };

    adr.DropDownController.prototype.createControls = function(){
        var elem = null, l = this.ddtDeterminant.returnElements(), c = this;
        for(var i=0, imax = l.length; i<imax; i+=1){
            elem = l[i];
            this.createIndividualControls(elem); }
        if(this.settings.on.isHover() || this.settings.off.isHover()){
            this.mouseover_int = setInterval(function(){ c.mouseOverError(); }, 1000);
            this.mouserecorder.setAlwaysRecord(); }};

    adr.DropDownController.prototype.clicked = function(evt){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var elem = (uv.isHTMLElement(evt)) ? evt : null;
        elem = (elem === null) ? ut.findEventElement(evt) : elem;
        if(uv.isHTMLElement(elem) && this.isFunctional()){
            if(this.isOpen(this.findDropDown(elem)) && this.isActive(this.findDropDownId(elem))){
                return this.twiceOpen(elem);
            } else {
                this.hardOn(elem);
                ut.preventEvent(elem);
                return false;
            }
        }
    };
    adr.DropDownController.prototype.idString = function(){ return '.dd' + this.id; };
    adr.DropDownController.prototype.createChildControls = function(elem){
        var ut = __imns('util.tools');
        var id_str = this.idString(), c = this;
        ut.fetter(elem, 'focusin mouseenter mouseover', [c, function(e){ c.touch(e); }], true, 'both');
        ut.fetter(elem, 'focusout mouseleave', [c, function(e){ c.numb(e); }], true, 'both'); };
    adr.DropDownController.prototype.hoveredOn = function(evt){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var elem = (uv.isHTMLElement(evt)) ? evt : null;
        elem = (elem === null) ? ut.findEventElement(evt) : elem;
        if(uv.isHTMLElement(elem) && this.isFunctional()){
            if(!this.isOpen(this.findDropDown(elem)) || this.isActive(this.findDropDownId(elem))){
                this.hardOn(this.findDropDown(elem));
            } else {
                this.softOn(elem);
            }}};
    adr.DropDownController.prototype.hoveredOff = function(evt){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var elem = (uv.isHTMLElement(evt)) ? evt : null;
        elem = (elem === null) ? ut.findEventElement(evt) : elem;
        if(uv.isHTMLElement(elem) && this.isFunctional()){
            this.softOn(this.findDropDown(elem)); }};

    adr.DropDownController.prototype.createIndividualControls = function(elem){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools');
        var id_str = this.idString(), c = this;
        ut.fetter(elem, 'focusin', [c, function(e){ c.hardOn(e); c.preventClose(e); }], false, 'both'); //does this work? why did you use +id_str?
        ut.fetter(elem, 'focusout', [c, function(e){ c.hardOff(e); }], false, 'both');
        if(this.settings.on.isClick()){ ut.fetter(elem, 'click touchend', [c, function(e){ c.clicked(e); c.preventClose(e); }], false, 'both'); }
        var elemChildren = ud.findElementsBySelector(elem, '*');
        for(var i=0, imax=elemChildren.length; i<imax; i+=1){ this.createChildControls(elemChildren[i]); }
        if(this.settings.on.isHover()){
            ut.fetter(elem, 'mouseenter mouseover', [c, function(e){ c.hoveredOn(e); }], true, 'both'); }
        if(this.settings.off.isHover()){
            ut.fetter(elem, 'mouseleave', [c, function(e){ c.hoveredOff(e); }], true, 'both'); }};

    adr.DropDownController.prototype.setOnTime = function(v){
        if(typeof v === 'number' && v > 0){
            this.timing.on = Math.round(v);
            return true;
        } else { return false; }};
    adr.DropDownController.prototype.setDelayChange = function(v){
        if(typeof v === 'number' && v > 0){
            if(v > 2){ v /= 100; }
            this.delay_change = v;
            return true; }
        return false; };
    adr.DropDownController.prototype.setDelay = function(ty, v){
        var r = this.formatDelay(v);
        ty = (ty !== 'open' && ty !== 'close') ? 'open' : ty;
        if(r !== false){
            this.timing[ty] = {'time' : r[0], 'min' : r[1] };
            return true;
        } else { return false; }};
    adr.DropDownController.prototype.setOpenDelay = function(v){ return this.setDelay('open', v); };
    adr.DropDownController.prototype.setCloseDelay = function(v){ return this.setDelay('close', v); };
    adr.DropDownController.prototype.formatDelay = function(v){
        var uv = __imns('util.validation');
        if(uv.isArray(v)){
            var a = [];
            var ad = 0;
            for(var i=0, imax = v.length; i < imax; i+=1){
                var o = v[i];
                if(typeof o === 'number' && o > 0){
                    a[ad] = o;
                    ad += 1;
                    if(ad > 1){ break; }}}
            if(ad === 2){
                return a;
            } else if(ad === 1){
                a[1] = a[0];
                return a; }
        } else if(typeof(v) === 'number' && v > 0){
            v = Math.round(v);
            return [v, v]; }
        return false; };
    adr.DropDownController.prototype.isFunctional = function(){
        if(typeof this._functional === 'function'){
            return (this._functional() === true) ? true : false;
        } else { return this.doesWork; }};
    adr.DropDownController.prototype.twiceOpen = function(o){
        if(this.isFunctional()){
            if(typeof this._twiceOpen === 'function'){
                var t = this._twiceOpen(o);
                return (t === true || t === undefined) ? true : false;
            } else { return true; }
        } else { return false; }};
    adr.DropDownController.prototype.testOpen = function(o){
        if(typeof this._testOpen === 'function'){
            var t = this._testOpen(o);
            if(t !== undefined){ return t; }}
        var dd = this.findDropDown(o);
        return (dd !== false) ? dd.state : false; };
    adr.DropDownController.prototype.open = function(o){
        var udb = __imns('util.debug');
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                var didOpen = dd.open();
                if(didOpen || didOpen === undefined){
                    this.setOpen(dd);
                    return true;
                } else { this.touch(dd); } //this may need reviewing;
            } else {
                (new udb.IMDebugger()).pass("DropDownController.open was supplied an incompatible object");
            }}
        return false; };
    adr.DropDownController.prototype.close = function(o){
        if(this.isFunctional()){
            if(o !== undefined){
                var dd = this.findDropDown(o);
                if(dd !== false){
                    var didClose = dd.close();
                    if(didClose || didClose === undefined){
                        this.setClose(dd);
                        return true;
                    } else {  this.numb(dd); } //this may need reviewing;
                } else {
                    var udb = __imns('util.debug');
                    (new udb.IMDebugger()).pass("DropDownController.close was supplied an incompatible object");
                }}
            } else { return this.closeAll(); }
        return false; };
    adr.DropDownController.prototype.setOpen = function(o){
        /* here Jim 1*/
        var ut = __imns('util.tools');
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                var dd_id = this.findDropDownId(dd);
                dd.cancelOpen();
                dd.cancelClose();
                dd.preventClose();
                if(this.areAnyOpen()){ 
                    this.closeOthers(dd); 
                }
                this.active = true;
                this.active_id = dd_id;
                this.addActiveId(dd_id);
                this.mouserecorder.setRecord(this.mr_instance);
                var c = this, id = dd_id, astr = '.anywherebuthere' + this.id;
                ut.unfetter(document, 'mousedown touchstart', [c, function(){ c.anywhereButOff(id); }]);
                if(this.settings.off.val !== "none"){ 
                    ut.fetter(document, 'mousedown touchstart', [c, function(){ c.anywhereButOff(id); }], true, 'both'); }
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.setOpen supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.anywhereButOff = function(id){ if(this.anywhereBut()){ this.hardOff(id); }};
    adr.DropDownController.prototype.setClose = function(o){
        var ut = __imns('util.tools');
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                var dd_id = this.findDropDownId(dd);
                this.removeActiveId(dd_id);
                if(!this.isActive()){ 
                    this.mouserecorder.endRecord(this.mr_instance);
                    var c = this, id = this.active_id;
                    ut.unfetter(document, 'mousedown touchstart', [c, function(){ c.anywhereButOff(id); }]);
                    this.active_id = -1;
                    this.active = false; }
                dd.touched = false;
                dd.cancelAll();
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.setClose supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.touch = function(o){
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                dd.cancelCatch();
                dd.cancelClose();
                var dd_id = this.findDropDownId(dd), needsPrevent = false;
                if(this.isActive() && this.isActive(dd_id)){
                    needsPrevent = true;
                    if(!this.isOpen(dd)){ dd.open(); }}
                if(this.settings.on.isClick() && this.areAnyOpen()){
                    var n = this.whichIdsOpen();
                    for(var i=0, imax = n.length; i<imax; i+=1){
                        var p = this.findDropDown(n[i]);
                        if(p !== false){ p.preventClose(); }}}
                if(!dd.touched || needsPrevent){ dd.preventClose(); }
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.touch supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.numb = function(o){
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                if(this.isActive() && dd.isOpen()){
                    dd.cancelOpen();
                    if(this.settings.off.isClick()){
                        var c = this, dd_id = this.findDropDownId(dd);
                        dd.cancelClose();
                        dd.setCatch(); }}
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.numb supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.allowClose = function(o){
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                dd.allowClose();
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.numb supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.preventClose = function(o){
        var ut = __imns('util.tools');
        if('Event' in window && o instanceof window.Event){ o = ut.findEventElement(o); }
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                dd.preventClose(); 
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.preventClose supplied an object/value that could not be resolved to a DropDown');
            }}
        return false; };
    adr.DropDownController.prototype.isOnlyActive = function(n){
        if(n === undefined){ return false; }
        n = this.findDropDownId(n);
        return (this.active_ids.length === 1 && this.active_ids[0] === n) ? true : false; };
    adr.DropDownController.prototype.isActive = function(n){ //if n not supplied generally checks for activity;
        if(n === undefined){
            return (this.active_ids.length > 0) ? true : false;
        } else {
            n = this.findDropDownId(n);
            if(typeof n === 'number' && n > -1){
                var f = false;
                for(var i = 0, imax = this.active_ids.length; i < imax; i += 1){
                    if(this.active_ids[i] === n){ f = true; break; }}
                return f;
            } else { return false; }
        }};
    adr.DropDownController.prototype.removeActiveId = function(n){
        var removed = false;
        for(var i = 0, imax = this.active_ids.length; i < imax; i += 1){
            if(this.active_ids[i] === n){
                this.active_ids.splice(i,1);
                removed = true;
                imax -= 1;
                i -= 1; }}
        return removed; };
    adr.DropDownController.prototype.addActiveId = function(n){
        var found = false;
        for(var i = 0, imax = this.active_ids.length; i < imax; i += 1){
            if(this.active_ids[i] === n){ found = true; break; }}
        if(!found){ this.active_ids.push(n); return true; }
        return false; };
    adr.DropDownController.prototype.rebuildActiveIds = function(){ this.active_ids = this.whichIdsOpen(); };
    adr.DropDownController.prototype.notOver = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var obj = this.ddtOuter.returnElement();
        obj = (obj.length === 1) ? obj[0] : ud.findParent((this.ddtDeterminant.returnElements())[0]);
        if(uv.isHTMLElement(obj)){
            return (this.mouserecorder.isOver(obj)) ? false : true;
        } else { return true; }};
    adr.DropDownController.prototype.anywhereBut = adr.DropDownController.prototype.notOver;
    adr.DropDownController.prototype.anywhereButTouch = adr.DropDownController.prototype.notOver; //now handled on MR;
    adr.DropDownController.prototype.mouseOverError = function(){
        if(this.notOver()){
            var currOpen = this.whichIdsOpen();
            for(var i=0, imax = currOpen.length; i<imax; i+=1){
                var t = currOpen[i], dd = this.findDropDown(t);
                if(this.isOpen(dd)){
                    return (this.close_int === null) ? true : false;
                } else { this.removeActiveId(t); }}
            return false;
        } else {
            var udb = __imns('util.debug');
            (new udb.IMDebugger()).pass('DropDownController.mouseOverError is wrong, as mouse/pointer is over'); }
        return false; };
    adr.DropDownController.prototype.calculateTime = function(whichTimeStr){
        switch(whichTimeStr){
            case 'open':
            case 'on':
                this.timing.open.time = (this.timing.open.time > this.timing.open.min) ? ((this.timing.open.time - this.timing.open.min) * this.delay_change) + this.timing.open.min : this.timing.open.time;
                return this.timing.open.time;
            case 'close':
            case 'out':
                this.timing.close.time = (this.timing.close.time > this.timing.close.min) ? ((this.timing.close.tim - this.timing.close.min) * this.delay_change) + this.timing.close.min : this.timing.close.time;
                return this.timing.close.time; }};
    adr.DropDownController.prototype.calculateOpenTime = function(){ return this.calculateTime('open'); };
    adr.DropDownController.prototype.calculateCloseTime = function(){ return this.calculateTime('close'); };
    adr.DropDownController.prototype.isStillOff = function(o){
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            if(dd !== false){
                if(!dd.prevent_close){
                    var result = false;
                    if(!dd.touched){
                        dd.touched = (this.mouserecorder.isOver(dd.element)) ? true : false; }
                    if(!dd.touched){
                        this.preventClose(dd);
                    } else { this.close(dd); }}
                var dd_id = this.findDropDownId(dd);
                if(this.isActive(dd_id) && !this.isOpen(dd)){ this.removeActiveId(dd_id); }
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.isStillOff passed an object/value that could not be resolved to a DropDown'); }}
        return false; };
    adr.DropDownController.prototype.stillOff = adr.DropDownController.prototype.isStillOff;
    adr.DropDownController.prototype.hardOff = function(){
        if(this.isFunctional()){
            this.touched = false;
            var l = this.whichIdsOpen(), t=null;
            if(l.length > 0 || this.areAnyOpen()){
                for(var i=0, imax = l.length; i<imax; i+=1){
                    t = this.findDropDown(l[i]);
                    if(t !== false){
                        t.touched = false;
                        t.cancelClose();
                        t.cancelPrevent();
                        this.close(t); }}
                this.closeAll();
                this.rebuildActiveIds(); }
            return true; }
        return false; };
    adr.DropDownController.prototype.hardOut = function(){ if(this.anywhereBut()){ this.hardOff(); } return true; };
    adr.DropDownController.prototype.softOff = function(){
        if(this.isFunctional()){
            this.touched = false;
            var l = this.whichIdsOpen(), t=null;
            if(l.length > 0 || this.areAnyOpen()){
                for(var i=0, imax = l.length; i<imax; i+=1){
                    t = this.findDropDown(l[i]);
                    if(t !== false){
                        if(!t.prevent_close && !this.touched && t.close_int === null){
                            t.cancelOpen();
                            t.setClose(); }}}}
            return true; }
        return false; };
    adr.DropDownController.prototype.softOut = function(){ if(this.anywhereBut()){ this.softOff(); } return true; };
    adr.DropDownController.prototype.hardOn = function(o){
        var ut = __imns('util.tools');
        if('Event' in window && o instanceof window.Event){ o = ut.findEventElement(o); }
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            this.touched = true;
            if(dd !== false){
                dd.touched = true;
                if(!this.isOpen(dd)){ this.open(dd); }
                return true;
            } else {
                var udb = __imns('util.debug');
                (new udb.IMDebugger()).pass('DropDownController.hardOn supplied an object/value that could not be resolved to a valid DropDown'); }}
        return false; };
    adr.DropDownController.prototype.softOn = function(o){
        if(this.isFunctional()){
            var dd = this.findDropDown(o);
            this.touched = true;
            if(dd !== false && !this.isOpen(dd) && dd.open_int === null){ dd.setOpen(); }
            return true; }
        return false; };
    adr.DropDown = function(args){
        this.state = 0;
        this.touched = false;
        this.controller = null;
        this.container = null;
        this.element = null;
        this.ui_element = null;
        this.prevent_close = false;
        this.prevent_int = null;
        this.catch_int = null;
        this.close_int = null;
        this.open_int = null;
        this._open = null;
        this._close = null;
        this.init(args); };
    adr.DropDown.prototype.init = function(args){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        this.controller = ('controller' in args && args.controller instanceof cc.DropDownController) ? args.controller : null;
        this.element = ('element' in args && uv.isHTMLElement(args.element)) ? args.element : null;
        this.container = ('container' in args && uv.isHTMLElement(args.container)) ? args.container : null;
        this.ui_element = ('ui_element' in args && uv.isHTMLElement(args.ui_element)) ? args.ui_element : null; };
    adr.DropDown.prototype.isOpen = function(){
        return (this.controller.useCodeOpen) ? this.state : this.controller.testOpen(this); };
    adr.DropDown.prototype.isClosed = function(){ return (this.isOpen()) ? false : true; };
    adr.DropDown.prototype.cancelAll = function(){
        this.cancelClose();
        this.cancelOpen();
        this.cancelCatch();
        this.cancelPrevent(); };
    adr.DropDown.prototype.setCatch = function(){
        this.cancelCatch();
        var c = this;
        this.cancel_int = setInterval(function(){
            c.controller.isStillOff(c);
        }, 250); //this could be a set time rather than buried;
        return true; };
    adr.DropDown.prototype.preventClose = function(){
        this.prevent_close = true;
        this.cancelPrevent();
        var c = this;
        this.prevent_int = setTimeout(function(){
            c.prevent_close = false;
            c.cancelPrevent();
        }, this.controller.timing.forgiveness); };
    adr.DropDown.prototype.cancelPrevent = function(){
        if(this.prevent_int !== null){
            clearTimeout(this.prevent_int);
            this.prevent_int = null; }
        return true; };
    adr.DropDown.prototype.allowClose = function(){
        this.prevent_close = false;
        this.cancelPrevent(); };
    adr.DropDown.prototype.closeOthers = function(){ return this.controller.closeOthers(this); };
    adr.DropDown.prototype.setClose = function(){
        this.cancelClose();
        var c = this;
        this.close_int = setTimeout(function(){
            if(c.controller.anywhereBut()){ c.controller.close(c); }
        }, this.controller.calculateCloseTime()); };
    adr.DropDown.prototype.cancelClose = function(){
        if(this.close_int !== null){
            clearTimeout(this.close_int);
            this.close_int = null; }
        return true; };
    adr.DropDown.prototype.cancelCatch = function(){
        if(this.cancel_int !== null){
            clearInterval(this.cancel_int);
            this.cancel_int = null; }
        return true; };
    adr.DropDown.prototype.setOpen = function(){
        this.cancelOpen();
        this.open_int = setTimeout(function(){
            this.controller.open(this);
        }, this.controller.calculateOpenTime()); };
    adr.DropDown.prototype.cancelOpen = function(){
        if(this.open_int !== null){
            clearTimeout(this.open_int);
            this.open_int = null; }
        return true; };
    adr.DropDown.prototype.open = function(){
        this.state = 1;
        return (typeof this._open === 'function') ? this._open(this) : this.controller._open(this); 
    };
    adr.DropDown.prototype.close = function(){
        this.state = 0;
        return (typeof this._close === 'function') ? this._close(this) : this.controller._close(this);
    };
    adr.DropDown.prototype.overideOpen = function(f){
        if(typeof f === 'function'){
            this._open = f;
            return true;
        } else {
            this._open = null;
            return false; }};
    adr.DropDown.prototype.overideClose = function(f){
        if(typeof f === 'function'){
            this._close = f;
            return true;
        } else {
            this._close = null;
            return false; }};
    adr.DropDownTargetElement = function(args){
        this.element_string = "";
        this.element = null;
        this.reference = null; // [null|relative|absolute]
        this.valid = false;
        this.init(args); };
    adr.DropDownTargetElement.prototype.init = function(args){
        var uv = __imns('util.validation');
        if(uv.isHTMLElement(args)){
            this.addElement(args);
        } else if(typeof args === 'string'){
            this.addElementString(args);
        } else if(typeof args === 'object' && args !== null){
            this.element_string = ('string' in args && typeof args.string === 'string') ? args.string : "";
            this.element = ('element' in args && args.element !== undefined && uv.isHTMLElement(args.element)) ? args.element : null;
            if(this.element === null && this.element_string === "" && 'element' in args && typeof args.element === 'string'){ this.addElementString(args.element); }
            this.reference = ('reference' in args && (args.reference === 'relative' || args.reference === 'absolute')) ? args.reference : null; 
            this.reference = (this.reference === null && 'ref' in args && (args.ref === 'relative' || args.ref === 'absolute')) ? args.ref : null; 
            this.valid = (this.element_string !== "" || this.element !== null) ? true : false;
        }};
    adr.DropDownTargetElement.prototype.addReference = function(ref){
        this.reference = (typeof ref === 'string' && (ref === 'relative' || ref === 'absolute')) ? ref : null;
        return (this.reference === ref) ? true : false; };
    adr.DropDownTargetElement.prototype.addElement = function(elem){
        var uv = __imns('util.validation');
        this.element = (elem !== undefined && uv.isHTMLElement(elem)) ? elem : null;
        if(this.element === elem){
            this.element_string = "";
            this.valid = true;
            return true;
        } else { return false; }};
    adr.DropDownTargetElement.prototype.addElementString = function(str){
        this.element_string = (typeof str === 'string') ? str : null;
        if(this.element_string === str){
            this.element = null;
            this.valid = true;
            return true;
        } else { return false; }};
    adr.DropDownTargetElement.prototype.returnElement = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            ut = __imns('util.tools');
        if(this.element_string !== null && typeof this.element_string === 'string'){
            var t = null;
            switch(this.reference){
                case "relative" :
                    t = (elem !== undefined) ? elem : null;
                    break;
                case "absolute" :
                    /*fall through*/
                default:
                    t = null;
                    break; }
            if(t !== null){
                return ud.findElementsBySelector(t, this.element_string);
            } else { 
                return ud.findElementsBySelector(this.element_string); }
        } else { 
            return (uv.isHTMLElement(this.element)) ? [this.element] : []; }};
    adr.DropDownTargetElement.prototype.returnElements = adr.DropDownTargetElement.prototype.returnElement;
    adr.DropDownSet = function(){ this.val = 'click'; };
    adr.DropDownSet.prototype.isClick = function(){ return (this.val === 'click' || this.val === 'both') ? true : false; };
    adr.DropDownSet.prototype.isHover = function(){ return (this.val === 'hover' || this.val === 'both') ? true : false; };
    adr.DropDownSet.prototype.set = function(v){
        v = v.toLowerCase();
        this.val = (v === 'hover' || v === 'click' || v === 'both' || v === 'none') ? v : this.val;
        return (this.val === v) ? true : false; };


}
