"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('BigContent' in adr)){
    adr.BigContent = function(o){
        var cc = __imns('component.classes');
        if(cc.BigContent.prototype.singleton !== undefined){ 
            return (o !== undefined) ? cc.BigContent.prototype.singleton.init(o) : cc.BigContent.prototype.singleton; }
        cc.BigContent.prototype.singleton = this;
        this._destroy = null;
        this._setup = null;
        this.active = true;
        this.initiated = false;
        this.init(o); };
    adr.BigContent.prototype.init = function(o){
        if(this.initiated){ this.destroy(); }
        if(typeof o === 'object' && 'setup' in o && 'destroy' in o){
            this.setDestroy(o.destroy);
            this.setSetup(o.setup);
            this.setup(); } else { this._destroy = null; this._setup = null; }
        return this; };
    adr.BigContent.prototype.setDestroy = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._destroy = f; return true; }
        this._destroy = null;
        return false; };
    adr.BigContent.prototype.destroy = function(){ if(this._destroy !== null && typeof this._destroy === 'function'){ 
        this.initiated = false;
        return this._destroy(); }};
    adr.BigContent.prototype.setSetup = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._setup = f; return true; } 
        this._setup = null;
        return false; };
    adr.BigContent.prototype.setup = function(){
        if(this._setup !== null && typeof this._setup === 'function'){
            var d = this._setup();
            if(d !== false){ //gets thru if undefined;
                this.initiated = true;
                return true; }}
        return false; };

}
