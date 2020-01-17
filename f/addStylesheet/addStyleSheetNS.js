"use strict";
/* global window, IMDebugger, __imns, document, console, setTimeout */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('addStyleSheet' in adr)){
    adr.addStyleSheet = function(href, name){
        var ut = __imns('util.tools'),
            ud = __imns('util.dom');
        var ss = '',
            obj = {
                href: null,
                name: null },
            e,
            str = '',
            headElem = ud.findElementsByTag('head')[0];
        if(typeof href === 'object' && name === undefined){
            obj.href = ('href' in href) ? href.href : obj.href;
            obj.name = ('title' in href) ? href.title : obj.name;
            obj.name = ('name' in href) ? href.name : obj.name;
        } else {
            obj.href = (href !== undefined) ? href : obj.href;
            obj.name = (name !== undefined) ? name : obj.name; }
        if(obj.href !== null && typeof obj.href === 'string'){
            var done = false,
                build = false;
            if(obj.href !== null){
                if(ut.doesStyleSheetExist({href: obj.href})){
                    ss = ut.findStyleSheet({href:obj.href});
                    if('disabled' in ss && ss.disabled === true){ 
                        ss.disabled = false; 
                        return true; }
                } else { build = true; }
            } else if(obj.name !== null){
                if(ut.doesStyleSheetExist({name: obj.name})){
                    ss = ut.findStyleSheet({name: obj.name});
                    if('disabled' in ss && ss.disabled === true){ 
                        ss.disabled = false; 
                        return true; }}}
             if(build){
                 if('createElement' in document && 'appendChild' in headElem){
                     e = document.createElement('link');
                     ud.setAttribute(e, 'rel', 'stylesheet');
                     ud.setAttribute(e, 'type', 'text/css');
                     if(obj.name !== null){ ud.setAttribute(e, 'title', obj.title); }
                     ud.setAttribute(e, 'href', obj.href);
                     headElem.appendChild(e);
                     return true;
                 } else if('innerHTML' in headElem){
                     str = '<link rel="stylesheet" type="text/css" href="' + obj.href + '"';
                     str = (obj.name !== null) ? str + ' title="' + obj.name +'"': str;
                     str = str + ' />';
                     headElem.innerHTML += str; 
                     return true; }
                var s = ut.findStyleSheet({title: obj.title, href: obj.href});
                setTimeout(function(){
                    var sts = (__imns('util.tools')).findStyleSheet({href: obj.href, title: obj.name});
                    if(sts !== false && 'disabled' in sts){
                        sts.disabled = false; }}, 50);
             }
        } else if(obj.name !== null && typeof obj.name === 'string'){
            if(ut.doesStyleSheetExist({name: obj.name})){
                ss = ut.findStyleSheet({name: obj.name});
                if('disabled' in ss && ss.disabled === true){
                    ss.disabled = false; }
                return true; }
            if('createElement' in document && 'appendChild' in headElem){
                e = document.createElement('style');
                ud.setAttribute(e, 'type', 'text/css');
                ud.setAttribute(e, 'title', obj.name);
                if('disabled' in e){ e.disabled = false; }
                headElem.appendChild(e);
                //return true;
            } else if('innerHTML' in headElem){
                str = '<style type="text/css" title="' + obj.name + '"></style>';
                headElem.innerHTML += str;
                //return true;
            }
            setTimeout(function(){
                var sts = (__imns('util.tools')).findStyleSheet({title: obj.name});
                if(sts !== false && 'disabled' in sts){
                    sts.disabled = false; }}, 50);
        }
        return false; };
}
