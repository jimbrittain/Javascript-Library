"use strict";
/* global __imns */
var adr = __imns('util.math');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('percentToDecimal' in adr)){


    adr.percentToDecimal = function(fig, whole){
        whole = (whole === undefined || typeof whole !== 'number') ? 100 : whole;
        if(typeof fig === 'string'){
            var percentStr;
            percentStr = (fig.indexOf('%') !== -1) ? Number(fig.substring(0, fig.indexOf('%'))) : Number(fig);
            if(isNaN(percentStr)){ return undefined; }
        } else if(typeof fig !== 'number'){ return undefined; }
        return (fig/whole); };


}
