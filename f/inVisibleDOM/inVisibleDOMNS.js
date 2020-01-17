"use strict";
/*global __imns, document, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('inVisibleDOM' in adr)){
    /**
     * @module inVisibleDOM
     * @requires util.validation.isHTMLElement
     * @param {Object} elem
     * @return {Boolean} true | false
     */
    adr.inVisibleDOM = function(elem){
        var found = false, broken = false;
        var ud = __imns('util.dom'), udb = __imns('util.debug'), uv = __imns('util.validation');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            if('parentNode' in elem || 'parentElement' in elem){
                while(elem !== null && !broken && !found){
                    if(elem === document){ 
                        found = true; break;
                    } else {
                        if('parentNode' in elem || 'parentElement' in elem){
                            elem = ('parentNode' in elem) ? elem.parentNode : elem.parentElement;
                        } else { broken = true; break; }}}
                return found;
            } else { return false; }
        } else {
            if('IMDebugger' in udb){
                (new udb.IMDebugger()).pass("inVisibleDOM provided a none HTMLElement.");
            } else { console.log("inVisibleDOM provided a none HTMLElement."); }
            return false; }};
}
