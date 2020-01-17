"use strict";
/*global __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isChildOf' in adr)){
    /**
     * @function isChildOf
     * @param {HTMLElement} child
     * @param {HTMLElement} parent
     * @return {Boolean}
     * @description Determines whether {HTMLElement} child is a child of {HTMLElement} parent
     * @requires isChildOf, findParent
     */
    adr.isChildOf = function(child, parent){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(child !== undefined && uv.isHTMLElement(child) && parent !== undefined && uv.isHTMLElement(parent)){
            var p = ud.findParent(child);
            while(p !== undefined){
                if(p === parent){
                    return true;
                } else { p = ud.findParent(p); }}}
        return false; };
}
