"use strict";
/* global __imns */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Coordinates' in adr)){
    /*
     * @module Coordinates
     * @class Coordinates
     * @constructor
     * @requires isNumber
     */
    adr.Coordinates = function(){
        this.x = 0;
        this.y = 0;
        this.init(arguments); };

    adr.Coordinates.prototype.init = function(){
        var uv = __imns('util.validation');
        if(arguments.length === 1){
            var a = arguments[0];
            if(a.length === 1 && a[0] !== undefined){
                this.x = a[0].x;
                this.y = a[0].y;
            } else if(a.length === 2 && uv.isNumber(a[0]) && uv.isNumber(a[1])){
                this.x = a[0];
                this.y = a[1]; }}};
    adr.Coordinates.prototype.distance = function(c){
        var uc = __imns('util.classes');
        if(c instanceof uc.Coordinates){ 
            return Math.sqrt(Math.pow(Math.abs(this.distanceToX(c)), 2) + Math.pow(Math.abs(this.distanceToY(c)), 2));
        } else { return 0; }};
    adr.Coordinates.prototype.distanceToX = function(c){ 
        var uc = __imns('util.classes'),
            uv = __imns('util.validation');
        if(c instanceof uc.Coordinates){ 
            return c.x - this.x;
        } else if(uv.isNumber(c)){
            return c - this.x;
        } else { return 0; }};
    adr.Coordinates.prototype.distanceToY = function(c){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation');
        if(c instanceof uc.Coordinates){
            return c.y - this.y;
        } else if(uv.isNumber(c)){
            return c - this.y;
        } else { return 0; }};


}
