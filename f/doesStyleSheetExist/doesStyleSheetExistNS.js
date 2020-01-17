"use strict";
/* global window, IMDebugger, __imns, document, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('doesStyleSheetExist' in adr)){
    adr.doesStyleSheetExist = function(href, name){
        var ut = __imns('util.tools');
        return (ut.findStyleSheet(href, name) === false) ? false : true; };
}
