"use strict";
function TheGoldenRatio(){
	if(TheGoldenRatio.prototype.singleton !== undefined){ return TheGoldenRatio.prototype.singleton; }
	TheGoldenRatio.prototype.singleton = this; }
TheGoldenRatio.prototype.PHI = (function(){
	var phi = (1 + Math.sqrt(5))/2;
	return phi;})();
TheGoldenRatio.prototype.invPHI = (function(){
	var invphi = 1/TheGoldenRatio.prototype.PHI;
	return invphi;})();
TheGoldenRatio.prototype.rootFive = (function(){
	var root5 = Math.sqrt(5);
	return root5; })();
var GoldenRatio = new TheGoldenRatio();
