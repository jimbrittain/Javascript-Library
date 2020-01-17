"use strict";
/* global window, console, document, __imns, $ */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ExternalRelHandle' in adr)){


    /**
     * jq.ExternalRelHandle.js
     * Requires jQuery
     * rel="external" handler for anchor linkages, to use either pop-ups/alt. tabs
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2013
     * @version - 0.2
     */
    adr.ExternalWindowProfile = function(classname, options, windowname){
        this.classname = (classname !== undefined) ? classname : "";
        this.options = (options !== undefined) ? options : "";
        this.windowname = (windowname !== undefined) ? windowname : ""; };
    adr.ExternalWindowProfiles = function(){
        var uc = __imns('util.classes');
        if(uc.ExternalWindowProfiles.prototype.singletonInstance){ return uc.ExternalWindowProfiles.prototype.singletonInstance; }
        uc.ExternalWindowProfiles.prototype.singletonInstance = this;
        this.list = []; };
    adr.ExternalWindowProfiles.prototype.returnSettings = function(class_arr){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation');
        if(!uv.isArray(class_arr)){ class_arr = (typeof class_arr === "string") ? class_arr.split(' ') : []; }
        var theProfile = null;
        var i = 0;
        while(i < this.list.length && theProfile === null){
            for(var j=0, max = class_arr.length; j < max; j += 1){
                if(this.list[i].classname === class_arr[j]){
                    theProfile = this.list[i];
                    break; }}
            i += 1; }
        theProfile = (theProfile === null) ? new uc.ExternalWindowProfile() : theProfile;
        return theProfile; };
    adr.ExternalWindowProfiles.prototype.addProfile = function(p){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        if(p instanceof uc.ExternalWindowProfile){
            var existingProfile = false;
            for(var i=0, max = this.list.length; i < max; i += 1){
                if(this.list[i].classname === p.classname){
                    existingProfile = true;
                    break; }}
            if(!existingProfile){
                this.list.push(p);
                return true;
            } else { return false; }
        } else {
            (new udb.IMDebugger()).pass("ExternalRefHandle.addProfile: Requires ExternalRefProfile.");
            return false; }};
    adr.ExternalRelHandle = function(){
        var uc = __imns('util.classes');
        if(uc.ExternalRelHandle.prototype.singleton){ return uc.ExternalRelHandle.prototype.singleton; }
        uc.ExternalRelHandle.prototype.singleton= this;
        this.windowsAllowed = (window.open && typeof window.open === 'function') ? true : false;
        this.firstUse = true;
        this.ext_window_reference = null;
        this.profiles = new uc.ExternalWindowProfiles();
        this.processedElements = []; 
        this.buildInit(); };
    adr.ExternalRelHandle.prototype.buildInit = function(){
        var ut = __imns('util.tools');
        var c = this;
        ut.fetter(window, 'DOMContentLoaded', [c, function(){ c.init(); }], true, 'both');
    };
    adr.ExternalRelHandle.prototype.elementProcessed = function(elem){
        var exists = false;
        for(var i=0, max = this.processedElements.length; i < max; i += 1){
            if(this.processedElements[i] === elem){
                exists = true;
                return true; }}
        return exists; };
    adr.ExternalRelHandle.prototype.init = function(){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools');
        if (this.windowsAllowed) {
            var elems = ud.findElementsBySelector('a[rel~="external"]'),
                c = this;
            for(var i=0, imax=elems.length; i<imax; i+=1){
                var elem = elems[i];
                if(!this.elementProcessed(elem)){
                    this.processedElements.push(elem);
                    ut.fetter(elem, 'click touchdown', ['externalRel', this.handleClick() ], true, 'done'); }}
            return true;
        } else {
            this.createTargets();
            return false; }};
    adr.ExternalRelHandle.prototype.handleClick = function(){
        return function(e){
            var ut = __imns('util.tools'),
                uc = __imns('util.classes'),
                uv = __imns('util.validation'),
                ud = __imns('util.dom');
            var elem = ut.findEventElement(e),
                good = true,
                erh = new uc.ExternalRelHandle();
            if(uv.isHTMLElement(elem)){
                var targetUrl = ud.getAttribute(elem, 'href');
                var profileName = ud.getAttribute(elem, 'class');
                var theProfile = erh.profiles.returnSettings(profileName);
                good = erh.openWindow(targetUrl, theProfile.options, theProfile.windowName);
            } else { good = true; }
            if (!good) {
                ut.preventEvent(e);
                return false; 
            }
            return true; };
    };
    adr.ExternalRelHandle.prototype.openWindow = function(url, opts, windowName){
        var theName = (windowName === '' || windowName === undefined) ? 'name' : windowName;
        var theOpts = (opts !== '') ? opts : '';
        if(this.windowsAllowed){
            if(this.ext_window_reference !== null){
                try { this.ext_window_reference.close(); } catch(e){}
            }
            this.ext_window_reference = window.open(url, theName, theOpts);
            if(this.firstUse){
                this.firstUse = false;
                try {
                    this.ext_window_reference.focus();
                } catch(e) {
                    this.windowsAllowed = false;
                    this.createTargets(); 
                    return true; }
            } else { this.ext_window_reference.focus(); }
            return false;
        } else { return true; }};
    adr.ExternalRelHandle.prototype.createTargets = function(){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools');
        var elems = ud.findElementsBySelector('a[rel="external"]');
        for(var i=0, imax=elems.length; i<imax; i+=1){
            ut.unfetter(elems[i], 'click touchdown', 'externalRel');
            ud.setAttribute('target', '_blank');
        }
        return true; };
    adr.externalrel = new adr.ExternalRelHandle();
}
