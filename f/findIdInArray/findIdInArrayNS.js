"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findIdInArray' in adr)){
    adr.findIdInArray = function(item, arr, multiple){
        var uv = __imns('util.validation');
        multiple = (uv.isBoolean(multiple)) ? multiple : false;
        if(uv.isArray(arr)){
            var found = [];
            for(var i=0, imax=arr.length; i<imax; i+=1){
                if(item === arr[i]){
                    found.push(i);
                    if(!multiple){ break; }}}
            if(found.length === 0){
                return false;
            } else { return (!multiple) ? found[0] : found; }
        } else { 
            (new (__imns('util.debug')).IMDebugger()).pass('util.tools.findIdInArray not supplied an array');
            return false; }};
    adr.findIdsInArray = function(item, arr){ return (__imns('util.tools')).findIdInArray(item, arr); };
}
