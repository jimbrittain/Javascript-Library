"use strict";
/*global isNumber */
function PerfectCurve(start, dist, totalframes){
	this.totalFrames = 100; //should be private so can recalculate
	this.distance = 100; //should be private so can recalculate
	this.startPoint = 0; //should be private so can recalculate 
	this.init(start, dist, totalframes); }
PerfectCurve.prototype.init = function(start, dist, totalframes){
	this.startPoint = (isNumber(start)) ? start : 0;
	this.distance = (isNumber(dist)) ? dist : 0;
	this.totalFrames = (isNumber(totalframes)) ? Math.floor(totalframes) : 1; 
	this.angleProport = this.getAngleProportion(); };
PerfectCurve.prototype.getAngleProportion = function(){ return 90 / this.totalFrames; };
PerfectCurve.prototype.moveProportion = function(frame){
	if(isNumber(frame) && Math.round(frame) === frame){
		var angleOn = frame * this.angleProport;
		angleOn = (Math.PI/180 * angleOn);
		return this.startPoint + (this.distance * Math.sin(angleOn)); }};
