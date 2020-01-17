"use strict";
/* global window, console */
function IMDebugger(){
	if(IMDebugger.prototype.singleton !== undefined){ return IMDebugger.prototype.singleton; }
	IMDebugger.prototype.singleton = this;
	this.start = 0;
	this.init(); }
IMDebugger.prototype.init = function(){ this.start = new Date().getTime(); };
IMDebugger.prototype.timeFromInit = function(){ return (new Date().getTime() - this.start); };
IMDebugger.prototype.pass = function(statement){
	if(typeof statement === "string" || typeof statement === "number"){
		if(console){
			if('warn' in console){
				console.warn(statement);
			} else if('log' in console){
				console.log(statement);
			}
		} else { throw new Error(statement); }}};