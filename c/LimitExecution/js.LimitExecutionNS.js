"use strict";
/*global setTimeout, clearTimeout, Date, __imns */
var adr = __imns('util.classes');
var ut = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('LimitExecution' in adr)){


    adr.LimitExecution = function(){
        var uc = __imns('util.classes');
        if(uc.LimitExecution.prototype.singleton !== undefined){ return uc.LimitExecution.prototype.singleton; }
        uc.LimitExecution.prototype.singleton = this;
        this.functionList = [];
        return this; };
    adr.LimitExecution.prototype.fire = function(func, limiter){
        var uc = __imns('util.classes');
        var lef = this.findLEF(func);
        if(lef instanceof uc.LimitExecutionFunction){
            if(limiter !== lef.limit){ lef.limit = limiter; }
            lef.setFire();
        } else {
            lef = new uc.LimitExecutionFunction(func, limiter);
            if(lef !== null){
                this.functionList.push(lef);
                this.functionList[this.functionList.length - 1].setFire(); }}};
    adr.LimitExecution.prototype.end = function(func){
        var uc = __imns('util.classes');
        var lef = this.findLEF(func);
        if(lef instanceof uc.LimitExecutionFunction){
            lef.end();
            return true;
        } else { return false; }};
    adr.LimitExecution.prototype.findLEF = function(func){
        for(var i=0,imax=this.functionList.length; i<imax; i+=1){
            if(this.functionList[i].func === func){ return this.functionList[i]; }}
        return null; };

    adr.LimitExecutionFunction = function(func, limit){
        this.func = null;
        this.to = null;
        this.limit = null;
        this.minLimit = 0;
        this.et = null;
        return this.init(func, limit);};
    adr.LimitExecutionFunction.prototype.init = function(func, limit){
        var uv = __imns('util.validation');
        this.func = (uv.isFunction(func)) ? func : null;
        this.limit = this.setLimit(limit);
        return (this.func !== null) ? this : null; };
    adr.LimitExecutionFunction.prototype.setFire = function(){
        var tn = new Date().getTime();
        if((tn - this.limit) > this.et){
            this.func();
            this.et = tn;
        } else {
            if((tn + this.limit) > this.et){
                this.et = this.et + this.limit;
                var c = this;
                this.to = setTimeout(function(){ c.fire(); }, this.et-tn); }}};
    adr.LimitExecutionFunction.prototype.fire = function(){
        var ts = new Date().getTime();
        this.func();
        var tn = new Date().getTime();
        var ext = tn - ts;
        this.minLimit = (ext > this.minLimit) ? ext : this.minLimit; 
        this.setLimit(this.limit); };
    adr.LimitExecutionFunction.prototype.setLimit = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > 0){
            this.limit = (n < this.minLimit) ? this.minLimit : n; }};
    adr.LimitExecutionFunction.prototype.end = function(){
        if(this.to !== null){
            try { clearTimeout(this.to); } catch(e){}
            this.to = null;}};

    ut.limitExecution = function(func, limit){ 
        var uc = __imns('util.classes');
        return (new uc.LimitExecutionFunction(func, limit)); };


}
