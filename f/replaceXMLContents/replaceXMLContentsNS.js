"use strict";
/*jshint -W002 */
/* global window, __imns, XMLSerializer */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('replaceXMLContents' in adr)){


    adr.replaceXMLContents = function(_target, _replace, fallback){
        do { _target.removeChild(_target.lastChild);
        } while(_target.childNodes.length > 0);
        try {
            do { _target.appendChild(_replace.firstChild);
            } while(_replace.childNodes.length > 0);
        } catch(e){
            for(var i=0, imax=_replace.childNodes.length; i<imax; i+=1){
                try {
                    var serializer = new XMLSerializer();
                    var text = serializer.serializeToString(_replace.childNodes[i]);
                    _target.innerHTML = _target.innerHTML + text;
                } catch(e){
                    if(_replace.childNodes[i].xml !== undefined){
                        _target.innerHTML = _target.innerHTML + _replace.childNodes[i].xml;
                    } else { 
                        if(typeof fallback === 'function'){
                            fallback();
                        } else if(typeof fallback === 'string'){
                            window.location = fallback; }
                    }}}}
        _target.innerHTML = _target.innerHTML.replace(/></, "> <"); };


}
