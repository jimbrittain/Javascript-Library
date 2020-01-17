"use strict";
/* global window, console, __imns */
var adr = __imns('util.debug');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('IMDebugger' in adr)){


    adr.IMDebugger = function(){
        var udb = __imns('util.debug');
        if(udb.IMDebugger.prototype.singleton !== undefined){ return udb.IMDebugger.prototype.singleton; }
        udb.IMDebugger.prototype.singleton = this;
        this.start = 0;
        this.init(); };
    adr.IMDebugger.prototype.init = function(){ this.start = new Date().getTime(); };
    adr.IMDebugger.prototype.timeFromInit = function(){ return (new Date().getTime() - this.start); };
    adr.IMDebugger.prototype.pass = function(statement){
        if(typeof statement === "string" || typeof statement === "number"){
            if(console){
                if('warn' in console){
                    console.warn(statement);
                } else if('log' in console){
                    console.log(statement);
                }
            } else { throw new Error(statement); }}};

}
