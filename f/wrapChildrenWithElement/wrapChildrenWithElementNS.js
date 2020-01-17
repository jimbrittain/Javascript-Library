"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('wrapChildrenWithElement' in adr)){
    adr.wrapChildrenWithElement = function(element, wrapperElement){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isHTMLElement(element)){
            var wrapperStr = (uv.isHTMLElement(wrapperElement) && 'outerHTML' in wrapperElement) ? wrapperElement.outerHTML : wrapperElement;
            if(uv.isHTMLElement(wrapperElement) && 'appendChild' in element){
                element.appendChild(wrapperElement);
                var kids = ('childNodes' in element) ? element.childNodes : (('children' in element) ? element.children : []);
                for(var i=0; i < kids.length; i+=1){
                    if(kids[i] !== wrapperElement){
                        wrapperElement.appendChild(kids[i]);
                        i -= 1; }}
                return true;
            } else if(uv.isString(wrapperStr) && 'innerHTML' in element){
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
                        element.innerHTML = startStr + element.innerHTML + endStr;
                        return true; }}}}
        return false;
    };
}
