"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findParent' in adr)){
    /**
     * @function findParent
     * @param elem {HTMLElement}
     * @return {HTMLElement || undefined}
     * @requires isHTMLElement
     **/
    adr.findParent = function(elem, parenttype){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var p = ('parentNode' in elem) ? elem.parentNode : (('parentElement' in elem) ? elem.parentElement : elem);
            if(parenttype !== undefined && uv.isHTMLElement(p)){
                return (ud.getTagName(p) === parenttype) ? p : ud.findParent(p, parenttype);
            } else { return (uv.isHTMLElement(p)) ? p : undefined; }
        }
        return undefined; };
}
