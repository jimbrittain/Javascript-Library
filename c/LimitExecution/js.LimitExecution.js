/*global isFunction, isNumber, setTimeout, clearTimeout, LimitExecutionFunction, Date */
"use strict";
function LimitExecution(){
    if(LimitExecution.prototype.singleton !== undefined){ return LimitExecution.prototype.singleton; }
    LimitExecution.prototype.singleton = this;
    this.functionList = [];
    return this;
}
LimitExecution.prototype.fire = function(func, limiter){
    var lef = this.findLEF(func);
    if(lef instanceof LimitExecutionFunction){
        if(limiter !== lef.limit){ lef.limit = limiter; }
        lef.setFire();
    } else {
        lef = new LimitExecutionFunction(func, limiter);
        if(lef !== null){
            this.functionList.push(lef);
            this.functionList[this.functionList.length - 1].setFire(); }}};
LimitExecution.prototype.end = function(func){
    var lef = this.findLEF(func);
    if(lef instanceof LimitExecutionFunction){
        lef.end();
        return true;
    } else { return false; }};
LimitExecution.prototype.findLEF = function(func){
    for(var i=0,imax=this.functionList.length; i<imax; i+=1){
        if(this.functionList[i].func === func){ return this.functionList[i]; }}
    return null; };

function LimitExecutionFunction(func, limit){
    this.func = null;
    this.to = null;
    this.limit = null;
    this.minLimit = 0;
    this.et = null;
    return this.init(func, limit);}
LimitExecutionFunction.prototype.init = function(func, limit){
    this.func = (isFunction(func)) ? func : null;
    this.limit = this.setLimit(limit);
    return (this.func !== null) ? this : null; };
LimitExecutionFunction.prototype.setFire = function(){
    var tn = new Date().getTime();
    if((tn - this.limit) > this.et){
        this.func();
        this.et = tn;
    } else {
        if((tn + this.limit) > this.et){
            this.et = this.et + this.limit;
            var c = this;
            this.to = setTimeout(function(){ c.fire(); }, this.et-tn); }}};
LimitExecutionFunction.prototype.fire = function(){
    var ts = new Date().getTime();
    this.func();
    var tn = new Date().getTime();
    var ext = tn - ts;
    this.minLimit = (ext > this.minLimit) ? ext : this.minLimit; 
    this.setLimit(this.limit); };
LimitExecutionFunction.prototype.setLimit = function(n){
    if(isNumber(n) && n > 0){
        this.limit = (n < this.minLimit) ? this.minLimit : n; }};
LimitExecutionFunction.prototype.end = function(){
    if(this.to !== null){
        try { clearTimeout(this.to); } catch(e){}
        this.to = null;}};