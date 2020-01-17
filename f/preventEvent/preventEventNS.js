"use strict";
/*global __imns, Event, window*/
(function(){
    var adr = __imns('util.tools');
    // var adr = window; //for stand-alone delete above and uncomment this line
    if(!('preventEvent' in adr)){

    adr.preventEvent = function(e){
        var ut = __imns('util.tools');
        e = ut.findEvent(e);
        //if(e === undefined || !(e instanceof Event)){ e = window.event; }
        if(typeof e === 'object'){
            if('stopPropagation' in e){ e.stopPropagation(); }
            if('preventBubble' in e){ e.preventBubble(); }
            if('preventDefault' in e){ 
                try {
                    e.preventDefault();
                } catch(err) {
                }
            }
            if('cancelBubble' in e){ e.cancelBubble = true; }
            if('returnValue' in e){ e.returnValue = false; }}
        return false; };
    }
})();
