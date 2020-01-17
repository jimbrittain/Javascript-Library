"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('wrapElementsWithElement' in adr)){
    adr.wrapElementsWithElement = function(elements, wrapperElement){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        elements = (uv.isHTMLElement(elements)) ? [elements] : elements;
        var i, imax;
        for(i=0; i < elements.length; i+=1){
            var on = elements[i];
            if(!uv.isHTMLElement(on)){ 
                elements.splice(i,1); 
                i -= 1; }}
        if(elements.length > 0){
            var wrapperStr = (uv.isHTMLElement(wrapperElement) && 'outerHTML' in wrapperElement) ? wrapperElement.outerHTML : wrapperElement;
            if(uv.isHTMLElement(wrapperElement) && 'insertBefore' in elements[0]){
                (ud.findParent(elements[0])).insertBefore(wrapperElement, elements[0]);
                for(i=0, imax=elements.length; i<imax; i+=1){
                    wrapperElement.appendChild(elements[i]); }
                return true;
            } else if(uv.isString(wrapperStr)){
                var startStr = wrapperStr,
                    endStr = '',
                    reg = /<\/([a-z]+)>\s*$/;
                if(reg.test(wrapperStr)){
                    var matches = wrapperStr.match(reg),
                        lastTag = matches[1],
                        startReg = new RegExp('^<' + lastTag + '( |>)');
                    if(startReg.test(wrapperStr)){
                        endStr = wrapperStr.substring((wrapperStr.length - matches[0].length));
                        startStr = wrapperStr.substring(0, (wrapperStr.length - matches[0].length));
                        if('outerHTML' in elements[0]){
                            if(elements[0] === elements[(elements.length - 1)]){
                                console.log(endStr);
                                elements[0].outerHTML = startStr + elements[0].outerHTML + endStr;
                            } else {
                                elements[0].outerHTML = startStr + elements[0].outerHTML;
                                elements[(elements.length - 1)].outerHTML += endStr; }
                            return true; }}}}}
        return false; };
}
