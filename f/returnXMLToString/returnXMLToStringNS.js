"use strict";
/* globals window, XMLSerializer, __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('returnXMLToString' in adr)){

    adr.returnXMLToString = function(x){
        if('innerHTML' in x && x.innerHTML !== undefined){
            return x.innerHTML;
        } else {
            var str = '';
            if('childNodes' in x && x.childNodes.length > 0){
                for(var i=0,imax = x.childNodes.length; i<imax; i+=1){
                    if(XMLSerializer){
                        str += (new XMLSerializer()).serializeToString(x.childNodes[i]);
                    } else if('ActiveXObject' in window){ str += (x.childNodes[i]).xml; }}}
                        return str; }};

}
