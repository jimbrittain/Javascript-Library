"use strict";
/*global findElementByID, isHTMLElement, console */
/**
    @method replaceElementContentsWithString
    @param {Element|String} targetElement - if string attempts to getElementById(targetElement)
    @param {String} textContent - replacement string, may be html
    @return {Boolean} Success?
    @description replace the internal contents of element (or element from id) with supplied string
 */
function replaceElementContentsWithString(targetElement, textContent){
    targetElement = (typeof targetElement === 'string') ? findElementByID(targetElement) : targetElement;
    if(targetElement !== undefined && isHTMLElement(targetElement) && typeof textContent === 'string'){
        if(targetElement.appendChild){
            var arr = (targetElement.childNodes) ? targetElement.childNodes : ((targetElement.children) ? targetElement.children : []);
            while(arr.length > 0){ 
                var lastLength = arr.length;
                targetElement.removeChild(arr[0]); 
                if(arr.length === lastLength){ console.log('fucked'); break; }}
            targetElement.innerHTML = textContent;
            return true; }}
    return false; }
