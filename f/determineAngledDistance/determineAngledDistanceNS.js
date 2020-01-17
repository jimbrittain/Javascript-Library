"use strict";
function simplifyDegrees(deg){
	deg = deg % 360;
	return (deg < 0) ? 360 + deg : deg; }
function calculateAngledDistance(_degrees, _distance){
	_degrees = simplifyDegrees(_degrees);
	var obj = {
		'angle' : simplifyDegrees(_degrees), 
		'x' 	: _distance,
		'y' 	: 0 };
	if((obj.angle % 90) === 0){
		switch(obj.angle){
			case 90:
				obj.x = _distance;
				obj.y = 0;
				break;
			case 180:
				obj.x = 0;
				obj.y = _distance;
				break;
			case 270:
				obj.x = _distance;
				obj.y = 0;
				break;
			case 360:
				/* falls through */
			default:
				obj.x = 0;
				obj.y = _distance;
				break; }
	} else {
		var relative45 = (obj.angle/45);
		relative45 = Math.floor(relative45) % 2;
		var radianDeg = (obj.angle % 90) * (Math.PI/180);
		if(relative45 === 1){
			obj.x = Math.cos(radianDeg) * _distance;
			obj.y = Math.sin(radianDeg) * _distance;
		} else {
			obj.x = Math.sin(radianDeg) * _distance;
			obj.y = Math.cos(radianDeg) * _distance; }
	}
	obj.y = (obj.angle > 90 && obj.angle < 270) ? obj.y : (0 - obj.y);
	obj.x = (obj.angle > 180) ? (0 - obj.x) : obj.x;
	return obj; }
