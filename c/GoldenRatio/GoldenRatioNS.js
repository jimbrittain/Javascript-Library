"use strict";
/* global __imns */
var adr = __imns('util.classes');
var um = __imns('util.math');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('TheGoldenRatio' in adr)){


    adr.TheGoldenRatio = function(){
        var uc = __imns('util.classes');
        if(uc.TheGoldenRatio.prototype.singleton !== undefined){ return uc.TheGoldenRatio.prototype.singleton; }
        uc.TheGoldenRatio.prototype.singleton = this; };
    adr.TheGoldenRatio.prototype.PHI = (function(){
        var phi = (1 + Math.sqrt(5))/2;
        return phi;})();
    adr.TheGoldenRatio.prototype.invPHI = (function(){
        var uc = __imns('util.classes');
        var invphi = 1/uc.TheGoldenRatio.prototype.PHI;
        return invphi;})();
    adr.TheGoldenRatio.prototype.rootFive = (function(){
        var root5 = Math.sqrt(5);
        return root5; })();

    um.PHI = adr.TheGoldenRatio.prototype.PHI;
    um.invPHI = adr.TheGoldenRatio.prototype.invPHI;
    um.ROOT5 = adr.TheGoldenRatio.prototype.rootFive;


}
