"use strict";
/*jshint -W053 */
/*global __imns */
var adr = __imns('util.tools');
//var adr = window //uncomment this line, delete above line to use standalone;
if(!('trimString' in adr)){
    adr.trimString = function(str){
        if(typeof str === 'string'){
            if('trim' in new String()){
                str = str.trim();
            } else { str = str.replace(/^\s+|\s+$/gm,''); }}
        return str; };
}

