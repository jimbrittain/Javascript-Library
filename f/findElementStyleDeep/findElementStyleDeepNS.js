"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findElementStyleDeep' in adr)){
    adr.findElementStyleDeep = function(_elem, _style){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ud = __imns('util.dom');
        if(uv.isHTMLElement(_elem)){
            var style = new uc.SupportedCSSProperty(_style);
            if(style.exists){
                var styleCSS = ud.findElementStyle(_elem, style.cssProperty);
                var onStyle = _elem.style[style.jsProperty];
                return (onStyle === '' || onStyle === undefined) ? styleCSS : onStyle; }}
        return ''; };
}
