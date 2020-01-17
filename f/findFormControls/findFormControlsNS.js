"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findFormControls' in adr)){
    adr.findFormControls = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var arr = [];
        elem = (uv.isFormElement(elem)) ? elem : ud.findForm(elem);
        if(elem !== null && uv.isFormElement(elem)){
            if('elements' in elem){
                arr = ud.htmlNodesToArray(elem.elements);
            } else {
                var children = ('childNodes' in elem) ? ud.htmlNodesToArray(elem.childNodes) : (('children' in elem) ? ud.htmlNodesToArray(elem.children) : []);
                var i = 0, e, morekids = [];
                while(i < children.length){
                    e = children[i];
                    morekids = [];
                    if(uv.isFormControlElement(e)){ arr.push(e); }
                    morekids = ('childNodes' in e) ? ud.htmlNodesToArray(e.childNodes) : (('children' in e) ? ud.htmlNodesToArray(e.children) : []);
                    children = children.concat(morekids);
                    i += 1; }}}
        return arr; };

}

