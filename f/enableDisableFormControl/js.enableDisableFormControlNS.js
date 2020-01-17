"use strict";
/*globals __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('enableDisableFormControl' in adr)){
    adr.enableDisableFormControl = function(ctrl, enable){
        enable = (enable) ? true : false;
        var changed = false;
        if(ctrl.hasOwnProperty('disabled') || 'disabled' in ctrl){
            if(ctrl.disabled === enable){
                ctrl.disabled = !enable;
                changed = true; }
        } else if(ctrl.hasOwnProperty('readonly') || 'readonly' in ctrl){
            if(ctrl.readonly === enable){
                ctrl.readonly = !enable;
                changed = true; }}
        return changed; };
    adr.enableFormControl = function(ctrl){ 
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        return (uv.isHTMLElement(ctrl)) ? ut.enableDisableFormControl(ctrl, true) : false; };
    adr.disableFormControl = function(ctrl){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        return (uv.isHTMLElement(ctrl)) ? ut.enableDisableFormControl(ctrl, false) : false; };


}
