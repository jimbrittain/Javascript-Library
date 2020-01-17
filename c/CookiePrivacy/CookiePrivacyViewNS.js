"use strict";
/* global window, IMDebugger, $, __imns, document, console */
// var adr = window; //for stand-alone delete above and uncomment this line
var adr = __imns('component.classes');
if(!('CookiePrivacyView' in adr)){
    adr.CookiePrivacyView = function(obj) {
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if (cc.CookiePrivacyView.prototype.singleton !== undefined) {
            return cc.CookiePrivacyView.prototype.singleton;
        } else { cc.CookiePrivacyView.prototype.singleton = this; }

        this.message = '';
        this.codeStart = '<div id="' + (new cc.CookiePrivacy()).elementId + '"><p>';
        this.code = '';
        this.codeEnd = '</p><a id="closecookiemsg"><abbr title="Close this message">&#9746;</abbr></a></div>';
    };
    adr.CookiePrivacyView.prototype.view = function(){
        var cc = __imns('component.classes');
        if(this.code === ''){
            var str = this.codeStart;
            str += (this.message !== '') ? this.message : 'This site uses cookies to give you a better experience for details please see our ';
            str += '<a href="' + (new cc.CookiePrivacy()).policyUrl + '">Cookie &amp; Privacy Policy</a>';
            str += this.codeEnd;
            return str;
        } else { return this.code; }};
    adr.CookiePrivacyView.prototype.setCode = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            this.code = str;
            return true;
        } else { return false; }};
    adr.CookiePrivacyView.prototype.setCodeStart = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            this.codeStart = str;
            return true;
        } else { return false; }};
    adr.CookiePrivacyView.prototype.setCodeEnd = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            this.codeEnd = str;
            return true;
        } else { return false; }};
    adr.CookiePrivacyView.prototype.setMessage = function(str){
        var uv = __imns('util.validation');
        if(uv.isString(str)){
            this.message = str;
            return true;
        } else { return false; }};
}
