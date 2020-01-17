"use strict";
/*jshint -W069 */
/* global __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('includeXMLResponse' in adr)){


    adr.includeXMLResponse = function(elem_str, txt){
        var uv = __imns('util.validation'), ud = __imns('util.dom'), targetElem = ud.findElementByID(elem_str);
        if(targetElem !== undefined && uv.isHTMLElement(targetElem)){
            if(targetElem.childNodes && targetElem.appendChild){
                if(targetElem.childNodes.length > 0){
                    for(var i=0; i<targetElem.childNodes.length; i+=1){
                        targetElem.removeChild(targetElem.childNodes[i]); }}
                targetElem.innerHTML = txt;
            } else { targetElem.innerHTML = txt; }}};


}
