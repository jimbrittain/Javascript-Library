"use strict";
/* global __imns, document, console */
/*jshint -W069 */ // Turn off dot notation
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('measure' in adr)){


    /**
     * @module measure
     * @method measure
     * @param {Number|Measurement String} n Argument 1
     * @param {Measurement} r Argument 2 [String - px|rem|ch|vh|vw|vmin|vmax|%|ex|em|in|cm|mm|pc|pt|mozmm]
     * @param {HTMLElement} elem Argument 3 [optional]
     * @return {Measurement String}
     * @copyright JDB 2014-16
     * @version 0.3
     * @author Immature Dawn
     * @requires isHTMLElement, findElementsByTag
     */
    adr.measure = function(n, r, elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var fs = 16, w = 1024, em_size = 1, id_name = 'measuretester_0104', i=0, max=0, tp = {}; 
        var ex_size = 0.53; /*8.48@16 Arial/Helvetica*/
        var _element = (elem !== undefined && uv.isHTMLElement(elem)) ? elem : ud.findElementsByTag('body')[0];
        var setStandardStyles = function(elem, w, h){
            if(elem !== undefined && uv.isHTMLElement(elem)){
                    if('setAttribute' in elem){ elem.setAttribute('id', id_name); }
                    elem.style['width'] = w;
                    elem.style['height'] = h;
                    elem.style['display'] = 'block';
                    elem.style['position'] = 'absolute';
                    elem.style['visibility'] = 'hidden'; }};
        var destroyTP = function(){
            var e = ud.findElementByID(id_name);
            if(e !== null && uv.isHTMLElement(e)){
                if('parentElement' in e){
                    e.parentElement.removeChild(e);
                } else if('parentNode' in e){ e.parentNode.removeChild(e); }}};
        var validate = function(_r){
            var re = /^(px|rem|ch|vh|vw|vmin|vmax|%|ex|em|in|cm|mm|pc|pt|mozmm)$/;
            return (re.test(_r)) ? _r : 'px'; };
        var bases = function(_element){
            fs = parseFloat(ud.findElementStyle(_element, 'fontSize'));
            w = ud.findElementStyle(ud.findParent(_element), 'offsetWidth');
            try {
                destroyTP();
                tp = ('createElement' in document) ? document.createElement('span'): null;
                setStandardStyles(tp, '1em', '1em');
                try {
                    _element.appendChild(tp);
                    em_size = ud.findElementStyle(tp, 'offsetWidth')/fs;
                    if(em_size === 0){ throw new Error(); }
                } catch(e){
                    ud.findParent(_element).appendChild(tp);
                    em_size = ud.findElementStyle(tp, 'offsetWidth')/fs; }} catch(e){}
            destroyTP();
            try {
                destroyTP();
                tp = ('createElement' in document) ? document.createElement('span'): null;
                setStandardStyles(tp, '1ex', '1ex');
                try {
                    _element.appendChild(tp);
                    ex_size = ud.findElementStyle(tp, 'offsetWidth')/fs;
                    if(ex_size === 0){ throw new Error(); }
                } catch(e){
                    ud.findParent(_element).appendChild(tp);
                    ex_size = ud.findElementStyle(tp, 'offsetWidth')/fs; }} catch(e){}
            destroyTP();
            em_size = (em_size <= 0) ? 1 : em_size;
            ex_size = (ex_size <= 0) ? 0.53 : ex_size; };
        bases(_element);
        var t = [
                    [
                        'px',
                        function(n){ return (parseFloat(n)); }, 
                        function(n){ return Math.round(parseFloat(n)); }],
                    [
                        'em',
                        function(n){return (parseFloat(n)*(fs * em_size)); },
                        function(n){return (parseFloat(n))/(fs * em_size); }],
                    [
                        'ex',
                        function(n){return (parseFloat(n))*(fs * ex_size);},
                        function(n){return (parseFloat(n))/(fs * ex_size);}], 
                    [
                        '%', 
                        function(n){ return (parseFloat(n)/100) * w; }, 
                        function(n){ return (parseFloat(n)/w) * 100; }]
        ];
        if(uv.isNumber(parseFloat(n))){
            for(i=0, max=t.length; i < max; i+=1){
                n = (typeof n === "number") ? n + '' : n;
                if(n.lastIndexOf(t[i][0]) === (n.length - t[i][0].length)){
                    n = t[i][1](n);
                    break; }}
        } else { n = 0; }
        if(n !== 0){
            for(i=0, max = t.length; i < max; i+=1){
                if(r === t[i][0]){
                    return t[i][2](n) + t[i][0];
                }}
            return n + 'px';
        } else { return '0' + validate(r);}};


}
