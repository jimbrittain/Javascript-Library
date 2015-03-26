"use strict";
/* global window, document, isNumber */
/**
 * Alignment.js
 * Alignment Class - Version 0.1
 * @version 0.1
 * @author JDB - jim@immaturedawn.co.uk 2012
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2012
**/
function Alignment(obj){
	this.vertical = ('vertical' in obj) ? obj.vertical : 'top'; // top || center || bottom
	this.horizontal = ('horizontal' in obj) ? obj.horizontal : 'left'; // left || center || right
	this.registration = ('registration' in obj) ? obj.registration : 'inside'; // inside || fixed || outside. If target = window != outside
	this.registration_x = 0;
	this.registration_y = 0;
	if('registration_x' in obj || 'registration_y' in obj){
		this.registration = 'fixed';
		this.registration_x = ('registration_x' in obj) ? obj.registration_x : 0;
		this.registration_y = ('registration_y' in obj) ? obj.registration_y : 0;
	}
	this.target = ('target' in obj) ? obj.target : document; //target or element;
}
Alignment.prototype.determineValue = function(n){
	if(typeof n === 'string' && n.indexOf('%') === (n.length - 1)){
		n = n.substring(0, n.length - 1);
		n /= 100;
	} else { 
		if(isNumber(n)){
			n /= 100;
		} else { n = 0; }}
	return (!isNaN(n) && !isNaN(parseInt(n))) ? n : 0; };
Alignment.prototype.verticalValue = function(){
	switch(this.vertical){
		case 'top':
			return 0;
		case 'center':
			return 0.5;
		case 'bottom':
			return 1;
		default:
			return this.determineValue(this.vertical); }};
Alignment.prototype.horizontalValue = function(){
	switch(this.horizontal){
		case 'left':
			return 0;
		case 'center':
			return 0.5;
		case 'right':
			return 1;
		default:
			return this.determineValue(this.horizontal); }};
Alignment.prototype.registrationValue = function(){
	this.registration = (this.target === 'window' && this.registration === 'outside') ? 'inside' : this.registration;
	switch(this.registration){
		case 'inside':
			return 1;
		case 'center':
			return 0.5;
		case 'outside':
			return 0;
		default:
			return this.determineValue(this.registration); }};
Alignment.prototype.registrationXValue = function(){
	if(this.registration === 'fixed'){
		return this.registration_x;
	} else {
		switch(this.registration) {
			case "inside":
				return (this.horizontalValue() <= 0.5) ? 0 : 1;
			case "outside":
				return (this.horizontalValue() <= 0.5) ? 1 : 0;
			default: //middle;
				return 0.5; }}};
Alignment.prototype.registrationYValue = function(){
	if(this.registration === 'fixed'){
		return this.registration_y;
	} else {
		switch(this.registration){
			case "inside":
				return (this.verticalValue() <= 0.5) ? 0 : 1;
			case "outside":
				return (this.verticalValue() <= 0.5) ? 1 : 0;
			default: //middle;
				return 0.5; }}};