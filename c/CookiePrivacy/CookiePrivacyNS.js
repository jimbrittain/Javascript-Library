"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CookiePrivacy' in adr)){
    adr.CookiePrivacy = function(obj){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(cc.CookiePrivacy.prototype.singleton !== undefined){
            return cc.CookiePrivacy.prototype.singleton;
        } else { cc.CookiePrivacy.prototype.singleton = this; }

        this.id = "cookiemsg";
        this.elementId = "cookiemsg";
        this.seen = false;
        this.built = false;
        this.policyUrl = '';
        this.viewObj = (new cc.CookiePrivacyView());
        if(typeof obj !== 'object'){
            if(uv.isString(obj)){
                obj = {'url': obj};
                this.init(obj); }
        } else { this.init(obj); }};
    adr.CookiePrivacy.prototype.init = function(obj){
        var ut = __imns('util.tools');
        if(typeof obj === 'object'){
            if('url' in obj){ this.setUrl(obj.url); }
            if('code' in obj){ this.setCode(obj.code); }
            if('codeEnd' in obj){ this.setCodeEnd(obj.codeEnd); }
            if('codeStart' in obj){ this.setCodeStart(obj.codeStart); }
            if('message' in obj){ this.setMessage(obj.message); }
            var c = this;
            ut.fetter(document, 'DOMContentLoaded', [this, function(){
                c.needs(); }], true, 'both');
            this.clean();
            return true;
        } else { return false; }
    };
    adr.CookiePrivacy.prototype.clean = function(){
        var cc = __imns('component.classes');
        try {
            cc.CookiePrivacy.prototype.setUrl = function(){};
            cc.CookiePrivacy.prototype.setCode = function(){};
            cc.CookiePrivacy.prototype.setCodeEnd = function(){};
            cc.CookiePrivacy.prototype.setCodeStart = function(){};
            cc.CookiePrivacy.prototype.message = function(){};
            cc.CookiePrivacy.prototype.init = function(){};
         } catch(e){}
    };
    adr.CookiePrivacy.prototype.setUrl = function(url){
        var uv = __imns('util.validation');
        if(uv.isUrl(url)){ 
            this.policyUrl = url; 
            return true;
        } else { return false; }};
    adr.CookiePrivacy.prototype.setCode = function(str) { 
        var cc = __imns('component.classes');
        return (new cc.CookiePrivacyView()).setCode(str); };
    adr.CookiePrivacy.prototype.setCodeStart = function(str) { 
        var cc = __imns('component.classes');
        return (new cc.CookiePrivacyView()).setCodeStart(str); };
    adr.CookiePrivacy.prototype.setCodeEnd = function(str) { 
        var cc = __imns('component.classes');
        return (new cc.CookiePrivacyView()).setCodeEnd(str); };
    adr.CookiePrivacy.prototype.setMessage = function(str) { 
        var cc = __imns('component.classes');
        return (new cc.CookiePrivacyView()).setMessage(str); };

    adr.CookiePrivacy.prototype.hasSeen = function(){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        var ci = new uc.CookieInterface(), co;
        if(ci.hasItem({name: 'cookiemsg'})){
            co = ci.findItem({name: 'cookiemsg'});
            var d = new Date().getTime() + (1000 * 60 * 60 * 24 * 365);
            d = new Date(d);
            co.setExpires(d);
        } else {
            co = new uc.CookieObject({
                name: 'cookiemsg',
                value: 1,
                expires: new Date().getTime() + (1000 * 60 * 10)});
            ci.addItem(co); }};

    adr.CookiePrivacy.prototype.buildMessage = function(){
        var cc = __imns('component.classes');
        return (new cc.CookiePrivacyView()).view(); };

    adr.CookiePrivacy.prototype.hide = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var elem = ud.findElementById(this.id);
        if(uv.isHTMLElement(elem)){
            ud.removeClass(elem, 'on');
            return false; }
        return true; };

    adr.CookiePrivacy.prototype.display = function(){
        var ud = __imns('util.dom'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var bodyTag = ud.findElementsByTag('body')[0];
        if(uv.isHTMLElement(bodyTag)){
            if('innerHTML' in bodyTag){ 
                if(!this.built){
                    bodyTag.innerHTML += this.buildMessage(); 
                    this.built = true;
                }
                var elem = ud.findElementById(this.id);
                ud.addClass(elem, 'on');
                var closeElem = ud.findElementById('closecookiemsg');
                var c = this;
                if(uv.isHTMLElement(closeElem)){ ut.fetter(closeElem, 'click', [closeElem, function(){ c.hide(); }], true); }
            }}};
    adr.CookiePrivacy.prototype.needs = function(){
        if(!this.hasSeen()){
            this.display();
        } else {
            var cc = __imns('component.classes');
            cc.CookiePrivacy.prototype.display = function(){}; }};
}
