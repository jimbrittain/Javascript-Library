"use strict";
/* global window, IMDebugger, $, __imns, console, document */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CustomEvent' in adr)){
    adr.CustomEventMaster = function(){
        var uc = __imns('util.classes');
        if(uc.CustomEventMaster.prototype.singleton !== undefined){ return uc.CustomEventMaster.prototype.singleton; }
        uc.CustomEventMaster.prototype.singleton = this;
        this.events = []; };
    adr.CustomEventMaster.prototype.getName = function(name){
        if((__imns('util.validation')).isString(name)){
            return name;
        } else if(name instanceof (__imns('util.classes')).CustomEvent){ return name.name; }
        return false; };
    adr.CustomEventMaster.prototype.findId = function(name){
        name = this.getName(name);
        if(name !== false){
            for(var i=0, imax=this.events.length; i<imax; i+=1){
                if(name === this.events[i].name){
                    return i; }}}
        return -1; };
    adr.CustomEventMaster.prototype.find = function(name){
        var found = -1;
        name = this.getName(name);
        if(name !== false){ 
            found = this.findId(name); }
        return (found !== -1) ? this.events[found] : null; };
    adr.CustomEventMaster.prototype.exists = function(name){
        var uc = __imns('util.classes');
        var found = false;
        name = this.getName(name);
        if(name !== false){
            found = this.find(name);
            return (found instanceof uc.CustomEvent) ? true : false; }
        return false; };
    adr.CustomEventMaster.prototype.add = function(ce){
        var uc = __imns('util.classes');
        if(ce instanceof uc.CustomEvent){
            if(!this.exists(ce.name)){
                ce.build();
                this.events.push(ce);
                return this.events[this.events.length - 1];
            } else {
                var existing = this.find(ce.name);
                for(var prop in ce.data){
                    if(ce.data.hasOwnProperty(prop)){ existing.data[prop] = ce.data[prop]; }}
                return existing;
            }}
        return false; };
    adr.CustomEventMaster.prototype.remove = function(name){
        var uc = __imns('util.classes');
        name = this.getName(name);
        if(name !== false){
            var found = this.findId(name);
            if(found !== -1){
                this.events.splice(found, 1);
                return true; }}
        return false; };

    adr.CustomEvent = function(name, data){
        this.name = '';
        this.data = {};
        this.built = false; 
        this.master = null;
        this.evt = null;
        return this.init(name, data); };
    adr.CustomEvent.prototype.valid = function(){ return ((__imns('util.validation')).isString(this.name)); };
    adr.CustomEvent.prototype.init = function(name, data){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        this.master = new uc.CustomEventMaster();
        var defaultArgs = {
                name: null,
                data: null },
            obj = {};
        if(data === undefined && typeof name === 'object'){
            obj = ut.handlePassedArguments(name, defaultArgs);
        } else {
            obj.name = name;
            obj.data = data; }
        this.name = (uv.isString(obj.name)) ? obj.name : null;
        this.addData(obj.data);
        if(this.name !== null && this.name.length > 0){
            return this.master.add(this);
        } else { return false; }};
    adr.CustomEvent.prototype.addData = function(o){
        var ut = __imns('util.tools');
        if(o !== null && o !== undefined){
            if(typeof o === 'object'){
                for(var prop in o){
                    if(o.hasOwnProperty(prop)){ 
                        this.data[prop] = o[prop]; }}
                return true;
            } else {
                var hasSet = false, i = 0;
                while(!hasSet && i < 1000){
                    if(this.data[i] === undefined){
                        this.data[i] = o;
                        hasSet = true; }
                    i += 1; }
                return hasSet; }}
        return false; };
    adr.CustomEvent.prototype.fire = function(elem){
        var uv = __imns('util.validation'),
            udb = __imns('util.debug');
        if(this.built && this.evt !== null){
            if(uv.isHTMLElement(elem) || elem === window || elem === document){
                elem.dispatchEvent(this.evt);
            } else {
                (new udb.IMDebugger()).pass('Custom Event "' + this.name + '" failed to fire, element is invalid'); }
        } else {
            (new udb.IMDebugger()).pass('Custom Event "' + this.name + '" failed to fire, no event/unbuilt');
            return false; }};
    adr.CustomEvent.prototype.build = function(){
        if(!this.built && this.evt === null){
            this.built = true;
            if('CustomEvent' in window && typeof window.CustomEvent === 'function'){
                this.evt = new window.CustomEvent(this.name, {'detail': this.parseData() });
            } else if('createEvent' in document){
                //this.evt = document.createEvent(this.name);
                this.evt = document.createEvent('HTMLEvents');
                this.evt.initEvent(this.name, true, true);
            } else if('Event' in window) {
                this.evt = new window.Event(this.name); }}};
    adr.CustomEvent.prototype.parseData = function(){
        var str = '{';
        for(var prop in this.data){
            if(this.data.hasOwnProperty(prop)){
                str += "'" + prop + "':'" + "',"; }}
        str = (str.length > 1) ? str.substring(0, (str.length - 1)) : str;
        str += '}';
        return str; };
    (__imns('util.tools')).createEvent = function(name, data){ return (new (__imns('util.classes')).CustomEvent(name, data)); };
    (__imns('util.tools')).fireElementEvent = function(elem, name, data){
        var uc = __imns('util.classes');
        if(name instanceof uc.CustomEvent){
            name.fire(elem);
        } else {
            var f = new uc.CustomEvent(name, data);
            return (f instanceof uc.CustomEvent) ? f.fire(elem) : false; }};
    (__imns('util.tools')).getEventDetails = function(evt){
        if('type' in evt){
            var cem = new (__imns('util.classes')).CustomEventMaster();
            if(cem.exists(evt.type)){
                return (cem.find(evt.type)).data; }}
        return {}; };
}
