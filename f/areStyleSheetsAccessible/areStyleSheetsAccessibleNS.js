"use strict";
/* global window, IMDebugger, __imns, document, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('areStyleSheetsAccessible' in adr)){
    adr.areStyleSheetsAccessible = function(){ return ('styleSheets' in document) ? true : false; };
}
