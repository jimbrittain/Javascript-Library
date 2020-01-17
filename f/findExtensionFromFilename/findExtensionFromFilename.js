"use strict";
/* global __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findExtensionFromFilename' in adr)){
    adr.findExtensionFromFilename = function(filename){
        if(typeof filename === 'string'){
            var extMatch = /.([A-Za-z0-9]{2,3})$/;
            if(extMatch.test(filename)){
                var str = filename.match(extMatch)[1];
                return str.toLowerCase(); }}
        return null;
    };
}
