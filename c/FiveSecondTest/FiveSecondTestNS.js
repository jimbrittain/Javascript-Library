"use strict";
/* global __imns, window, document */
(function(){
    var adr = __imns('component.classes');
    adr.FiveSecondTester = function(a){
        if(adr.FiveSecondTester.prototype.singleton !== undefined){
            return adr.FiveSecondTester.prototype.singleton; }
        adr.FiveSecondTester.prototype.singleton = this;
        this.timeout = null;
        this.on = -1;
        this._testareaname = 'testarea';
        this.tests = [];
        if(a !== undefined){ this.setTests(a); }};
    adr.FiveSecondTester.prototype.setTests = function(tests){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var startNum = this.tests.length;
        tests = (uv.isArray(tests)) ? tests : [tests];
        for(var i=0, imax=tests.length; i<imax; i+=1){
            var n = new cc.FiveSecondTest(tests[i]);
            if(n.isValid()){ this.tests.push(n); }}
        return (this.tests.length !== startNum);
    };
    adr.FiveSecondTester.prototype.getTestArea = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var elem = ud.findElementById(this._testareaname);
        return (elem !== undefined && uv.isHTMLElement(elem)) ? elem : undefined; };
    adr.FiveSecondTester.prototype.testAreaExists = function(){
        return (this.getTestArea() !== undefined) ? true : false; };
    adr.FiveSecondTester.prototype.buildTestArea = function(){
        if(!this.testAreaExists()){
            //create element,
            //  create attrs, .testarea, #_testareaname
            //  inject into page
            return true;
        }
        return false; };
    adr.FiveSecondTester.prototype.showTest = function(test){
        var cc = __imns('component.classes');
        test = (test === undefined || !(test instanceof cc.FiveSecondTest)) ? this.nextTest() : test;
        if(test !== null){
            //show test code;
            return true; }
        return false; };
    adr.FiveSecondTester.prototype.nextTest = function(){
        this.on += 1;
        if(this.on >= this.tests.length){
            this.finishTests();
            return null; }
        return this.tests[this.on];
    };
    adr.FiveSecondTester.prototype.clearTime = function(){
        if(this.timeout !== null){
            window.clearTimeout(this.timeout);
            this.timeout = null; 
            return true; }
        return false; };
    adr.FiveSecondTest = function(testfile, question){
        this._testfile = '';
        this._question = '';
    };
    adr.FiveSecondTest.prototype.defaultQuestion = 'Click when you are ready to start&#8230;';
    adr.FiveSecondTest.prototype.isValid = function(){ return (this._testfile !== ''); };
    adr.FiveSecondTest.prototype.setTestFile = function(testfile){
        var uv = __imns('util.validation');
        if(uv.isString(testfile)){
            this._testfile = testfile;
            return true; } 
        return false; };
    adr.FiveSecondTest.prototype.setQuestion = function(question){
        var uv = __imns('util.validation');
        if(uv.isString(question)){
            this._question = question;
            return true; }
        return false; };
    adr.FiveSecondTest.prototype.getQuestion = function(){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        return (uv.isString(this._question)) ? this._question : cc.FiveSecondTest.prototype.defaultQuestion; };
    adr.FiveSecondTest.prototype.whatTest = function(){
        var ut = __imns('util.tools');
        if(this.isValid()){
            var extension = (new ut.PathInfo(this._testfile)).extension;
            switch(extension){
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':
                case 'svg':
                case 'tif':
                    return 'img';
                default:
                    return 'file'; }}
        return false; };
    adr.FiveSecondTest.prototype.runTest = function(next){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        next = (uv.isFunction(next)) ? next : (new cc.FiveSecondTester()).next;
        if(this.isValid()){
            var fst = new cc.FiveSecondTester();
            fst.clearTime();
            fst.timeout = window.setTimeout(next, 5000);
        } else { next(); }};
})();
