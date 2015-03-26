"use strict";
/* global isNumber */
/*
 * @module Coordinates
 * @class Coordinates
 * @constructor
 * @requires isNumber
 */
function Coordinates(){
	this.x = 0;
	this.y = 0;
	this.init(arguments); }

Coordinates.prototype.init = function(){
	if(arguments.length === 1){
		var a = arguments[0];
		if(a.length === 1 && a[0] !== undefined){
			this.x = a[0].x;
			this.y = a[0].y;
		} else if(a.length === 2 && isNumber(a[0]) && isNumber(a[1])){
			this.x = a[0];
			this.y = a[1]; }}};
Coordinates.prototype.distance = function(c){
	if(c instanceof Coordinates){ 
		return Math.sqrt(Math.pow(Math.abs(this.distanceToX(c)), 2) + Math.pow(Math.abs(this.distanceToY(c)), 2));
	} else { return 0; }};
Coordinates.prototype.distanceToX = function(c){ 
	if(c instanceof Coordinates){ 
		return c.x - this.x;
	} else if(isNumber(c)){
		return c - this.x;
	} else { return 0; }};
Coordinates.prototype.distanceToY = function(c){
	if(c instanceof Coordinates){
		return c.y - this.y;
	} else if(isNumber(c)){
		return c - this.y;
	} else { return 0; }};
