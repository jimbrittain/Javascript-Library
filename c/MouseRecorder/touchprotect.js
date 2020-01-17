"use strict";
/* global __imns, navigator */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('touchprotect' in adr)){


    /**
     * @method touchprotect
     * @param {Object} evt Event
     * @param {Boolean} r Returning for bubbling
     * 	@default true
     * @return {Boolean} true | false if set
     */
    adr.touchprotect = function(evt, r){
        var uv = __imns('util.validation');
        r = (r !== undefined || r === true) ? true : false;
        if(uv.isKindle() || (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/WebKit/i))){
            if('preventDefault' in evt){ evt.preventDefault(); }
            return false;
        } else { return r; }};


}
