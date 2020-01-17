"use strict";
/*global __imns */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('PerfectCurve' in adr)){


    adr.PerfectCurve = function(start, dist, totalframes){
        this.totalFrames = 100; //should be private so can recalculate
        this.distance = 100; //should be private so can recalculate
        this.startPoint = 0; //should be private so can recalculate 
        this.init(start, dist, totalframes); };
    adr.PerfectCurve.prototype.init = function(start, dist, totalframes){
        var uv = __imns('util.validation');
        this.startPoint = (uv.isNumber(start)) ? start : 0;
        this.distance = (uv.isNumber(dist)) ? dist : 0;
        this.totalFrames = (uv.isNumber(totalframes)) ? Math.floor(totalframes) : 1; 
        this.angleProport = this.getAngleProportion(); };
    adr.PerfectCurve.prototype.getAngleProportion = function(){ return 90 / this.totalFrames; };
    adr.PerfectCurve.prototype.moveProportion = function(frame){
        var uv = __imns('util.validation');
        if(uv.isNumber(frame) && Math.round(frame) === frame){
            var angleOn = frame * this.angleProport;
            angleOn = (Math.PI/180 * angleOn);
            return this.startPoint + (this.distance * Math.sin(angleOn)); }};


}
