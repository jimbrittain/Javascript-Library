"use strict";
/* global __imns, window, document */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findElementStyle' in adr)){

    /**
     @function findElementStyle
     @param {HTMLElement} _elem
     @param {String} _style
     @return CSS Style Value
     */
    adr.findElementStyle = function(_elem, _style){
        function returnOffsetWidth(_elem){ return ('offsetWidth' in _elem) ? _elem.offsetWidth : returnCSSStyle(_elem, 'width'); }
        function returnOffsetHeight(_elem){ return ('offsetHeight' in _elem) ? _elem.offsetHeight : returnCSSStyle(_elem, 'height'); }
        function returnOffsetTop(_elem){
            if('offsetTop' in _elem){
                var currTop = 0;
                if('offsetParent' in _elem){
                    do{
                        currTop += _elem.offsetTop;
                        _elem = _elem.offsetParent;
                    } while (_elem !== undefined && _elem !== null);
                } else if('parentNode' in _elem){
                    do{
                        currTop += _elem.offsetTop;
                        _elem = _elem.parentNode;
                    } while(_elem !== undefined && _elem !== null); }
                return currTop;
            } else { return returnCSSStyle(_elem, 'top'); }}
        function returnOffsetLeft(_elem){
            if('offsetLeft' in _elem){
                var currLeft = 0;
                if('offsetParent' in _elem){
                    do{
                        currLeft += _elem.offsetLeft;
                        _elem = _elem.offsetParent;
                    } while (_elem !== undefined && _elem !== null);
                } else if('parentNode' in _elem){
                    do{
                        currLeft += _elem.offsetLeft;
                        _elem = _elem.parentNode;
                    } while(_elem !== undefined && _elem !== null); }
                return currLeft;
            } else { return returnCSSStyle(_elem, 'left'); }}
        function returnCSSStyle(_elem, _style){
            if('defaultView' in document){
                var elemAbstr = document.defaultView.getComputedStyle(_elem, null);
                if(returnConcatedStyle(_style) in elemAbstr){
                    return elemAbstr[returnConcatedStyle(_style)];
                } else { return undefined; }
            } else if('all' in document && 'currentStyle' in _elem){
                _style = returnConcatedStyle(_style);
                return _elem.currentStyle[_style];
            } else if('style' in _elem){
                return (returnConcatedStyle(_style) in _elem.style) ? _elem.style[returnConcatedStyle] : undefined;
            } else { return undefined; }}
        function returnConcatedStyle(_style){
            if(_style.indexOf('-') !== -1){
                var hyphenIndex = _style.indexOf('-');
                var hyphenArray = _style.split('-');
                _style = "";
                for(var i=1, imax=hyphenArray.length; i<imax; i += 1){
                    var tempStr = hyphenArray[i].substr(0, 1).toUpperCase();
                    tempStr += hyphenArray[i].substr(1);
                    hyphenArray[i] = tempStr; }
                _style = hyphenArray.join('');
                return _style;
            } else { return _style; }}
        var needsRevert = false,
            softRevert = false;
        if(returnCSSStyle(_elem, 'display') === "none" && _style !== 'display'){
            softRevert = (_elem.style.display === 'none') ? false : true;
            needsRevert = true;
            _elem.style.display = 'block'; }
        var val = 0;
        switch(_style){
            case 'offsetWidth':
                val = returnOffsetWidth(_elem);
                break;
            case 'offsetHeight':
                val = returnOffsetHeight(_elem);
                break;
            case 'offsetTop':
                val = returnOffsetTop(_elem);
                break;
            case 'offsetLeft':
                val = returnOffsetLeft(_elem);
                break;
            case 'outerHeight':
                val = parseFloat(returnOffsetHeight(_elem));
                val += parseFloat(returnCSSStyle(_elem, 'margin-top'));
                val += parseFloat(returnCSSStyle(_elem, 'margin-bottom'));
                val = val + 'px';
                break;
            case 'outerWidth':
                val = parseFloat(returnOffsetWidth(_elem));
                val += parseFloat(returnCSSStyle(_elem, 'margin-left'));
                val += parseFloat(returnCSSStyle(_elem, 'margin-right'));
                val = val + 'px';
                break;
            case 'innerHeight':
                val = parseFloat(returnOffsetHeight(_elem));
                val -= parseFloat(returnCSSStyle(_elem, 'padding-top'));
                val -= parseFloat(returnCSSStyle(_elem, 'padding-bottom'));
                val = val + 'px';
                break;
            case 'innerWidth':
                val = parseFloat(returnOffsetWidth(_elem));
                val -= parseFloat(returnCSSStyle(_elem, 'padding-left'));
                val -= parseFloat(returnCSSStyle(_elem, 'padding-right'));
                val = val + 'px';
                break;
            default:
                val = returnCSSStyle(_elem, _style);
                break; }
        if(needsRevert){ 
            if (softRevert) {
                _elem.style.display = '';
            } else {
                _elem.style.display = 'none'; 
            }
        }
        return val; };


}
