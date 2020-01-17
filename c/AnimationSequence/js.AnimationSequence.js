"use strict";
/* global AnimationSequenceStep, parseTimeToMS, setInterval, clearInterval, Animation, isNumber, isFunction */
/*
 * AnimationSequence
 *  kill
 *  addStep
 *  addAnimation
 * AnimationSequenceSteps
 */
function AnimationSequence(){
    this.onStep = -1;
    this.steps = [];
    this.active = false;
    this.playing = false;
}
AnimationSequence.prototype.addStep = function(a){
    this.steps.push(new AnimationSequenceStep());
    if(a instanceof Animation){ this.addAnimation(a); }};

AnimationSequence.prototype.addAnimation = function(a){
    if(a instanceof Animation){
        this.lastAddedStep(true).addAnimation(a); }};

AnimationSequence.prototype.lastAddedStep = function(b){
    if(this.steps.length < 1){
        if(b !== undefined && b === true){
            this.steps.push(new AnimationSequenceStep());
            return this.steps[0];
        } else { return null; }
    } else { return this.steps[this.steps.length - 1]; }};

AnimationSequence.prototype.findStepId = function(s){
    var i = 0, imax = this.steps.length;
    if(s instanceof AnimationSequenceStep){
        for(i = 0, imax = this.steps.length; i<imax; i += 1){
            if(s === this.steps[i]){ return i; }
        }
    } else if(isNumber(s) && Math.round(s) && s > 0 && s < this.steps.length){
        return i;
    } else if(typeof s === 'string' && s.length > 0){
        for(i = 0, imax = this.steps.length; i<imax; i += 1){
            if(s === this.steps[i].name){ return i; }}
    }
    return -1; };

AnimationSequence.prototype.findStep = function(s){
    var n = this.findStepId(s);
    if(n !== -1){ return this.steps[n]; }
    return undefined; };

AnimationSequence.prototype.currentStep = function(){
    if(this.onStep !== -1 && this.onStep > -1 && this.onStep < this.steps.length){
        return this.findStep(this.onStep);
    } else {
        return this.lastAddedStep(true); }};

AnimationSequence.prototype.nextStepId = function(){
    var n = this.onStep + 1;
    return (n < this.steps.length) ? n : undefined; };

AnimationSequence.prototype.previousStepId = function(){
    var n = this.onStep - 1;
    return (n > -1) ? n : undefined; };

AnimationSequence.prototype.nextStep = function(){
    var n = this.nextStepId();
    return (n !== undefined) ? this.steps[n] : null; };

AnimationSequence.prototype.previousStep = function(){
    var n = this.previousStepId();
    return (n !== undefined) ? this.steps[n] : null; };

AnimationSequence.prototype.goToPreviousStep = function(){
    var n = this.previousStepId();
    if(n !== undefined){ this.goToStep(n, 'auto'); }};

AnimationSequence.prototype.goToNextStep = function(){
    var n = this.nextStepId();
    if(n !== undefined){ this.goToStep(n, 'auto'); }};

AnimationSequence.prototype.goToStep = function(s, t){
    if(this.findStep(s) !== undefined){
        this.steps[this.onStep].stop();
        this.onStep = this.findStepId(s);
        switch(t){
            case 'play':
            case 'run':
                this.currentStep().play();
                break;
            case 'stop':
            case 'end':
                this.currentStep().stop();
                break;
            case 'auto':
            case '':
                if(this.playing){ this.currentStep().play(); }
                break; }
        return true;
    } else { return false; }};

AnimationSequence.prototype.play = function(){
    this.start();
    this.currentStep().play(); };
AnimationSequence.prototype.start = function(){
    this.timer().go();
};

function AnimationSequenceStep(){
    this.name = '';
    this.start = -1;
    this.end = -1;
    this.animations = [];
}
AnimationSequenceStep.prototype.setStartTime = function(n){
};




function Timer(){
    this._intervalID = -1;
    this._timestart = 0;
    this._reserve = 0;
    this._running = false;
    this.interval = Math.floor(1000/24); //defaults to 24fps;
}
Timer.prototype.start = function(){ 
    this._timestart = (new Date()).getTime();
    this.startInterval(); };
Timer.prototype.go = Timer.prototype.start;
Timer.prototype.end = function(){
    this._reserve += this.elasped();
    this.stopInterval();
    this._timestart = 0; };
Timer.prototype.stop = Timer.prototype.end;
Timer.prototype.pause = function(){
    if(this._running){
        this.end();
    } else { this.start(); }};
Timer.prototype.elapsed = function(){
    var now = (new Date()).getTime();
    return (now > this.getStart()) ? now - this.getStart() : 0; };
Timer.prototype.getStart = function(){
    if(this._timestart === 0){
        return (new Date()).getTime();
    } else { return this._timestart(); }};
Timer.prototype.addListener = function(f){
    if(isFunction(f)){
        for(var i = 0, imax = this.listeners.length; i<imax; i += 1){
            if(this.listeners[i] === f){ return false; }}
        this.listeners.push(f);
        return true;
    } else { return false; }};
Timer.prototype.removeListener = function(f){
    var toRemove = -1;
    if(isNumber(f) && Math.floor(f) === f && f > -1 && f < this.listeners.length){
        toRemove = f;
    } else if(isFunction(f)){
        for(var i=0, imax=this.listeners.length; i<imax; i+=1){
            if(f === this.listeners[i]){
                toRemove = i;
                break; }}}
    if(toRemove !== -1){
        this.listeners.splice(toRemove, 1);
        return true;
    } else { return false; }};
Timer.prototype.setInterval = function(n){
    var ms = parseTimeToMS(n);
    if(isNumber(ms)){ this.interval = ms; }};
Timer.prototype.startInterval = function(){
    this.stopInterval();
     var c = this;
    this._running = true;
    this._intervalID = setInterval(c.clicker, this.interval); };
Timer.prototype.stopInterval = function(){
    if(this._intervalID === -1){
        clearInterval(this._intervalID);
        this._running = false;
        this._intervalID = -1; }};
Timer.prototype.clicker = function(){
    if(this.listeners.length > 0){
        var c = this, i, imax;
        var timenow = this._reserve + this.elapsed();
        for(i=0, imax = this.listeners.length; i<imax; i+=1){
            try {
                this.listeners[i](timenow);
            } catch(e){ c.removeListener(i); }}}};
//todo removeListener id or function match, setInterval, either global fps, should accept x'fps', x's', x'ms';
//ms, s, m, fps, h, d
function parseTimeToMS(s){
    function singleparse(s){
        var matches = [], reg = /^([0-9]+(?:\.[0-9]+){0,1})(?:\ ){0,1}(ms|s|m|h|d|fps)$/;
        matches = s.match(reg);
        if(matches[0]){
            switch(matches[2]){
                case 'fps':
                    return Math.round(matches[1]);
                case 'ms':
                    return matches[1];
                case 's':
                    return matches[1] * 1000;
                case 'm':
                    return matches[1] * 60 * 1000;
                case 'h':
                    return matches[1] * 60 * 60 * 1000;
                case 'd':
                    return matches[1] * 24 * 60 * 60 * 1000;
                case '':
                    //doesn't get here need to look at RegEx;
                    if(Math.round(matches[1]) === matches[1]){
                        return matches[1]; //assume ms;
                    } else {
                        return matches[1] * 1000; //assume seconds;
                    }
                    break;
                default:
                    return 0;
            }
        }
        return 0; }
    var reg = /(([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}ms)|([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}s)|([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}h)|([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}m)|([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}d)|([0-9]+(?:\.[0-9]+){0,1}(?:\ ){0,1}fps))/g; 
    var matches = [];
    if(isNumber(s)){
        var t = 0;
    } else {
        matches = s.match(reg);
    }
}

