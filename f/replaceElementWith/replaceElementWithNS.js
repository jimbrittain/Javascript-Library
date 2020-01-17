"use strict";
/* global __imns */
var adr = __imns('util.dom');
if (!('replaceElementWith' in adr)) {
    adr.replaceElementWith = function(elem, replace) {
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        elem = (elem !== undefined && uv.isHTMLElement(elem)) ? elem : false;
        if (elem !== false) {
            var par = ud.findParent(elem); //may need validator;
            if (!par || !uv.isHTMLElement(par)) { return false; }
            if (replace !== undefined && !uv.isHTMLElement(replace) && uv.isString(replace)) {
                replace = ud.returnXMLFromString(replace);
            }
            try {
                if ('replaceChild' in par) {
                    par.replaceChild(replace, elem);
                }
                //throw error;
                if ('innerHTML' in par) {
                    par.innerHTML = par.innerHTML; //corrects rendering;
                }
                return true;
            } catch (e) {
                //imns debugger warning here;
            }
        }
        return false;
    };
}
