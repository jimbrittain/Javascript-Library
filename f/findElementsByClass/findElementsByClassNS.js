"use strict";
/* global document, __imns, */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findElementsByTagAndClass' in adr)){
    /**
     @module findElementsByTagAndClass, findElementsByClass, findElementsByTag

     @method findElementsByTagAndClass
     @param _tag {String} - either ''/'*' for all, or by tagname
     @param _class {String} - optional, className to find
     @return {Array} containing HTMLElements or empty array*
     */
    adr.findElementsByTagAndClass = function(_tag, _class){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes'),
            i=0, imax=0;
        _tag = (_tag === '') ? '*' : _tag;
        _class = (_class !== undefined) ? _class : '';
        if(ud.findElementsByTagAndClass.prototype.choice === undefined){ ud.findElementsByTagAndClass.prototype.doChoice(); }
        var checkArray = [], returnArray = [];
        checkArray = ud.findElementsByTagAndClass.prototype.choice(_tag);
        if(_class !== ''){
            for(i=0, imax = checkArray.length; i < imax; i += 1){
                if(ud.hasClass(checkArray[i], _class)){
                    returnArray.push(checkArray[i]); }}
            return returnArray;
        } else {
            for(i=0, imax = checkArray.length; i < imax; i += 1){ returnArray.push(checkArray[i]); }
            return returnArray; }};

    adr.findElementsByTagAndClass.prototype.doChoice = function(){
        var ud = __imns('util.dom');
        if('getElementsByTagName' in document){
            ud.findElementsByTagAndClass.prototype.choice = function(_t){
                _t = (_t === '') ? '*' : _t;
                return document.getElementsByTagName(_t); };
        } else if('all' in document){
            ud.findElementsByTagAndClass.prototype.choice = function(_t){
                if(_t === '' || _t === '*'){
                    return document.all;
                } else { return document.all[_t]; }};
        } else if('layers' in document){
            ud.findElementsByTagAndClass.prototype.choice = function(_t){
                if(_t === '' || _t === '*'){
                    return document.layers;
                } else { return document.layers[_t]; }};
        }};

    adr.findElementsByTag = function(_tag){
        var ud = __imns('util.dom');
        if(typeof _tag !== 'string' || _tag.length < 1){ return []; }
        return ud.findElementsByTagAndClass(_tag); };
    adr.findElementsByClass = function(_class){
        var ud = __imns('util.dom');
        if(typeof _class !== 'string' || _class.length < 1){ return []; }
        return ud.findElementsByTagAndClass('*', _class);
    };


}
