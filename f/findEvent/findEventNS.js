"use strict";
/* global window, __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findEvent' in adr)){
    adr.findEvent = function(e){
        e = ('Event' in window && !(e instanceof window.Event)) ? null : e;
        return e || window.event;
    };
}
