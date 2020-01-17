"use strict";
/* global __imns */
(function(){
    var adr = __imns('util.dom');
    if(!('isEmptyTextElement' in adr)){
        adr.isEmptyTextElement = function(elem){
            if(elem !== undefined && typeof elem === 'object'){
                if('nodeType' in elem){
                    var nt = elem.nodeType,
                        empElem = (nt === 7 || nt === 8 || nt === 2 || nt === 4 || nt === 5 || nt === 6 || nt === 12) ? true : false;
                    if(empElem){ 
                        return true;
                    } else if(nt === 3){
                        var re = /^\s*$/;
                        if('innerHTML' in elem && re.test(elem.innerHTML)){
                            return true; }}}}
            return false; };
    }
})();
