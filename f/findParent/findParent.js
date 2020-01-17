"use strict";
/*global isHTMLElement*/
/**
 * @function findParent
 * @param elem {HTMLElement}
 * @return {HTMLElement || undefined}
 * @requires isHTMLElement
 **/
function findParent(elem){
    if(elem !== undefined && isHTMLElement(elem)){
        var p = ('parentNode' in elem) ? elem.parentNode : (('parentElement' in elem) ? elem.parentElement : elem);
        return (isHTMLElement(p)) ? p : undefined;
    } else { return undefined; }}
