"use strict";
/* global window, IMDebugger, $, __imns, setTimeout, clearTimeout, document */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('HistoricKeyStrokes' in adr)){
    /**
      @module HistoricKeyStrokes
      @class HistoricKeyStrokes
      @singleton
      @constructor
      @develop - could try developing so can an to an object for individual events, would require removing singleton, creating element tie, and a master to control them all;
     **/
    adr.HistoricKeyStrokes = function(){
        var uc = __imns('util.classes');
        if(uc.HistoricKeyStrokes.prototype.singleton !== undefined){ return uc.HistoricKeyStrokes.prototype.singleton; }
        uc.HistoricKeyStrokes.prototype.singleton = this;
        this.pauseto = null;
        this.pausetime = 800;
        this.endto = null;
        this.endtime = 250;
        this.keys = [];
        this.endEvent = null;
        this.init(); };
    /**
      @method HistoricKeyStrokes.init
      @description - creates multikeypress event, fetters this creation to document
     **/
    adr.HistoricKeyStrokes.prototype.init = function(){
        var ut = __imns('util.tools');
        this.endEvent = ut.createEvent('keypresssequence', this.keys);
        var c = this;
        ut.fetter(document, 'DOMContentLoaded', [this, function(){ c.buildListener(); }], true, 'after'); };
    /**
      @method HistoricKeyStrokes.init
      @description - fetters keypress this.add to document
     **/
    adr.HistoricKeyStrokes.prototype.buildListener = function(){
        var ut = __imns('util.tools');
        var c = this;
        ut.fetter(document, 'keypress', [this, function(e){ c.add(e); }], true); };
    /**
      @method HistoricKeyStrokes.clearpause
      @description - clears pause if necessary, and clears end, as end should never be running if/when this check performed
    **/
    adr.HistoricKeyStrokes.prototype.clearpause = function(){
        if(this.pauseto !== null){
            clearTimeout(this.pauseto);
            this.pauseto = null; }
        if(this.endto !== null){
            this.keys = [];
            this.clearend(); }};
    /**
      @method HistoricKeyStrokes.clearend
      @description clears end, however does not remove keys, this is done on the this.end function
    **/
    adr.HistoricKeyStrokes.prototype.clearend = function(){
        if(this.endto !== null){
            clearTimeout(this.endto);
            this.endto = null; }};
    /**
      @method HistoricKeyStrokes.add
      @param e {Event}
      @description - creates and adds KeyStroke for current keypress, and adds to this.keys, sets up pause timeout
     **/
    adr.HistoricKeyStrokes.prototype.add = function(e){
        var uc = __imns('util.classes');
        var c = this,
            k = new uc.KeyStroke(e);
        this.clearpause();
        this.keys.push(k);
        this.pauseto = setTimeout(function(){ c.pause(); }, this.pausetime); };
    /**
      @method HistoricKeyStrokes.pause
      @description the keypresses have ceased for this.pausetime, hence can now begin end wait where either this.keys are deleted if new keys pressed or this.end
     **/
    adr.HistoricKeyStrokes.prototype.pause = function(){
        var c = this;
        this.clearpause();
        this.endto = setTimeout(function(){ c.end(); }, this.endtime); };
    /**
      @method HistoricKeyStrokes.end
      @description - fires multikeypress event on document, and supplies keys, clears end.
     **/
    adr.HistoricKeyStrokes.prototype.end = function(){
        var ut = __imns('util.tools');
        var a = this.keys;
        this.endEvent.addData({keys: a});
        ut.fireElementEvent(document, 'keypresssequence');
        this.keys = [];
        this.clearend(); };
    /**
     @method HistoricKeyStrokes.ask
     @return {Array} of KeyStroke Objects or an empty Array
    **/
    adr.HistoricKeyStrokes.prototype.ask = function(){ return (__imns('util.tools')).deepClone(this.keys); };
    /**
      @function util.tools.matchAgainstHistoricKeyStrokes
      @param v {String|Number|Array|KeyStroke}
      @param keys {Array|KeyStroke} - Array should be Array of KeyStroke objects
      @return {Boolean}
      @description attempts to match against historic keystrokes, hence 'abc' will match a key sequence of 'a', 'b' then 'c'
     **/
    (__imns('util.tools')).matchAgainstHistoricKeyStrokes = function(v, keys){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes');
        var possibleValues = function(s){
            var arr = [];
            if(uv.isString(s) || uv.isNumber(s)){
                arr.push(s);
            } else if(typeof s === 'object'){
                if('key' in s){ arr.push(s.key); }
                if('keyCode' in s){ arr.push(s.keyCode); }
                if('keyIdentifier' in s){ arr.push(s.keyIdentifier); }
                if('code' in s){ arr.push(s.code); }
                if('charCode' in s){ arr.push(s.charCode); }}
            return arr; };
        if(uv.isString(v) || uv.isNumber(v)){
            v = String(v);
            v = v.split(''); }
        keys = (keys instanceof uc.KeyStroke) ? [keys] : keys;
        if(uv.isArray(v) && uv.isArray(keys)){
            if(v.length === keys.length){
                var is = true, a, b, found = false;
                for(var i=0, imax = v.length; i<imax; i+=1){
                    a = possibleValues(v[i]);
                    b = possibleValues(keys[i]);
                    found = false;
                    for(var n=0, nmax = a.length; n<nmax; n+=1){
                        if(uv.isInArray(b, a[n])){
                            found = true;
                            break; }}
                    if(!found){
                        is = false;
                        break; }}
                return is; }}
        return false; };

    adr.KeyStroke = function(e){
        this.key = '';
        this.keyCode = '';
        this.keyIdentifier = '';
        this.code = '';
        this.charCode = '';
        if(e !== null){ this.init(e); }};
    adr.KeyStroke.prototype.init = function(e){
        this.key = ('key' in e) ? e.key : this.key;
        this.keyCode = ('keyCode' in e) ? e.keyCode : this.keyCode;
        this.keyIdentifier = ('keyIdentifier' in e) ? e.keyIdentifier : this.keyIdentifier;
        this.code = ('code' in e) ? e.code : this.code;
        this.charCode = ('charCode' in e) ? e.charCode : this.charCode; };
}
