"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isInArray' in adr)){

    adr.isInArray = function(arr, search){
        if((__imns('util.validation')).isArray(arr)){
            for(var i=0, imax=arr.length; i<imax; i+=1){
                if(arr[i] === search){ return true; }}}
        return false; };

}
