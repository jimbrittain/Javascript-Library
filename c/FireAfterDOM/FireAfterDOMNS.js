"use strict";
/*global __imns, window, document, console, clearTimeout, setTimeout, $, jquery, MutationObserver */
//both property change versions require a attribute to be created on body to denote ajaxfinished;
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('FireAfterDOM' in adr)){

    
    adr.FireAfterDOMMethod = function(args){
        this.name = "";
        this.tested = false;
        this.valid = false;
        this.created = false;
        this._create = null;
        this._recreate = null;
        this._remove = null;
        this._test = null;
        this.needsRebuild = false;
        this.init(args); };
    adr.FireAfterDOMMethod.prototype.test = function(){
        if(this.tested){
            return this.valid;
        } else {
            if(typeof this._test === 'function'){
                this.tested = true;
                this.valid = this._test();
                return this.valid;
            } else { return false; }}};
    adr.FireAfterDOMMethod.prototype.create = function(){ 
        if(!this.created){
            if(this.tested && this.valid){
                if(typeof this._create === 'function'){
                    return this._create();
                } else { return false; }
            } else { return false; }
        } else if(this.needsRebuld || typeof this._recreate === 'function'){
            if(typeof this._recreate === 'function'){
                return this._recreate();
            } else {
                if(typeof this._create === 'function'){
                    return this._create();
                } else { return false; }}
        } else { return true; }};
    adr.FireAfterDOMMethod.prototype.recreate = function(){
        if(typeof this._recreate === 'function'){ 
            return this._recreate(); 
        } else if(this.needsRebuild && typeof this._create === 'function'){
            return this._create();
        } else { return false; }};
    adr.FireAfterDOMMethod.prototype.remove = function(){ 
        if(this.created){
            if(typeof this._remove === 'function'){
                return this._remove();
            } else { return false; }
        } else { return false; }};
    adr.FireAfterDOMMethod.prototype.init = function(obj){
        if(typeof obj === 'object'){
            this.name = ('name' in obj) ? obj.name : "";
            this._test = ('test' in obj && typeof obj.test === 'function') ? obj.test : null;
            this._create = ('create' in obj && typeof obj.create === 'function') ? obj.create : null;
            this._recreate = ('recreate' in obj && typeof obj.recreate === 'function') ? obj.recreate : null;
            this.needsRebuild = ('rebuild' in obj && obj.rebuild) ? true : false;
            this._remove = ('remove' in obj && typeof obj.remove === 'function') ? obj.remove : null; }};
    adr.FireAfterDOMMethods = function(){
        var uc = __imns('util.classes');
        if(uc.FireAfterDOMMethods.prototype.singleton){ return uc.FireAfterDOMMethods.prototype.singleton; }
        uc.FireAfterDOMMethods.prototype.singleton = this;
        this.list = []; };
    adr.FireAfterDOMMethods.prototype.add = function(obj){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        if(obj instanceof uc.FireAfterDOMMethod){
            if(!this.find(obj.name)){
                this.list.push(obj);
                return true;
            } else { return false; }
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOMMethods.add: Must be supplied a valid method");
            return false; }};
    adr.FireAfterDOMMethods.prototype.remove = function(o){
        var uc = __imns('util.classes'),
            udb = __imns('util.debug');
        var i = 9;
        if(o instanceof uc.FireAfterDOMMethod){
            for(i=0; i<this.list.length; i+=1){
                if(this.list[i] === o){
                    this.list.splice(i, 1);
                    return true; }}
        } else if(typeof o === 'string'){
            for(i=0; i<this.list.length; i += 1){
                if(this.list[i].name === o){
                    this.list.splice(i, 1);
                    return true; }}
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOMMethods.remove: Must be supplied a valid method or method name");
            return false; }};
    adr.FireAfterDOMMethods.prototype.find = function(name){
        for(var i=0, imax = this.list.length; i<imax; i += 1){
            if(this.list[i].name === name){ return this.list[i]; }}
        return false; };
    adr.FireAfterDOM = function(hardEnable){
        var uc = __imns('util.classes');
        if(uc.FireAfterDOM.prototype.singleton){ return uc.FireAfterDOM.prototype.singleton; }
        uc.FireAfterDOM.prototype.singleton = this;
        this.enabled = false;
        this.hardEnable = (!hardEnable) ? false : true;
        this.methods = new uc.FireAfterDOMMethods();
        this.started = false;
        this.debugMethod = null;
        this.functional = true;
        this.processing = false;
        this.functionsList = []; };
    adr.FireAfterDOM.prototype.determineMethod = function(){
        var udb = __imns('util.debug');
        while(this.debugMethod === null && this.methods.list.length > 0){
            if(this.methods.list[0].test()){
                try {
                    if(this.methods.list[0].create()){ 
                        this.debugMethod = this.methods.list[0].name;
                        this.functional = true;
                        return this.debugMethod;
                    } else { this.methods.remove(this.methods.list[0]); }
                } catch(e) { this.methods.remove(this.methods.list[0]); }
            } else { this.methods.remove(this.methods.list[0]); }}
        if(this.debugMethod !== null){
            return this.debugMethod;
        } else {
            this.functional = false;
            (new udb.IMDebugger()).pass("FireAfterDOM is unable to function based on these methods and these conditions;");
            return false; }};
    adr.FireAfterDOM.prototype.enable = function(){
        var udb = __imns('util.debug');
        if(this.determineMethod()){
            this.enabled = true;
            this.methods.find(this.determineMethod()).create();
        } else {
            (new udb.IMDebugger()).pass("Unable to determine method in FireAfterDOM");
        }};
    adr.FireAfterDOM.prototype.disable = function(){ this.enabled = false; };
    adr.FireAfterDOM.prototype.isAble = function(){ return (this.methods.length > 0 && (this.functionsList > 0 || this.hardEnable)) ? true : false; };
    adr.FireAfterDOM.prototype.fire = function(){
        if(!this.processing){ //processing stops multiple firing based on functionList ajax/innerHTML injection
            //this needs a debounce funcion on it to ensure it doesn't get stuck in an infinite loop;
            this.processing = true;
            for(var i=0; i<this.functionsList.length; i += 1){
                var good = true;
                if(typeof this.functionsList[i] === "function"){
                    try {
                        this.functionsList[i]();
                    } catch(e) { good = false; }
                } else { good = false; }
                if(!good){ this.functionsList.splice(i, 1); i -= 1; }}
            this.processing = false; }};
    adr.FireAfterDOM.prototype.priorityAdd = function(fun){
        var udb = __imns('util.debug');
        if(typeof fun === "function"){
            return this.add(fun, true);
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOM.priorityAdd: Requires a function.");
        }};
    adr.FireAfterDOM.prototype.add = function(fun, priority){
        var udb = __imns('util.debug');
        priority = (priority === undefined || !priority) ? false : true;
        var good = false;
        if(typeof fun === "function"){
            if(this.indexOf(fun) === -1){
                if(priority){ this.functionsList.unshift(fun); } else { this.functionsList.push(fun); }
                good = true;
            } else {
                if(priority){
                    this.functionsList.splice(this.indexOf(fun), 1);
                    this.functionsList.unshift(fun);
                    good = true;
                } else { good = false; }}
            if(good){
                this.enable();
                return true;
            } else { return false; }
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOM.add: Requires a function.");
        }};
    adr.FireAfterDOM.prototype.remove = function(fun){
        var udb = __imns('util.debug');
        if(typeof fun === "function"){
            if(this.indexOf(fun) !== -1){
                this.functionsList.splice(this.indexOf(fun), 1);
                if(!this.isAble()){ this.disable(); }
                return true;
            } else { return false; }
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOM.remove: Requires a function.");
        }};
    adr.FireAfterDOM.prototype.indexOf = function(fun){
        var udb = __imns('util.debug');
        if(typeof fun === "function"){
            var pos = -1;
            for(var i=0, imax = this.functionsList.length; i<imax; i+=1){
                if(this.functionsList[i] === fun){
                    pos = i;
                    break; }}
            return pos;
        } else {
            (new udb.IMDebugger()).pass("FireAfterDOM.remove: Requires a function.");
        }};
    var fadMethods = new adr.FireAfterDOMMethods();
    fadMethods.add(
        new adr.FireAfterDOMMethod({
            'name' : 'MutationObserver',
            'test' : function(){ return ('MutationObserver' in window) ? true : false; }, 
            'create' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                var uc = __imns('util.classes');
                var c = new uc.FireAfterDOM();
                try {
                    this.mutationObserver = new MutationObserver(
                        function(e){
                            for(var i=0, imax = e.length; i<imax; i += 1){
                                if(e[i].addedNodes.length > 0){
                                    c.started = true;
                                    break; }}
                            if(c.started){ c.fire(); }});
                    this.mutationObserver.observe(theBody, {childList : true});
                    this.created = true;
                    return true;
                } catch(e) { return false; }
            },
            'remove' : function(){
                this.mutationObserver.disconnect();
            }, 
            'recreate' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                this.mutationObserver.observe(theBody, {childList : true});
            }
        })
    );
    fadMethods.add(
        new adr.FireAfterDOMMethod({
            'name' : 'MutationEvent', 
            'test' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                if('addEventListener' in theBody){
                    return true;
                } else { 
                    return false;
                }
            }, 
            'create' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                var uc = __imns('util.classes');
                var c = new uc.FireAfterDOM();
                try {
                    theBody.addEventListener("DOMNodeInserted", 
                        function(e){
                            c.started = true;
                            c.fire();
                    });
                    this.created = true;
                    return true;
                } catch(e) {
                    this.valid = false;
                    return false;
                }
            }, 
            'rebuild' : false
        })
    );
    fadMethods.add(
        new adr.FireAfterDOMMethod({
            'name' : 'HTCBehavior',
            'test' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                if('addBehavior' in theBody && 'attachEvent' in theBody){
                    return true;
                } else {
                    return false;
                }
            },
            'create' : function(){
                try {
                    var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                    var uc = __imns('util.classes');
                    var c = new uc.FireAfterDOM();
                    theBody.addBehavior("noneexistentfile.htc");
                    theBody.attachEvent("onpropertychange", function(e){
                        c.started = true;
                        c.fire(); });
                    this.created = true;
                    return true;
                } catch(e) {
                    this.valid = false;
                    return false;
                }
            },
            'rebuild' : false
        })
    );
    fadMethods.add(
        new adr.FireAfterDOMMethod({
            'name' : 'propertyChange',
            'test' : function(){
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                if('onpropertychange' in theBody){ return true; } else { return false; }
            }, 
            'create' : function(){
                var uc = __imns('util.classes');
                var c = new uc.FireAfterDOM();
                var theBody = ('getElementsByTagName' in document) ? document.getElementsByTagName('body')[0] : ((document.all) ? document.all.tags('body')[0] : null);
                try {
                    theBody.onpropertychange = function(e){
                        if(e.propertyName === 'innerHTML'){
                            c.started = true;
                            c.fire(); }};
                    this.created = true;
                    return true;
                } catch(e) {
                    return false;
                }
            }, 
            'rebuild' : false
        })
    );
    fadMethods.add(
        new adr.FireAfterDOMMethod({
            'name' : 'jQuery',
            'test' : function(){
                if('jQuery' in window){ return true; } else { return false; }
            }, 
            'create' : function(){
                var uc = __imns('util.classes');
                var c = new uc.FireAfterDOM();
                try {
                    $(document).ajaxComplete(
                        function(){
                            this.ajaxTimeout = setTimeout(function(){ if(c.started){ c.fire(); }}, 2000);
                        });
                    $(document).ajaxStart(
                        function(){
                            if(this.ajaxTimeout !== null){ clearTimeout(this.ajaxTimeout); this.ajaxTimeout = null; } 
                            c.started = true; }
                    );
                    this.created = true;
                    return true;
                } catch(e) { 
                    this.valid = false;
                    return false;
                }
            }, 
            'rebuild' : false
        })
    );


}
