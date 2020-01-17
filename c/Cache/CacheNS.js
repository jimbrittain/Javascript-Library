"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Cache' in adr)){
    adr.Cache = function(){ 
        this.store = '';
        this.init(); };
    adr.Cache.prototype.init = function(){
        if(typeof this.store !== 'object'){ this.store = {}; }};
    adr.Cache.prototype.exists = function(storeref){ return (storeref in this.store && this.store[storeref] !== undefined); };
    adr.Cache.prototype.get = function(storeref){
        if(this.exists(storeref)){
            var ut = __imns('util.tools');
            return ut.cloneExcludeHost(this.store[storeref], true);
            //return ut.deepClone(this.store[storeref]);
        } else { return undefined; }};
    adr.Cache.prototype.update = function(storeref, val){ 
        var ut = __imns('util.tools');
        val = ut.cloneExcludeHost(val, true);
        this.store[storeref] = val; };
    adr.Cache.prototype.create = adr.Cache.prototype.update;
    adr.Cache.prototype.add = adr.Cache.prototype.update;
    adr.Cache.prototype.destroy = function(storeref){
        if(this.exists(storeref)){
            this.store[storeref] = undefined;
            return true;
        } else { return false; }};
    adr.Cache.prototype.remove = adr.Cache.prototype.destroy;

}
