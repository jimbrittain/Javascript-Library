"use strict";
/* globals __imns, window, document */
(function(){
    var adr = __imns('util.dom');
    if(!('isWindow' in adr)){
        adr.isWindow = function(w){
            w = (w === undefined) ? null : w;
            if(typeof w !== 'object' || w === null){ return false; }
            if('Window' in window){
                if(w instanceof window.Window){
                    return true; }}
            if('contentWindow' in w){ return true; }
            //probably needs more than this;
            return false; };
    }
    if(!('findTopFrame' in adr)){
        adr.findTopFrame = function(w){
            var ud = __imns('util.dom');
            w = (w === undefined) ? null : w;
            if(typeof w !== 'object' || w === null){ return null; }
            if(ud.isWindow(w)){
                if('top' in w){ return w.top; }
                if('frameElement' in w){
                    if('frameElement' === null){
                        return w;
                    } else {
                        return ud.findTopFrame(w.parent); }}}
            return null; };
    }
    if(!('isTopFrame' in adr)){
        adr.isTopFrame = function(w){
            var ud = __imns('util.dom');
            if(w === null){ return false; }
            return (w === ud.findTopFrame(w)); };
    }
    if(!('isFrame' in adr)){
        adr.isFrame = function(frame){
            var uv = __imns('util.validation'),
                ud = __imns('util.dom');
            frame = (frame === undefined) ? null : frame;
            if(typeof frame === 'string' && uv.isString(frame)){ frame = ud.findFrame(frame); }
            if(frame === null || typeof frame !== 'object'){ return false; }
            if('HTMLIFrameElement' in window){
                if(frame instanceof window.HTMLIFrameElement){
                    return true; }}
            if('HTMLFrameElement' in window){
                if(frame instanceof window.HTMLFrameElement){
                    return true; }}
            if('contentWindow' in frame){ return true; }
            if('frameElement' in frame){ return true; }
            if(uv.isHTMLElement(frame) && (ud.getTagName(frame) === 'frame' || ud.getTagName(frame) === 'iframe')){
                return true; }
            //window frames, parent frames, document frames
        };
    }
    if(!('findFrame' in adr)){
        adr.findFrame = function(ident){
            var uv = __imns('util.validation'),
                ud = __imns('util.dom');
            if(typeof ident === 'string'){
                var elem = null;
                if(uv.isString(ident)){
                    var discovery = ud.findElementsBySelector(ident);
                    while(elem === null){
                        if(uv.isHTMLElement(discovery)){
                            elem = discovery;
                            break;
                        } else if(uv.isArray(discovery) && discovery.length === 1){
                            elem = discovery[0]; 
                            break; }
                        discovery = ud.findElementById(ident);
                        if(discovery !== null && uv.isHTMLElement(discovery)){
                            elem = discovery; 
                            break; }
                        discovery = ud.findElementByName(ident);
                        if(discovery !== null && uv.isHTMLElement(discovery)){
                            elem = discovery; 
                            break; }
                        break; }
                    ident = elem; }}
            return (typeof ident === 'object' && ud.isFrame(ident)) ? ident : null; };
    }
    if(!('addressFrame' in adr)){
        adr.addressFrame = function(frame){
            var ud = __imns('util.dom');
            if(typeof frame !== 'object' || frame === null){ return null; }
            if('HTMLIFrameElement' in window || 'HTMLFrameElement' in window){
                if(frame instanceof window.HTMLIFrameElement || frame instanceof window.HTMLFrameElement){
                    if('contentWindow' in frame){
                        return frame.contentWindow;
                    } else if('contentDocument' in frame && 'defaultView' in frame.contentDocument){
                        return frame.contentDocument; }}}
            return (ud.findFrame(frame) !== null) ? ud.findFrame(frame) : undefined; };
    }
})();
