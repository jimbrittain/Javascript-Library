"use strict";
/*global window, IMDebugger, isHTMLElement, console */
/**
 * isElementAnOnlyChild
 * Javascript is queried element and only child function
 * Requires isHTMLElement
 * @author JDB - jim@immaturedawn.co.uk 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
 * @version - 0.1
 *
 * @function isElementAnOnlyChild
 * @param {HTMLElement} htmlElem
 * @return {Boolean}
 * Determines whether htmlElem is an only child of it's parent element
 */
var isElementAnOnlyChild = function(htmlElem){
    if(isHTMLElement(htmlElem)){
        var myParent = (('parentElement' in htmlElem) ? htmlElem.parentElement : (('parentNode' in htmlElem) ? htmlElem.parentNode : null));
        if(myParent !== null){
            var myNumberOfKids = ('childNodes' in myParent) ? myParent.childNodes.length : 0;
            var myRealNumberOfKids = 0;
            for(var i=0; i < myNumberOfKids; i += 1){
                if('nodeType' in myParent.childNodes[i] && myParent.childNodes[i].nodeType !== 8){
                    if(('parentElement' in myParent.childNodes[i] && myParent.childNodes[i].parentElement === myParent) || ('parentNode' in myParent.childNodes[i].parentNode === myParent)){ //this is a fix for an IE bug where a childNode may not share the correct parent;
                        if(myParent.childNodes[i].nodeType === 3){ //do a whitespace check;
                            var myText = ('textContent' in myParent.childNodes[i]) ? myParent.childNodes[i].textContent : (('innerText' in myParent.childNodes[i]) ? myParent.childNodes[i].innerText : "texttobreak");
                            if(myText.match(/\w/gi)){
                                myRealNumberOfKids += 1;
                                if(myRealNumberOfKids > 1){ break; }
                            } else { continue; }
                        } else {
                            myRealNumberOfKids += 1;
                            if(myRealNumberOfKids > 1){ break; }}}}}
            return ((myRealNumberOfKids > 1) ? false : true);
        } else {
            (new IMDebugger()).pass("isElementAnOnlyChild: Cannot determine elements parent");
            return true; }
    } else {
        (new IMDebugger()).pass("isElementAnOnlyChild: Must be supplied a valid HTMLElement");
        return false; }};
