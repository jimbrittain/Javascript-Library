"use strict";
/* global window, document, console, __imns */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CookieInterface' in adr)){
    adr.CookieInterface = function(){
        var uc = __imns('util.classes');
        if(uc.CookieInterface.prototype.singleton !== undefined){ return uc.CookieInterface.prototype.singleton; }
        uc.CookieInterface.prototype.singleton = this;
        this.props = [];
        //this.storage = (window.sessionStorage || window.localStorage) ? true : false; 
        this.storage = this.hasStorage();
        this.able = (document.cookie || this.storage) ? true : false;
        this.readExisting(); };
    adr.CookieInterface.prototype.hasStorage = function(){
        try {
            if('sessionStorage' in window && window.sessionStorage.length > -1 && 'localStorage' in window && window.localStorage.length > -1){
                return true; }
        } catch(e) {}
        return false; };
    adr.CookieInterface.prototype.getLength = function(){ return this.props.length; };
    adr.CookieInterface.prototype.keys = function(n){
        var uc = __imns('util.classes');
        var arr = [], o = null;
        if(n === undefined){
            arr = [];
            for(var i=0, imax = this.props.length; i<imax; i+=1){
                arr.push(this.props[i].name); }
            return arr;
        } else {
            if(typeof n === 'string'){
                o = this.findItem(n);
                if(o !== undefined){  return o; }} 
            n = Number(n);
            if(!isNaN(n) && n > 0 && Math.floor(n) === n){
                o = this.props[n];
                if(o instanceof uc.CookieObject){ return o; }
            } else { return null; }}};
    adr.CookieInterface.prototype.readExisting = function(){
        var uc = __imns('util.classes');
        var i = 0, imax = 0, o = null, w = false, k = null;
        if('sessionStorage' in window && window.sessionStorage !== null && window.sessionStorage.length > 0){
            for(i=0, imax = window.sessionStorage.length; i<imax; i+=1){
                o = new uc.CookieObject();
                k = window.sessionStorage.key(i);
                w = o.distillSession(k, window.sessionStorage.getItem(k));
                if(w){ this.props.push(o); }}}
        if('localStorage' in window && window.localStorage !== null && window.localStorage.length > 0){
            for(i=0, imax = window.localStorage.length; i<imax; i+= 1){
                o = new uc.CookieObject();
                k = window.localStorage.key(i);
                w = o.distillLocal(k, window.localStorage.getItem(k));
                if(w){ this.props.push(o); }}}
        if(document.cookie !== ''){
            this.readCookies(); }
        for(i=0, imax=this.props.length; i<imax; i+=1){
            if(this.props[i].hasExpired() || this.props[i].isTooOld()){
                this.props[i].removeItem();
                this.props.splice(i,1);
                imax -= 1;
                i -= 1; }}};
    adr.CookieInterface.prototype.readCookies = function(){
        var uc = __imns('util.classes');
        var o = document.cookie.split('; '), n = null, w = false;
        for(var i=0, imax=o.length; i<imax; i+=1){
            n = new uc.CookieObject();
            w = n.distillCookie(o[i]);
            if(w){ this.props.push(n); }}};
    adr.CookieInterface.prototype.removeItem = function(o){
        var uc = __imns('util.classes');
        var n = (o instanceof uc.CookieObject) ? o.name : o;
        var done = false;
        if(typeof n === 'string'){
            for(var i=0, imax = this.props.length; i<imax; i+=1){
                if(n === this.props[i]){
                    done = this.props[i].remove();
                    this.props.splice(i,1);
                    break; }}}
        return true; };
    adr.CookieInterface.prototype.findItemId = function(o){
        var uc = __imns('util.classes');
        var n = (o instanceof uc.CookieObject) ? o.name : o;
        var found = -1;
        if(typeof n === 'string'){
            for(var i=0, imax = this.props.length; i<imax; i+=1){
                if(n === this.props[i].name){
                    found = i;
                    break; }}}
        return found; };
    adr.CookieInterface.prototype.hasItem = function(o){ return (this.findItemId(o) === -1) ? false : true; };
    adr.CookieInterface.prototype.findItem = function(o){
        var f = this.findItemId(o);
        return (f !== -1) ? this.props[f] : undefined; };
    adr.CookieInterface.prototype.clear = function(v){
        var i=0, imax=0;
        if(v !== undefined){
            if(v === 'session'){
                for(i=0, imax=this.props.length; i<imax; i+=1){
                    if(this.props[i].expires === null){
                        this.props[i].removeItem();
                        this.props.splice(i,1);
                        imax -= 1;
                        i -= 1; }}
            } else if(v === 'long'){
                for(i=0, imax=this.props.length; i<imax; i+=1){
                    if(this.props[i].expires !== null){ 
                        this.props[i].removeItem();
                        this.props.splice(i,1);
                        imax -= 1;
                        i -= 1; }}
            } else {
                v = (typeof v === 'number') ? new Date(v) : v;
                for(i=0, imax=this.props.length; i<imax; i+=1){
                    if(this.props[i].expires === v){
                        this.props[i].removeItem();
                        this.props.splice(i,1);
                        imax -= 1;
                        i -=1; }}}
        } else {
            for(i=0, imax=this.props.length; i<imax; i+=1){ this.props[i].removeItem(); }
            this.props = []; }};
    adr.CookieInterface.prototype.addItem = function(o){
        var uc = __imns('util.classes');
        o = (o instanceof uc.CookieObject) ? o : new uc.CookieObject(o);
        if(!this.hasItem(o)){
            if(o.name !== "" && o.value !== ""){
                this.props.push(o);
                return this.props[this.props.length - 1]; }
        } else {
            this.setItem(o); }};

    adr.CookieInterface.prototype.setItem = function(o){
        var uc = __imns('util.classes');
        o = (o instanceof uc.CookieObject) ? o : new uc.CookieObject(o);
        //check if o is valid;
        var i = null, needsReset = false;
        if(!this.hasItem(o)){ 
            i = this.addItem(o);
        } else {
            i = this.findItem(o);
            if(i.beenSet){ i.removeItem(); i.beenSet = false; }
            if(i.value !== o.value){ i.setValue(o.value); }
            if(i.expires !== o.expires){ i.setExpires(o.expires); }
            if(i.path !== o.path){ i.setPath(o.path); }
            if(i.secure !== o.secure){ i.setSecure(o.secure); }
            if(i.domain !== o.domain){ i.setDomain(o.domain); }
            if(i.maxage !== o.maxage){ i.setMaxAge(o.maxage); }
            if(i.created !== o.created){ i.setCreated(o.created); }}
        return i.setItem(); };

    adr.CookieObject = function(o){
        var uc = __imns('util.classes');
        this.name = '';
        this.value = '';
        this.value_type = '';
        this.expires = null;
        this.path = this.defaultPath();
        this.secure = false;
        this.domain = this.defaultDomain();
        this.maxage = null;
        this.created = (new Date()).getTime();
        //possibly need a current method, so if not default, uses current method.
        this.master = new uc.CookieInterface();
        this.beenSet = false;
        if(o !== undefined) { this.init(o); }};
    adr.CookieObject.prototype.init = function(o){
        if(typeof o === 'object'){
            if('name' in o){ this.setName(o.name); }
            if('value' in o){ this.setValue(o.value); }
            if('expires' in o){ this.setExpires(o.expires); }
            if('path' in o){ this.setPath(o.path); }
            if('secure' in o){ this.setSecure(o.secure); }
            if('domain' in o){ this.setDomain(o.domain); }
        } else if(arguments.length === 2){ //assume key,value;
            this.setName(arguments[0]);
            this.setValue(arguments[1]);
            if(this.name === ''){ return false; }}};
    adr.CookieObject.prototype.setName = function(n){ if(typeof n === 'string'){ this.name = n; }};
    adr.CookieObject.prototype.cookName = function(){ return encodeURIComponent(this.name); };
    adr.CookieObject.prototype.cookValue = function(){
        var obj = [
            this.value, 
            (this.expires === null) ? 'session' : this.expires.getTime(), 
            this.created, 
            this.path, 
            this.secure, 
            this.maxage, 
            this.domain ];
        return encodeURIComponent(obj.join('**')); };
    adr.CookieObject.prototype.distillValue = function(v){
        v = (typeof v === 'string') ? decodeURIComponent(v) : '';
        if(v.length > 0){
            var t = v.split('**');
            if(t.length === 7){
                this.setValue(t[0]);
                this.setExpires(t[1]);
                this.setCreated(t[2]);
                this.setPath(t[3]);
                this.setSecure(t[4]);
                this.setMaxAge(t[5]);
                this.setDomain(t[6]);
                return true;
            } else { 
                this.name = "";
                return false; }}};
    adr.CookieObject.prototype.hasExpired = function(){
        if(this.expires === null){
            return false;
        } else {
            var d = (new Date()).getTime();
            return (this.expires.getTime() < d) ? true : false; }};
    adr.CookieObject.prototype.isTooOld = function(){
        if(this.maxage === null){
            return false;
        } else {
            var d = (new Date()).getTime();
            return ((this.created + (this.maxage * 1000)) < d) ? true : false; }};
    adr.CookieObject.prototype.distillLocal = function(k,v){ //domain is the default, secure is the default, path is the default;
        this.name = k;
        var worked = this.distillValue(v);
        this.beenSet = true;
        return worked; };
    adr.CookieObject.prototype.distillSession = function(k,v){ //domain is the default, secure is the default, path is the default;
        this.name = k;
        var worked = this.distillValue(v);
        this.beenSet = true;
        return worked; };
    adr.CookieObject.prototype.distillCookie = function(kv){
        var r = kv.split('=');
        var k = r[0];
        var v = r[1];
        this.name = decodeURIComponent(k);
        var worked = this.distillValue(v);
        this.beenSet = true;
        return worked; };
    adr.CookieObject.prototype.defaultPath = function(){ return '/'; };
    adr.CookieObject.prototype.defaultDomain = function(){
        var l = window.location;
        if('host' in l){
            return l.host;
        } else {
            //determine host;
            return '';
        }};
    adr.CookieObject.prototype.makeSecure = function(){
        return this.setSecure(true); };
    adr.CookieObject.prototype.setValue = function(v){
        this.value = v;
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setSecure = function(b){
        if(this.beenSet){ this.removeItem(); }
        this.secure = (b === true || b === 1 || b === 'true') ? true : false;
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setCreated = function(v){
        if(this.beenSet){ this.removeItem(); }
        if(v instanceof Date){
            this.created = v.getTime();
        } else if(typeof v === 'number' && Math.floor(v) === v && v > -1){
            this.created = v; }
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setExpires = function(v){
        if(this.beenSet){ this.removeItem(); }
        if(v instanceof Date){ 
            this.expires = v;
        } else if(typeof v === 'number' && Math.floor(v) === v && v > -1){
            this.expires = new Date(v);
        } else {
            this.expires = null; }
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setDomain = function(d){
        if(this.beenSet){ this.removeItem(); }
        d = (typeof d === 'string') ? d : this.defaultDomain();
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setPath = function(p){
        if(this.beenSet){ this.removeItem(); }
        p = (typeof p === 'string') ? p : this.defaultPath();
        if(this.beenSet){ this.setItem(); }};
    adr.CookieObject.prototype.setMaxAge = function(a){
        if(typeof a === 'number' && a > -1 && Math.floor(a) === a){
            this.maxage = a;
        } else { this.maxage = null; }};
    adr.CookieObject.prototype.cookExpires = function(){
        if(this.expires !== null){
            return 'expires=' + this.expires.toUTCString() + ';';
        } else { return ''; }};
    adr.CookieObject.prototype.cookMaxAge = function(){
        if(this.maxage !== null){
            return this.maxage;
        } else { 
            if(this.expires === null){
                return null;
            } else {
                var d = new Date();
                return this.expires.getSeconds() - d.getSeconds(); }}};
    adr.CookieObject.prototype.cookPath = function(){
        return 'path=' + this.path + ';'; };
    adr.CookieObject.prototype.cookDomain = function(){
        return 'domain=' + this.domain + ';'; };
    adr.CookieObject.prototype.cookSecure = function(){
        return (this.secure) ? 'secure;' : ''; };
    adr.CookieObject.prototype.cook = function(){
        if(this.master.able){
            return this.cookName() + '=' + this.cookValue() + ';' + this.cookExpires() + this.cookPath() + this.cookMaxAge() + this.cookDomain() + this.cookSecure();
        } else { return ''; }};
    adr.CookieObject.prototype.needsCookie = function(){
        return (this.secure || (this.defaultDomain() !== this.domain) || (this.defaultPath() !== this.path)) ? true : false; };
    adr.CookieObject.prototype.setItem = function(){
        if(this.master.able){
            switch (this.determineMethod()) {
                case 0:
                    document.cookie = this.cook();
                    this.beenSet = true;
                    return true;
                case 1:
                    (this.determineStorage()).setItem(this.cookName(), this.cookValue());
                    this.beenSet = true;
                    return true;
                default:
                    return false;
            }
        } else { return false; }};
    adr.CookieObject.prototype.determineMethod = function(){
        if(this.master.able){
            if(this.master.storage && !this.needsCookie()){
                return 1;
            } else { return 0; }
        } else { return -1; }};
    adr.CookieObject.prototype.determineStorage = function(){
        return (this.expires === null) ? window.sessionStorage : window.localStorage; };
    adr.CookieObject.prototype.removeItem = function(){
        if(this.master.able){
            switch (this.determineMethod()) {
                case 0:
                    var d = new Date((new Date()).setDate((new Date()).getDate() - 1));
                    document.cookie = this.cookName() + '=null;expires=' + d.toUTCString();
                    return true;
                case 1:
                    (this.determineStorage()).removeItem(this.cookName());
                    return true;
                default:
                    return false; }
        } else { return false; }};


}
