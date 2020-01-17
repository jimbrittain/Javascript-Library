"use strict";
/* jshint -W044 */
/* global window, IMDebugger, $, __imns, console */
(function(){
    var adr = __imns('util.classes');
    var uv = __imns('util.validation');
    // var adr = window; //for stand-alone delete above and uncomment this line
    if(!('UrlValidator' in adr)){
        adr.UrlValidator = function(v, allowRelative, allowDirectory){
            var uc = __imns('util.classes'),
                uv = __imns('util.validation');
            if(typeof v !== 'string'){ return false; }
            allowRelative = (allowRelative !== undefined && allowRelative === true) ? true : false;
            allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
            return (allowRelative && uc.UrlValidator.prototype.isRelativeUrl(v, allowDirectory)) ? true : uc.UrlValidator.prototype.isAbsoluteUrl(v, allowDirectory); };
        adr.UrlValidator.prototype.isRelativeUrl = function(v, allowDirectory){ allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true; };
        adr.UrlValidator.prototype.isLocalUrl = function(v){
            var uc = __imns('util.classes'),
                uv = __imns('util.validation');
            if(uv.isUrl(v)){
                if(uc.UrlValidator.prototype.isRelativeUrl(v)){
                    return true;
                } else {
                    console.log('is here Jim!');
                    var currentLocation = window.location,
                        reg = new RegExp(this.withFullDomain('^')),
                        res = reg.exec(currentLocation),
                        res1 = reg.exec(v);
                    console.log(res);
                    console.log(res1);
                    if(res && res1 && (res[2] === res1[2])){
                        return true;
                    }
                }
            }
            return false;
        };
        adr.UrlValidator.prototype.withFullDomain = function(r){ return this.withDomainExtReg(this.withProtocolExtReg(r)); };
        adr.UrlValidator.prototype.withProtocolExtReg = function(r){ return (r + '(http\:\/\/|https\:\/\/)'); };
        adr.UrlValidator.prototype.withDomainExtReg = function(r){ return (r + '((([0-9]{1,3}\.){3,5}[0-9]{1,3})|(([A-Za-z0-9\_\-]{1,63}\.)+([A-Za-z0-9\-\_]{1,63})))'); };
        adr.UrlValidator.prototype.withDirectoryReg = function(r){ return (r + '([a-zA-Z0-9\-\_\%\.]+(\/){0,1})*'); };
        adr.UrlValidator.prototype.withFileReg = function(r){ return (r + '([a-zA-Z0-9\-\_\%\#\?\&\.\=]+)'); };
        adr.UrlValidator.prototype.isRelativeUrl = function(v, allowDirectory){ 
            if(typeof v !== 'string' || v.length < 1){ return false; }
            allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
            var reg = '^';
            reg = this.withDirectoryReg(reg);
            reg = (!allowDirectory) ? '(' + this.withFileReg(reg) + ')+$' : this.withFileReg(reg + '(') + '){0,1}' + '$';
            reg = new RegExp(reg);
            return reg.test(v); };
        adr.UrlValidator.prototype.isAbsoluteUrl = function(v, allowDirectory){
            if(typeof v !== 'string'){ return false; }
            allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
            var reg = '^';
            reg = this.withProtocolExtReg(reg);
            reg = this.withDomainExtReg(reg);
            reg = this.withDirectoryReg(reg);
            reg = (!allowDirectory) ? '(' + this.withFileReg(reg) + ')+$' : this.withFileReg(reg + '(') + '){0,1}' + '$';
            reg = new RegExp(reg);
            return reg.test(v); };

       uv.isLocalUrl = function(u){
           var uc = __imns('util.classes');
           return uc.UrlValidator.prototype.isLocalUrl(u);
       };
       uv.isUrl = function(u,v,w){
           var uc = __imns('util.classes');
           return (new uc.UrlValidator(u,v,w)); };
    }
})();
