"use strict";
/*global __imns, isNumber */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('whatmeasure' in adr)){
    /**
     * whatmeasure
     * @method whatmeasure
     * @param {Object} m
     * @return {String|undefined}
     * 	@notes Assumes an unsuffixed number is a pixel value
     */
    adr.whatmeasure = function(m){
        var uv = __imns('util.validation');
        m = (uv.isNumber(m)) ? m + '' : m;
        var re = /^([-+]?[0-9]*\.?[0-9]+)(px|rem|ch|vh|vw|vmin|vmax|%|ex|em|in|cm|mm|pc|pt|mozmm|%|deg)$/;
        var a = m.match(re);
        if(!a){
            var re2 = /^[-+]?[0-9]*\.?[0-9]+$/;
            return (m.match(re2)) ? 'px' : undefined;
        } else { return (a[2]) ? a[2] : undefined; }};
    adr.whatMeasure = adr.whatmeasure;


}
