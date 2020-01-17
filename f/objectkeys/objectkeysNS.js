"use strict";
/* global __imns, console, window */
(function(){
    var adr = __imns('util.tools');
    if (!('objectkeys' in adr)) {
        /**
         * @namespace util.tools
         * @method objectkeys
         * @param obj
         * @return {Array|False}
         * @todo obj not checked to be an object
         **/
        adr.objectkeys = function(obj){
            if (typeof obj === 'object'){
                if ('keys' in Object) {
                    return Object.keys(obj);
                } else {
                    var arr = [];
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(obj)) {
                            arr.push(prop); }}
                    return arr; }
            } else {
                var tdb = __imns('util.debug'),
                    m = 'object keys not supplied with an object';
                if ('Debugger' in tdb){
                    (new tdb.Debugger()).pass(m);
                } else { console.log(m); }
                return false;
            }
        };
        adr.objectKeys = adr.objectkeys; //camelcase alias;
    }
})();
