"use strict";
/* global window, __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findEventElement' in adr)){
    adr.findEventElement = function(evt){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        if(uv.isHTMLElement(evt)){ return evt; } //covering in case supplied an element;
        evt = ut.findEvent(evt);
        var elem = evt.target || evt.srcElement;
        return (uv.isHTMLElement(elem)) ? elem : null;
    };
}
