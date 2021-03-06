"use strict";
/* global __imns, console, window */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ScreenSettings' in adr)){


    /**
     * ScreenSettings.js
     * Javascript dependent on CSS Media
     * Requires IMDebugger, isArray
     * @module ScreenSettings
     * @class ScreenSettingTask
     * @constructor
     * @author Immature Dawn
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - JDB 2014
     * @version - 0.1
     * @requires isArray, IMDebugger
    * */

    /**
     * @module ScreenSettings
     * @submodule ScreenSettingTask
     * @class ScreenSettingTask
     * @constructor
     * @param {Object} o [optional]
     * 	{ 'create' function, 'activate' function, 'suspend' function}
     * @notes function should return a {Boolean} true or false, an undefined return is interpretted as true
     */
    adr.ScreenSettingTask = function(o){
        this.created = false;
        this.active = false;
        this._create = null;
        this._activate = null;
        this._suspend = null;
        this._remove = null;
        if(o !== undefined){ this.init(o); }};
    /**
     * @method ScreenSettingTask.init
     * @param {Object} o
     * 		{ 'create' function, 'activate' function, 'suspend' function }
     * @return {Boolean}
     */
    adr.ScreenSettingTask.prototype.init = function(o){
        if(typeof o === 'object' && 'create' in o && 'activate' in o && 'suspend' in o){
            this.addCreate(o.create);
            this.addActivate(o.activate);
            this.addSuspend(o.suspend);
            return true;
        } else { return false; }};
    /**
     * @method ScreenSettingTask.create
     * @return {Boolean}
     * @notes if ScreenSettingTask.created will not recreate, if create not defined returns false, if create function does not return boolean interpreted as return true
     */
    adr.ScreenSettingTask.prototype.create = function(){
        if(!this.created && this._create !== null && typeof this._create === 'function'){
            var r = this._create();
            r = (r === false) ? false : true;
            this.created = r;
            return r;
        } else { return false; }};
    /**
     * @method ScreenSettingTask.addCreate
     * @param {Function} f
     * @return {Boolean}
     * @notes adds/overwrites create function
     */
    adr.ScreenSettingTask.prototype.addCreate = function(f){
        if(f !== undefined && typeof f === "function" && !this.created){
            this._create = f;
            return true;
        } else { return false; }};
    adr.ScreenSettingTask.prototype.activate = function(){
        if(this.created && !this.active && this._activate !== null && typeof this._activate === 'function'){
            var r = this._activate();
            r = (r === false) ? false : true;
            this.active = r;
            return r;
        } else { return false; }};
    adr.ScreenSettingTask.prototype.addActivate = function(f){
        if(f !== undefined && typeof f === "function"){
            this._activate = f;
            return true;
        } else { return false; }};
    adr.ScreenSettingTask.prototype.suspend = function(){
        if(this.created && this.active && this._suspend !== null && typeof this._suspend === 'function'){
            var r = this._suspend();
            r = (r === false) ? false : true;
            this.active = !r;
            return r;
        } else { return false; }};
    adr.ScreenSettingTask.prototype.addSuspend = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._suspend = f;
            return true;
        } else { return false; }};
    adr.ScreenSettingsInstance = function(o){
        this.name = null;
        this.created = false;
        this.active = false;
        this.master = '';
        this._is = null;
        this._not = null;
        this.tasks = [];
        if(o !== undefined){ this.init(o); }};
    adr.ScreenSettingsInstance.prototype.init = function(o){
        this.master = new (__imns('util.classes')).ScreenSettings();
        if(typeof o === 'string'){
            this.name = o;
        } else if(typeof o === 'object'){
            if('name' in o){ this.name = o.name; }
            if('is' in o){ this.addIs(o.is); }
            if('not' in o){ this.addNot(o.not); }
        }};
    adr.ScreenSettingsInstance.prototype.addTask = function(o){
        var uc = __imns('util.classes');
        if(o instanceof uc.ScreenSettingTask){
            if(this.findTaskId(o) === -1){
                this.tasks.push(o);
                return true;
            }}
        return false; };
    adr.ScreenSettingsInstance.prototype.findTaskId = function(o){
        var f = -1;
        for(var i=0, imax = this.tasks.length; i<imax; i+=1){
            if(o === this.tasks[i]){ f = i; break; }}
        return f; };
    adr.ScreenSettingsInstance.prototype.findTask = function(o){
        var r = this.findTaskId(o);
        if(r !== -1){ 
            return this.tasks[r];
        } else { return undefined; }};
    adr.ScreenSettingsInstance.prototype.removeTask = function(o){
        var uc = __imns('util.classes');
        if(o instanceof uc.ScreenSettingTask){
            var r = this.findTaskId(o);
            if(r !== -1){
                this.tasks.splice(r,1);
                return true; }}
        return false; };
    adr.ScreenSettingsInstance.prototype.create = function(){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        if(!this.created){
            for(var i=0, imax = this.tasks.length; i<imax; i+=1){
                if(this.tasks[i] instanceof uc.ScreenSettingTask){
                    this.tasks[i].create();
                } else {
                    (new udb.IMDebugger()).pass('ScreenSettingsInstance has an improper ScreenSettingTask in its task');
                }}
            this.created = true;
            return true; 
        } else { return false; }};
    adr.ScreenSettingsInstance.prototype.suspend = function(){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        if(this.created && this.active){
            for(var i=0, imax = this.tasks.length; i<imax; i+=1){
                if(this.tasks[i] instanceof uc.ScreenSettingTask){
                    this.tasks[i].suspend();
                } else {
                    (new udb.IMDebugger()).pass('ScreenSettingsInstance has an improper ScreenSettingTask in its task');
                }}
            this.active = false;
            return true;
        } else { return false; }};
    adr.ScreenSettingsInstance.prototype.activate = function(){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        if(this.created && !this.active){
            for(var i=0, imax = this.tasks.length; i<imax; i+=1){
                if(this.tasks[i] instanceof uc.ScreenSettingTask){
                    this.tasks[i].activate();
                } else {
                    (new udb.IMDebugger()).pass('ScreenSettingsInstance has an improper ScreenSettingTask in its task');
                }}
            this.active = true;
            return true;
        } else { return false; }};
    adr.ScreenSettingsInstance.prototype.is = function(){
        if(this._is !== null && typeof this._is === "function"){
            return this._is();
        } else { return false; }};
    adr.ScreenSettingsInstance.prototype.not = function(){
        if(this._not !== null && typeof this._not === "function"){
            return this._not();
        } else { return true; }};
    adr.ScreenSettingsInstance.prototype.addIs = function(f){
        if(f !== undefined && typeof f === "function"){
            this._is = f;
            return true;
        } else { return false; }};
    adr.ScreenSettingsInstance.prototype.addNot = function(f){
        if(f !== undefined && typeof f === "function"){
            this._not = f;
            return true;
        } else { return false; }};
    adr.ScreenSettings = function(){
        var uc = __imns('util.classes');
        if(uc.ScreenSettings.prototype.singleton !== undefined){ return uc.ScreenSettings.prototype.singleton; }
        uc.ScreenSettings.prototype.singleton = this;
        this.settings = []; 
        this.init(); };
    adr.ScreenSettings.prototype.init = function(){
        var ut = __imns('util.tools');
        var c = this;
        this.addListener();
        ut.fetter(window, 'load', [c, function(){
            c.runSettings();
        }], 'both', true); };
    adr.ScreenSettings.prototype.runSettings = function(){
        var o = "";
        for(var i = 0, imax = this.settings.length; i < imax; i += 1){
            o = this.settings[i];
            if(o.is()){
                if(!o.created){ o.create(); }
                o.activate();
            } else { if(o.created){ o.suspend(); }}}
        return true; };
    adr.ScreenSettings.prototype.addSettings = function(n, sst){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes');
        var name = (typeof n === "string") ? n : (('name' in n) ? n.name : "");
        var o = this.findSettings(name), r = "";
        o = (o !== undefined) ? o : this.addNewSetting((typeof n === 'string') ? name : n);
        if(uv.isArray(sst)){
            for(var i=0, imax = sst.length; i<imax; i+=1){
                r = sst[i];
                if(r instanceof uc.ScreenSettingTask){
                    o.addTask(r); }}
        } else {
            if(sst instanceof uc.ScreenSettingTask){ o.addTask(sst); }}};
    adr.ScreenSettings.prototype.addNewSetting = function(name){
        var uc = __imns('util.classes');
        this.settings.push(new uc.ScreenSettingsInstance(name));
        return this.settings[this.settings.length - 1]; };
    adr.ScreenSettings.prototype.findSettingsId = function(n){
        var f = -1;
        for(var i=0, imax = this.settings.length; i<imax; i+=1){
            if(this.settings[i].name === n){ f = i; break; }}
        return f; };
    adr.ScreenSettings.prototype.findSettings = function(n){
        var s = this.findSettingsId(n);
        if(s !== -1){
            return this.settings[s];
        } else { return undefined; }};
    adr.ScreenSettings.prototype.addListener = function(){
        var ut = __imns('util.tools');
        var c = this;
        //ut.fetter(window, 'resize', [c, function(){ ut.debounce(function(){ c.runSettings(); }, 25); }], true);
        ut.fetter(window, 'resize', [c, function(){ c.runSettings(); }], true);
    };
    /*
    ScreenSettings.prototype.isDesktop = function(){
        return (findElementStyle(findElementsByTag('body')[0], 'background-image') !== 'none') ? true : false; };
    ScreenSettings.prototype.isStandard = ScreenSettings.prototype.isDesktop; //alias;
    ScreenSettings.prototype.isMobile = function(){
        return (findElementStyle(findElementByID('header'), 'position') == "static") ? true : false; };
    ScreenSettings.prototype.isMedium = function(){
        
    }*/
    // object activate, suspend, create, delete, is, isn't;


}
