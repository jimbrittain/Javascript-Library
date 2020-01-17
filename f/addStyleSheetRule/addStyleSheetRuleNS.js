"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('addStyleSheetRule' in adr)){
    /**
      @function util.tools.addStyleSheetRule
      @param name {String} selector or @declaration
      @param syntax {String} property:value or full value
      @param sheet {CSSStyleSheet|undefined|null} - optional
      @param position {Number|undefined} - optional
     **/
    adr.addStyleSheetRule = function(name, syntax, sheet, position){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var err = 0;
        if(typeof name === 'string' && typeof syntax === 'string'){
            if(sheet === undefined ||!uv.isStyleSheet(sheet)){
                ut.addStyleSheet({name: 'programatic'});
                sheet = ut.findStyleSheet({name: 'programatic'}); }
            var rulesLength = ('cssRules' in sheet) ? sheet.cssRules.length : (('rules' in sheet) ? sheet.rules.length : 0);
            if(position === undefined){
                position = rulesLength;
            } else { position = (uv.isNumber(position) && position > -1 && position < rulesLength) ? parseInt(position) : rulesLength; }
            var pos = -1;
            try {
                if('insertRule' in sheet){
                    window.f = sheet;
                    pos = sheet.insertRule(name + ' { ' + syntax + ' }', position);
                } else if('addRule' in sheet){
                    pos = sheet.addRule(name, syntax, position); }
                return (pos !== -1) ? true : false;
            } catch(e) { 
                (new (__imns('util.debug')).IMDebugger()).pass(e);
                err = 1; }}
        return false; };
}
