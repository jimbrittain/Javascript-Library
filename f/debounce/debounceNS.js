"use strict";
/*global setInterval, clearInterval, __imns */
(function(){
    var adr = __imns('util.classes'),
        ut = __imns('util.tools');
    // var adr = window; //for stand-alone delete above and uncomment this line
    if(!('Debouncer' in adr)){
        /**
         * @module Debounce
         * @class Debouncer
         * @singleton
         **/
        adr.Debouncer = function(){
            var uc = __imns('util.classes');
            if(uc.Debouncer.prototype.singleton !== undefined){ return uc.Debouncer.prototype.singleton; }
            uc.Debouncer.prototype.singleton = this;
            this.f = []; };
        /**
         * @module Debounce
         * @class Debouncer
         * @method Debouncer.find
         * @param f {Function}
         * @param t {Number} time
         * @return Instance of Debounced from within Debouncer
         **/
        adr.Debouncer.prototype.find = function(f, t){
            var uc = __imns('util.classes');
            var d = false;
            for(var i=0, imax = this.f.length; i<imax; i += 1){ if(this.f[i].func === f){ d = true; return this.f[i]; }}
            if(!d){
                this.f.push(new uc.Debounced(f, t));
                return this.f[this.f.length - 1]; }};
        /**
         * @module Debounce
         * @class Debounced
         * @param func {Function}
         * @param t {Number}
         **/
        adr.Debounced = function(func, t){
            var uv = __imns('util.validation');
            this.func = func;
            this.interval = null;
            this.time = (uv.isNumber(t) && Math.floor(t) === t) ? t : 1000;
            this.has = false;
            this.set = function(){ 
                if(this.interval === null){
                    this.has = false;
                    this.clear();
                    var c = this;
                    this.interval = setInterval(function(){ c.apply(); c.has = false; }, this.time); 
                } else { this.has = true; }};
            this.apply = function(){
                this.func();
                if(!this.has){ this.clear(); }};
            this.clear = function(){ if(this.interval !== null){ clearInterval(this.interval); this.interval = null; this.has = false; }};
        };
        adr.Debounced.prototype.setTime = function(t){
            var uv = __imns('util.validation'),
                ut = __imns('util.tools');
            if(uv.isNumber(t)){
                this.time = Math.floor(t);
            } else {
                t = ut.returnTime(t);
            }
        };
        /**
            @function debounce
            @param fun {Function}
            @param t {Number} time in ms
            @return
        **/
        ut.debounce = function(fun, t){
            var uc = __imns('util.classes');
            return (new uc.Debouncer()).find(fun, t).set(); };


    }
})();
