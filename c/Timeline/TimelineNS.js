"use strict";
/* global window, IMDebugger, $, __imns, setTimeout, clearTimeout */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Timeline' in adr)){
    adr.Timeline = function(){
        this.playing = false;
        this.starttime = null;
        this.maxtime = null;
        this.sequence = [];
        this.hasError = false;
        this.onSequence = -1;
        this._startfunction = null;
        this._endfunction = null;
        this._errorfunction = null;
        this._fallbackfunction = null;
        this.time = null;
    };
    adr.Timeline.prototype.start = function(){ 
        if(this._startfunction !== null && (__imns('util.validation')).isFunction(this._startfunction)){ 
            this._startfunction(); }
        this.onSequence = -1;
        this.playing = true;
        this.starttime = (new Date()).getTime();
        this.nextInSequence(); };
    adr.Timeline.prototype.end = function(){
        if(this._endfunction !== null && (__imns('util.validation')).isFunction(this._endfunction)){
           this._endfunction(); }
        this.clearTime();
        this.playing = false;
        this.starttime = null; };
    adr.Timeline.prototype.fallback = function(){
        if(this._fallbackfunction !== null && (__imns('util.validation')).isFunction(this._fallbackfunction)){
            this._fallbackfunction(); }};
    adr.Timeline.prototype.error = function(){
        this.hasError = true;
        this.playing = false;
        this.starttime = null;
        this.clearTime();
        if(this._errorfunction !== null && (__imns('util.validation')).isFunction(this._errorfunction)){
            this._errorfunction(); }
        this.fallback(); };
    adr.Timeline.prototype.setFunction = function(name, func){
        var uv = __imns('util.validation');
        if(func !== undefined && uv.isFunction(func) && uv.isString(name)){
            switch(name){
                case 'error':
                    this._errorfunction = func;
                    return true;
                case 'start':
                    this._startfunction = func;
                    return true;
                case 'end':
                    this._endfunction = func;
                    return true;
                case 'fallback':
                    this._fallbackfunction = func;
                    return true; }}
        return false; };
    adr.Timeline.prototype.checkElapsed = function(){
        if(this.maxtime !== null){
            var ontime = (new Date()).getTime();
            if((ontime - this.starttime) >= this.maxtime){
                (new (__imns('util.debug')).IMDebugger()).pass('Timeline has surpassed maximum allowed time');
                this.error(); }}};
    adr.Timeline.prototype.clearTime = function(){
        if(this.time !== null){
            clearTimeout(this.time);
            this.time = null; }};
    adr.Timeline.prototype.addToSequence = function(func, timeFromLast){
        var cc = __imns('component.classes');
        var s = cc.TimelineEvent(func, timeFromLast);
        if(s === false){
            return false;
        } else {
            this.sequence.push(s);
            return true; }};
    adr.Timeline.prototype.nextInSequence = function(overide){
        overide = (overide === undefined && overide !== true) ? false : true;
        if(this.playing && !this.hasError){
            this.checkElapsed();
            if(!this.hasError){
                this.onSequence += 1;
                if(this.onSequence < this.sequence.length){
                    var s = this.sequence[this.onSequence],
                        c = this;
                    if(s.timing !== 'wait'){
                        this.clearTime();
                        this.time = setTimeout(
                            function(){ c.doSequenceEvent(); },
                            s.timing);
                    }
                } else { this.end(); }}}};
    adr.Timeline.prototype.doSequenceEvent = function(){
        var s = this.sequence[this.onSequence];
        s.run();
        this.nextInSequence(); };
    adr.Timeline.prototype.waiting = function(){
        var c = this;
        return (function(){ c.doSequenceEvent(); }); };

    adr.TimelineEvent = function(func, timeFromLast){
        var w = false;
        this._function = null;
        this.timing = 0;

        var uv = (__imns('util.validation'));
        if(timeFromLast === undefined){
            if(typeof func === 'object' && !uv.isFunction(func)){
                if(uv.isArray(func) && func.length === 2){
                    w = (this.setFunction(func[0]) && this.setTiming(func[1])) ? true : false;
                } else if('func' in func && 'timing' in func){
                    w = (this.setFunction(func.func) && this.setTiming(func.timing)) ? true : false; }}
        } else {
            w = (this.setFunction(func) && this.setTiming(timeFromLast)) ? true : false; }
        if(!w){ return false; }};
    adr.TimelineEvent.prototype.setFunction = function(func){
        if(func !== undefined && (__imns('util.validation')).isFunction(func)){
            this._function = func;
            return true; }
        return false; };
    adr.TimelineEvent.prototype.setTiming = function(timing){
        var uv = __imns('util.validation');
        timing = (uv.isString(timing)) ? timing.toLowerCase() : timing;
        if(timing === 'wait' || timing === 'waiting'){
            this.timing = 'waiting';
            (new (__imns('util.debug')).IMDebugger()).pass('TimelineEvent is set to wait, on when the wait is finished call Timeline.waiting() to proceed to this event');
            return true;
        } else {
            if(uv.isNumber(timing) && timing > 0 && timing > 10){
                this.timing = timing;
                return true;
            } else if(uv.isString(timing)){
                var reg = /^(([0-9]+[\.]{0,1}){0,1}[0-9]+){1}(m|ms|s|h|d)$/;
                if(reg.test(timing)){
                    var arr = reg.exec(timing);
                    var calctime = arr[1];
                    switch(arr[3]){
                        case 's':
                            calctime *= 1000;
                            break;
                        case 'm':
                            calctime *= (1000 * 60);
                            break;
                        case 'h':
                            calctime *= (1000 * 60 * 60);
                            break;
                        case 'd':
                            calctime *= (1000 * 60 * 60 * 24);
                    }
                    this.timing = calctime; 
                    return true; }}}
        return false; };
    adr.TimelineEvent.prototype.run = function(){
        if(this._function !== null && (__imns('util.validation')).isFunction(this._function)){ this._function(); }};
}
