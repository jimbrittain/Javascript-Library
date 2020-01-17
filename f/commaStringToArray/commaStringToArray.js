"use strict";
/* global __imns */
var adr = __imns('util.tools');
//var adr = window; //uncomment and delete above line to use stand-alone
if(!('commaStringToArray' in adr)){
    adr.commaStringToArray = function(str){
        if(typeof str === 'string'){
            if(str.indexOf(',') !== -1){
                str = str.split(',');
            } else {
                str = str.replace('  ', ' ');
                str = str.split(' '); }
            for(var i=0; i<str.length; i+=1){
                str[i] = (__imns('util.tools')).trimString(str[i]);
                if(typeof str[i] !== 'string' || str[i].length < 1){ str = str.splice(i,1); }}
            return str; }
        return str; };
}
