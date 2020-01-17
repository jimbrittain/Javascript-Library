"use strict";
/* global window, IMDebugger, $, __imns, */
var adr = __imns('util.classes'), ut = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ArgumentHandler' in adr)){
    adr.ArgumentHandler = function(){
        this.definer = null;
    };
    adr.ArgumentHandler.prototype.setDefiner = function(obj){
        if(obj !== undefined && typeof obj === 'object'){
            this.definer = obj;
            return true;
        } else { return false; }};
    adr.ArgumentHandler.prototype.compare = function(compareObj, defaultObj, deep){
        deep = (deep !== undefined && deep === true) ? true : false;
        var ut = __imns('util.tools');
        if(this.setDefiner(defaultObj)){
            var obj = ut.deepClone(this.definer);
            if(typeof compareObj === typeof obj){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop) && (prop in compareObj)){
                        obj[prop] = (deep) ? ut.deepClone(compareObj[prop]) : compareObj[prop]; }}}
            return obj; }
        return {}; };
    ut.handlePassedArguments = function(compareObj, defaultObj){ 
        var uc = __imns('util.classes');
        return (new uc.ArgumentHandler()).compare(compareObj, defaultObj); };
}
