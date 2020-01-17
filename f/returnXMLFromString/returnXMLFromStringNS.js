"use strict";
/* global window, DOMParser, ActiveXObject, __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('returnXMLFromString' in adr)){


    adr.returnXMLFromString = function(str){
        var parser = null, xmlStr = null;
        if(window.DOMParser !== undefined){
            parser = new DOMParser();
            try {
                xmlStr = parser.parseFromString(str, "application/xml");
            } catch(e){ xmlStr = parser.parseFromString(str, "text/xml"); }
        } else if(typeof window.ActiveXObject !== undefined){
            xmlStr = new ActiveXObject("Microsoft.XMLDOM");
            xmlStr.async = "false";
            xmlStr.loadXML(str); }
        return xmlStr; };


}
