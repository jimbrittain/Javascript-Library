"use strict";
/*global isHTMLElement, findParent */
/**
 * @function isChildOf
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @return {Boolean}
 * @description Determines whether {HTMLElement} child is a child of {HTMLElement} parent
 * @requires isHTMLElement, findParent
 */
function isChildOf(child, parent){
    if(child !== undefined && isHTMLElement(child) && parent !== undefined && isHTMLElement(parent)){
        var p = findParent(child);
        while(p !== undefined){
            if(p === parent){
                return true;
            } else { p = findParent(p); }}}
    return false; }
