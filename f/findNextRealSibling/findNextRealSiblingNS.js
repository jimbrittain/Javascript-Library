"use strict";
/* global __imns */
(function(){
    var adr = __imns('util.dom');
    if(!('findNextRealSibling' in adr)){
        adr.findNextRealSibling = function(elem){
            var uv = __imns('util.validation');
            if(elem !== undefined && uv.isHTMLElement(elem)){
                if('nextElementSibling' in elem){
                    //this may be less useful than the below;
                    return elem.nextElementSibling;
                } else {
                    if('nextSibling' in elem){
                        var next = elem;
                        while((next = next.nextSibling) !== null){
                            if('nodeType' in next){
                                if(next.nodeType === 1 || next.nodeType === 8 || next.nodeType === 10){
                                    return next;
                                } else if(next.nodeType === 3){
                                    var re = /^\s*$/;
                                    if(!re.test(next.innerHTML)){
                                        return next; }}}}}}}
            return null; };
    }
})();
