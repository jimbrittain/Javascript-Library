"use strict";
/* jshint -W044 */

function isUrl(v, allowRelative, allowDirectory){
    if(typeof v !== 'string'){ return false; }
    allowRelative = (allowRelative !== undefined && allowRelative === true) ? true : false;
    allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
    return (allowRelative && isUrl.prototype.isRelativeUrl(v, allowDirectory)) ? true : isUrl.prototype.isAbsoluteUrl(v, allowDirectory);
}
isUrl.prototype.isRelativeUrl = function(v, allowDirectory){
    allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
};
isUrl.prototype.withProtocolExtReg = function(r){
    return (r + '(http\:\/\/|https\:\/\/)');
};
isUrl.prototype.withDomainExtReg = function(r){
    return (r + '((([0-9]{1,3}\.){3,5}[0-9]{1,3})|(([A-Za-z0-9\_\-]{1,63}\.)+([A-Za-z0-9\-\_]{1,63})))');
};
isUrl.prototype.withDirectoryReg = function(r){
    return (r + '([a-zA-Z0-9\-\_\%\.]+(\/){0,1})*');
};
isUrl.prototype.withFileReg = function(r){
    return (r + '([a-zA-Z0-9\-\_\%\#\?\&\.\=]+)');
};
isUrl.prototype.isRelativeUrl = function(v, allowDirectory){
    if(typeof v !== 'string' || v.length < 1){ return false; }
    allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
    var reg = '^';
    reg = this.withDirectoryReg(reg);
    reg = (!allowDirectory) ? '(' + this.withFileReg(reg) + ')+$' : this.withFileReg(reg + '(') + '){0,1}' + '$';
    reg = new RegExp(reg);
    return reg.test(v);
};
isUrl.prototype.isAbsoluteUrl = function(v, allowDirectory){
    if(typeof v !== 'string'){ return false; }
    allowDirectory = (allowDirectory !== undefined && allowDirectory === false) ? false : true;
    var reg = '^';
    reg = this.withProtocolExtReg(reg);
    reg = this.withDomainExtReg(reg);
    reg = this.withDirectoryReg(reg);
    reg = (!allowDirectory) ? '(' + this.withFileReg(reg) + ')+$' : this.withFileReg(reg + '(') + '){0,1}' + '$';
    reg = new RegExp(reg);
    return reg.test(v);
};
