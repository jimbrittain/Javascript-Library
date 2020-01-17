"use strict";
/* global window, IMDebugger, $, __imns, FormData, escape, console */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
/**
 * Not yet done file, blob, or proper checking. Also no renewal method currently
**/
if (!('IMFormData' in (__imns('util.classes')))) {
    (__imns('util.classes')).IMFormData = function(obj){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        this.segments = [];
        this.gathered = false;
        this.method = 'get';
        this.action = '';
        this.form = '';
        this.encoding = '';
        if(obj !== undefined && uv.isHTMLElement(obj) && ud.getTagName(obj) === 'form'){ this.setForm(obj); }
    };
    (__imns('util.classes')).IMFormData.prototype.gather = function(arr){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes');
        arr = (arr !== undefined && !uv.isArray(arr)) ? [arr] : arr;
        if(uv.isArray(arr)){
            for(var i=0, imax = arr.length; i<imax; i+=1){
                var seg = new uc.IMFormDataSegment(arr[i]);
                if(seg.valid){
                    this.segments.push(seg); }}
            this.gathered = true;
            return (this.segments.length > 0) ? true : false; }
        return false; 
    };
    (__imns('util.classes')).IMFormData.prototype.setForm = function(form){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(uv.isHTMLElement(form) && ud.getTagName(form) === 'form'){
            this.form = form;
            this.setEncoding();
            this.setAction();
            this.setMethod();
        }
    };
    (__imns('util.classes')).IMFormData.prototype.setMethod = function(method){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(method === undefined && uv.isHTMLElement(this.form)){
            method = ('method' in this.form) ? this.form.method : ud.getAttribute(this.form, 'method');
        }
        method = (uv.isString(method)) ? method.toLowerCase() : method;
        switch (method){
            case 'post':
                this.method = 'post';
                break;
            default:
                this.method = 'get'; }
        return true;
    };
    (__imns('util.classes')).IMFormData.prototype.setAction = function(act){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(act === undefined && uv.isHTMLElement(this.form)){
            act = ('action' in this.form) ? this.form.action : ud.getAttribute(this.form, 'action');
        }
        if(uv.isString(act) && act !== ''){
            this.action = act;
            return true; }
        return false;
    };
    (__imns('util.classes')).IMFormData.prototype.setEncoding = function(enc){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(enc === undefined && uv.isHTMLElement(this.form)){
            enc = ('enctype' in this.form) ? this.form.enctype : ud.getAttribute(this.form, 'enctype'); }
        switch (enc) {
            case 'text/plain':
                this.encoding = enc;
                break;
            case 'multipart/form-data':
                this.encoding = enc;
                break;
            default:
                this.encoding = 'application/x-www-form-urlencoded'; }
        return true; };
    (__imns('util.classes')).IMFormData.prototype.url = function(url){
        if(url !== undefined){ this.setAction(url); }
        if(this.method === 'post'){
            return this.action;
        } else {
            this.setEncoding('application/x-www-form-urlencoded');
            return this.action + '?' + this.produceVars(); }
    };
    (__imns('util.classes')).IMFormData.prototype.send = function(callback){
        var uc = __imns('util.classes');
        if(typeof callback !== 'function'){ callback = function(){}; }
        (new uc.XHConn()).connect(this.url(), this.method, this.theVars(), callback);
    };
    (__imns('util.classes')).IMFormData.prototype.theVars = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.method !== 'get'){
            return ('FormData' in window && uv.isHTMLElement(this.form) && ud.getTagName(this.form) === 'form') ? new FormData(this.form) : this.produceVars(); }
        return ''; };
    (__imns('util.classes')).IMFormData.prototype.produceVars = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            ut = __imns('util.tools');
        if(!this.gathered && uv.isHTMLElement(this.form)){ this.gather(ud.findFormControls(this.form)); }
        var jarr = [];
        if(this.segments.length > 0){
            for(var i=0, imax=this.segments.length; i<imax; i+=1){
                var str = this.produceSegmentVar(this.segments[i]);
                if(str !== ''){ jarr.push(str); }}
            if(jarr.length > 0){
                switch(this.encoding){
                    case 'text/plain':
                        return jarr.join("\r\n");
                    case 'multipart/form-data':
                        var boundary = "---------------------------" + Date.now().toString(16);
                        return "--" + boundary + "\r\n" + jarr.join("--" + boundary + "\r\n") + "--" + boundary + "--\r\n";
                    case 'application/x-www-form-urlencoded':
                        /*falls through*/
                    default:
                        return jarr.join('&'); }}}
        return '';
    };

    (__imns('util.classes')).IMFormData.prototype.produceSegmentVar = function(segment){
        var ut = __imns('util.tools'),
            uc = __imns('util.classes');
        var on = (segment instanceof uc.IMFormDataSegment) ? segment : false;
        if(on === false || on.valid === false){
            return '';
        } else {
            if(on.type === 'file'){
                return '';
            } else {
                var str = '';
                switch(this.encoding){
                    case 'text/plain':
                        //what if on.value !== string;
                        str = ut.plainTextEscape(on.name) + '=' + ut.plainTextEscape(on.value);
                        break;
                    case 'multipart/form-data':
                        str = "Content-Disposition: form-data; name=\"" + on.name + "\"\r\n\r\n" + on.value + "\r\n";
                        break;
                    case 'application/x-www-form-urlencoded':
                        /*falls through*/
                    default:
                        str = ('encodeURI' in window) ? encodeURI(on.name) : escape(on.name);
                        str += '=';
                        str += ('encodeURI' in window) ? encodeURI(on.value) : escape(on.value);
                        break;
                }
                return str; }}
    };
}
if (!('IMFormDataSegment' in (__imns('util.classes')))) {
    (__imns('util.classes')).IMFormDataSegment = function(elem){
        var uv = __imns('util.validation');
        this.type = '';
        this.name = '';
        this.value = '';
        this.valid = false;
        if (elem !== undefined) {
            if(uv.isHTMLElement(elem)){
                this.buildFromElement(elem);
            } else {
                this.buildFromObject(elem);
            }
        }
    };
    (__imns('util.classes')).IMFormDataSegment.prototype.buildFromElement = function(elem){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if(uv.isHTMLElement(elem)){
            var tag = ud.getTagName(elem),
                nm = '', val = '', ty = '';
            ty = (tag === 'input' || tag === 'button') ? ud.getAttribute(elem, 'type') : tag;
            nm = ('name' in elem) ? elem.name : ud.getAttribute(elem, 'name');
            val = ('value' in elem) ? elem.value: ud.getAttribute(elem, 'value');
            console.log(ty);
            if(ty === 'radio' || ty === 'checkbox'){
                var isChecked = ('checked' in elem) ? elem.checked : false;
                nm = (!isChecked) ? '' : nm;
            } else if(ty === 'option'){
                var isSelected = ('selected' in elem && (elem.selected === 'true' || elem.selected === 'selected'));
                var par = ud.findParent(elem, ['select', 'datalist']);
                nm = (uv.isHTMLElement(par)) ? (('name' in par) ? par.name : ud.getAttribute(par, 'name')) : '';
                nm = (!isSelected) ? '' : nm;
            } else if(ty === 'file'){
                val = ('files' in elem) ? elem.files : '';
            }
            if(nm !== '' && val !== '' && ty !== ''){
                this.name = nm;
                this.value = val;
                this.type = ty;
                this.valid = true;
                return true;
            }
        }
    };
    (__imns('util.classes')).IMFormDataSegment.prototype.buildFromObject = function(obj){
        var uv = __imns('util.validation');
        var nm = '', val = '', ty = '';
        nm = ('name' in obj && uv.isString(obj.name)) ? obj.name : nm;
        val = ('value' in obj) ? obj.value : val;
        ty = ('type' in obj && uv.isString(obj.type)) ? obj.type : 'text';
        if(nm !== '' && val !== '' && ty !== ''){
            this.name = nm;
            this.value = val;
            this.type = ty;
            this.valid = true;
            return true;
        }
    };
}
