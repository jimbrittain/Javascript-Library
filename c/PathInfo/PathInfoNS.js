"use strict";
/* global window, __imns, console */
(function(){
    var adr = __imns('util.classes'),
        ut = __imns('util.tools');
    if (!('PathInfo' in adr)) {
        adr.PathInfo = function(o){
            this.url = '';
            this.protocol = '';
            this.domain = '';

            this.phpleading = false;

            this.folderString = '';
            this.folderList = [];

            this.file = '';
            this.filename = '';
            this.extension = '';

            this.getVarsString = '';
            this.getVarsList = [];

            this.hash = '';
            //this._reg = /^(?:(?:(http\:\/\/|https\:\/\/)((?:(?:[0-9]{1,3}\.){3,5}[0-9]{1,3})|(?:(?:[A-Za-z0-9\_\-]{1,63}\.)+(?:[A-Za-z0-9\-\_]{1,63}))))(?:\/)?|(file\:\/\/\/)){0,1}((?:(?:[a-zA-Z0-9\-\_\%\.]+)(?:\/))+)??([a-zA-Z0-9\-\_\%\&\.\=]+)?(?:\?([a-zA-Z0-9\-\_\%\&\.\=]+))?(?:\#([a-zA-Z0-9\-\_]+))?$/;
            this._reg = /^(?:(?:(http\:\/\/|https\:\/\/)((?:(?:[0-9]{1,3}\.){3,5}[0-9]{1,3})|(?:(?:[A-Za-z0-9\_\-]{1,63}\.)+(?:[A-Za-z0-9\-\_]{1,63}))))(?:\/)?|(file\:\/\/\/)|(\/)){0,1}((?:(?:[a-zA-Z0-9\-\_\%\.  ]+)(?:\/))+)??([a-zA-Z0-9\-\_\%\&\.\=]+)?(?:\?([a-zA-Z0-9\-\_\%\&\.\=]+))?(?:\#([a-zA-Z0-9\-\_]+))?$/;

            this.set(o);
        };
        adr.PathInfo.prototype.clear = function(){
            this.url = '';

            this.protocol = '';
            this.domain = '';

            this.phpleading = false;

            this.folderString = '';
            this.folderList = [];

            this.file = '';
            this.filename = '';
            this.extension = '';

            this.getVarsString = '';
            this.getVarsList = [];

            this.hash = '';

            return true;
        };
        adr.PathInfo.prototype.set = function(u){
            this.clear();
            if(u !== undefined){
                this.setUrl(u);
            } else { this.setUrl(window.location.href); }
        };

        adr.PathInfo.prototype.parse = function(urlStr){
            this.url = urlStr;
            this.domain = this.parseDomain();
            this.parseFolders();
            this.parseGetVars();
            this.hash = this.parseHash();
        };
        adr.PathInfo.prototype.parseFolders = function(){
            this.folderString = this.parseFolderString();
            this.foldersList = this.parseFolderList();
        };
        adr.PathInfo.prototype.parseGetVars = function(){
            this.getVars = this.parseGetVarsString();
            this.getVarsList = this.parseGetVarsList();
        };

        adr.PathInfo.prototype.setHash = function(h){
            this.hash = h;
            this.produceUrl();
        };
        adr.PathInfo.prototype.addHash = adr.PathInfo.prototype.setHash; //alias;

        adr.PathInfo.prototype.produceGetVarsString = function(){
            var uv = __imns('util.validation');
            var str = '';
            for (var i=0, imax=this.getVarsList.length; i<imax; i+=1){
                var s = '',
                    name = this.getVarsList[i].name,
                    value = this.getVarsList[i].value;
                if (uv.isArray(value)) {
                    for (var n=0, nmax=value.length; n<nmax; n+=1) {
                        s += (s.length > 0) ? '&' : '';
                        s += name + '[]=' + value[n];
                    }
                } else {
                    s = name + '=' + value;
                }
                str += (str.length > 0) ? '&' + s : s;
            }
            this.getVarsString = str;
            return str;
        };
        adr.PathInfo.prototype.produceFolderString = function(){
            var str = '';
            for (var i=0, imax=this.folderList.length; i<imax; i+=1) {
                str += this.folderList[i] + '/';
            }
            return str;
        };
        adr.PathInfo.prototype.produceUrl = function()
        {
            var url = '';
            url += this.protocol;
            // url += '://';
            url += this.domain;
            url += '/';
            //url += (this.folderString.length > 0) ? this.folderString + '/' : '';
            //url += (this.folderString.length > 0) ? this.folderString : '';
            url += this.produceFolderString();
            url += this.file;
            url += (this.getVarsString.length > 0) ? '?' + this.getVarsString : '';
            url += (this.hash.length > 0) ? '#' + this.hash : '';
            this.url = url;
            return url;
        };
        
        adr.PathInfo.prototype.findGetVar = function(name) //at the momemnt only works on self;
        {
            var uv = __imns('util.validation');
            var arr = this.getVarsList;
            if (uv.isString(name) && name.length > 0) {
                for(var i=0, imax=arr.length; i<imax; i+=1){
                    if (arr[i].name === name) {
                        return arr[i].value; }}
            }
            return undefined;
        };
        adr.PathInfo.prototype.addGetVars = function(arr, append)
        {
            var uv = __imns('util.validation');
            append = (append) ? true : false;
            arr = (uv.isArray(arr)) ? arr : [arr];
            for(var i=0, imax=arr.length; i<imax; i+=1){
                this.addGetVar(arr[i], append);
            }
        };
        adr.PathInfo.prototype.removeGetVars = function(arr){
            var uv = __imns('util.validation');
            arr = (uv.isArray(arr)) ? arr : [arr];
            for (var i=0, imax=arr.length; i<imax; i+=1) {
                this.removeGetVar(arr[i]);
            }
        };
        adr.PathInfo.prototype.removeGetVar = function(o)
        {
            var uv = __imns('util.validation');
            var name = '',
                value = '';
            if (uv.isString(o)) {
                name = o;
            } else if (typeof o === 'object' && o.name) {
                name = o.name;
                if ('value' in o){ value = o.value; }
            }
            for (var i=0; i < this.getVarsList.length; i+= 1) {
                var k = this.getVarsList[i].name,
                    v = this.getVarsList[i].value;
                if (k === name) {
                    if (value.length === 0) {
                        this.getVarsList.splice(i,1);
                        i -= 1;
                        continue;
                    } else {
                        if (uv.isArray(v)) {
                            for (var n=0; n < v.length; n+= 1) {
                                if (v[n] === value) {
                                    v.splice(n,1); //this may do it twice if array is reference;
                                    this.getVarsList[i].value.splice(n,1);
                                    n -= 1;
                                }
                            }
                            if (this.getVarsList[i].value.length === 0) {
                                this.getVarsList.splice(i,1);
                                i -= 1;
                            }
                        } else if (v === value) {
                            this.getVarsList.splice(i,1);
                            i -= 1;
                        }
                    }
                }
            }
            this.produceGetVarsString();
            this.produceUrl();
            this.parseUrl(); };
        adr.PathInfo.prototype.findGetVar = function(name){
            for (var i=0, imax=this.getVarsList.length; i<imax; i+=1) {
                var g = this.getVarsList[i];
                if (g.name === name) { return g; }}
            return false; };
        adr.PathInfo.prototype.addGetVar = function(o, append){
            var uv = __imns('util.validation');
            var name, value;
            if (typeof o === 'object' && ('name' in o && 'value' in o)) {
                name = o.name;
                value = o.value; }
            var g = this.findGetVar(name);
            if (g !== false) {
                append = (append) ? true : false;
                if (!append) {
                    g.value = value;
                } else {
                    if (!uv.isArray(g.value)) {
                        g.value = [g.value]; }
                    g.value.push(value); }
            } else {
                this.getVarsList.push({name: name, value: value});
            }
            this.produceGetVarsString();
            this.produceUrl();
            this.parseUrl(); 
        };

        adr.PathInfo.prototype.shouldUseSelf = function(url){
            var uc = __imns('util.classes');
            url = (url === undefined || !this.isValid(url)) ? this.url : url;
            return (url !== this.url) ? new uc.PathInfo(url) : this;
        };

        adr.PathInfo.prototype.get = function(url, prop){
            var uc = __imns('util.classes'),
                uv = __imns('util.validation');
            var o = this.shouldUseSelf(url);
            if (prop === 'getVarsList' && ut.objectkeys(o[prop]).length > 0) {
                return o[prop]; //catch for 0-length array when props used
            } else if (o[prop] === null || (uv.isArray(o[prop]) && o[prop].length < 1)) {
                if (this.isSelfByNeglect(url)) {
                    return (new uc.PathInfo(window.location.href))[prop];
                }
            } else {
                if ((prop === 'folders' || 
                    prop === 'folderString' || 
                    prop === 'folderlist' || 
                    prop === 'folderList') &&
                    this.isRelative(url)) {
                    //do the folderlist, merge
                    var ll = (new uc.PathInfo(url)).mergeFolderLists((new uc.PathInfo(window.location.href)).folderList, o.folderList);
                    if (prop === 'folders' || prop === 'folderString') {
                        return  ll.join('/') + ((ll.length > 0) ? '/' : '');
                    } else { return ll; }
                }
                return o[prop]; }
            return null; };
        adr.PathInfo.prototype.getHash = function(url){ return this.get(url, 'hash'); };
        adr.PathInfo.prototype.getGetVarsString = function(url){ return this.get(url, 'getVarsString'); };
        adr.PathInfo.prototype.getGetVarsList = function(url){ return this.get(url, 'getVarsList'); };
        adr.PathInfo.prototype.getScheme = function(url){ return this.get(url, 'scheme'); };
        adr.PathInfo.prototype.getHost = function(url){ return this.get(url, 'host'); };
        adr.PathInfo.prototype.getProtocol = function(url){ return this.get(url, 'protocol'); };
        adr.PathInfo.prototype.getDomain = function(url){ return this.get(url, 'domain'); };
        adr.PathInfo.prototype.getFile = function(url){ return this.get(url, 'file'); };
        adr.PathInfo.prototype.getFilename = function(url){ return this.get(url, 'filename'); };
        adr.PathInfo.prototype.getFileExtension = function(url){ return this.get(url, 'extension'); };
        adr.PathInfo.prototype.getPort = function(url){ return this.get(url, 'port'); };
        adr.PathInfo.prototype.getUser = function(url){ return this.get(url, 'user'); };
        adr.PathInfo.prototype.getFolders = function(url){ return this.get(url, 'folderString'); };
        adr.PathInfo.prototype.getFolderList = function(url){ return this.get(url, 'folderlist'); };

        adr.PathInfo.prototype.isSelf = function(url){
            url = (url === undefined || !this.isValid(url)) ? this.url : url;
            var o = {
                protocol: this.getProtocol(url),
                domain: this.getDomain(url),
                folderString: this.getFolders(url),
                file: this.getFile(url)},
                wl = this.parseUrl(window.location.href);
            if(o.protocol === wl.protocol && 
               o.domain === wl.domain && 
               o.folderString === wl.folderString && 
               o.file === wl.file){
                return true;
            } else { return false; }};
        adr.PathInfo.prototype.isSelfByNeglect = function(url){
            //url = (url === undefined || !this.isValid(url)) ? this.url : url;
            var o = (this.shouldUseSelf(url)).parseUrl();
            return (o.file === '' && o.protocol === '' && o.domain === '' && o.folderString === '') ? true : false; };


        adr.PathInfo.prototype.mergeFolderLists = function(org, dest){
            var uv = __imns('util.validation'),
                uc = __imns('util.classes');
            var onSelf = false;
            if (arguments.length === 1){
                dest = org;
                org = this.folderList;
                onSelf = true; }
            if (!uv.isArray(org)) {
                if (uv.isString(org)) {
                    org = new uc.PathInfo(org).folderList;
                } else if (typeof org === 'object' && org.constructor === uc.PathInfo) {
                    org = org.folderList;
                }
            }
            if (!uv.isArray(dest)) {
                if (uv.isString(dest)) {
                    dest = new uc.PathInfo(dest).folderList;
                } else if (typeof dest === 'object' && dest.constructor === uc.PathInfo) {
                    dest = dest.folderList;
                }
            }
            if(uv.isArray(org) && uv.isArray(dest)){
                for(var i=0, imax=dest.length; i<imax; i+=1){
                    if(dest[i] === '..'){ 
                        org.pop(); 
                    } else { org.push(dest[i]); }}}
            if (onSelf) {
                this.folderList = org;
                this.produceUrl(); }
            return org; };


        adr.PathInfo.prototype.isPHPLeading = function(url){
            return (this.phpleading === true) ? true : false; };
        adr.PathInfo.prototype.isHTTPS = function(url){
            return (this.getProtocol(url) === 'https://') ? true : false; };
        adr.PathInfo.prototype.isRelative = function(url){
            url = (url === undefined || !this.isValid(url)) ? this.url : url;
            var o = this.parseUrl(url);
            return (o.domain === '') ? true : false; };
        adr.PathInfo.prototype.isAbsolute = function(url){
            return (this.isRelative(url)) ? false : true; };
        adr.PathInfo.prototype.isLocal = function(url){
            url = (url === undefined || !this.isValid(url)) ? this.url : url;
            var o = this.parseUrl(url),
                hd = this.getDomain('index.htm');
            return (o.domain === hd) ? true : false; };
        adr.PathInfo.prototype.isValid = function(u){
            var uv = __imns('util.validation');
            u = (u === undefined || !uv.isString(u)) ? this.url : u;
            return (u.length > 0 && this._reg.test(u)) ? true : false; };

        adr.PathInfo.prototype.setUrl = function(str){
            if(str !== undefined && this.isValid(str)){
                this.url = str;
                this.parseUrl(); 
                return true;
            } else if (str === '') {
                this.url = window.location.href;
                this.parseUrl();
            } else { return false; }};


        /*
        adr.PathInfo.prototype.parse = function(u){
           var uc = __imns('util.classes');
           u = (u !== undefined || !this.isValid(u)) ? u : this.url;
           return new uc.PathInfoObject(u); };*/
        adr.PathInfo.prototype.parseUrl = function(url){
            url = (url === undefined || !this.isValid(url)) ? this.url : url;
            var r = this._reg.exec(url);
            if(url.length > 0 && r){
                if(r[1] !== undefined){ 
                    this.protocol = r[1]; 
                } else if(r[3] !== undefined){
                    this.protocol = r[3]; }
                if(r[2] !== undefined){
                    this.domain = r[2];
                    this.cc = this.parseCCFragment(this.domain); }
                if(r[4] !== undefined) {
                    this.phpleading = (r[4] === '/') ? true : false; //should never b here without being true;
                }
                if(r[5] !== undefined){
                    this.folderString = r[5];
                    this.folderList = this.parseFolderListFragment(this.folderString); }
                if(r[6] !== undefined){
                    this.file = r[6];
                    this.filename = this.parseFileNameFragment(this.file);
                    this.extension = this.parseFileExtensionFragment(this.file); }
                if(r[7] !== undefined){
                    this.getVarsString = r[7];
                    this.getVarsList = this.parseGetVarsListFragment(this.getVarsString); }
                if(r[8] !== undefined){ this.hash = r[8]; }
            }
            return this;
        };
        adr.PathInfo.prototype.parseFileNameFragment = function(str){
            if(typeof str === 'string'){
                var re = /^([a-zA-Z0-9\_\-\.]+?)(?:\.(?:[a-zA-Z0-9\_\-]{1,5}))?$/;
                if(re.test(str)){ return re.exec(str)[1]; }}
            return undefined; };
        adr.PathInfo.prototype.parseFileExtensionFragment = function(str){
            if(typeof str === 'string'){
                var re = /\.([a-zA-Z0-9\_\-]{1,5})$/;
                if(re.test(str)){ return re.exec(str)[1]; }}
            return undefined; };
        adr.PathInfo.prototype.parseCCFragment = function(str){
        };
        adr.PathInfo.prototype.parseGetVarsListFragment = function(str){
            //remember, remember, PHPs illegal array get vars;
            if(typeof str === 'string'){
                str = str.replace('&amp;', '&');
                var uv = __imns('util.validation');
                var all = str.split(/\&/),
                    re = /^([a-zA-Z0-9\-\_]+)(?:\[\])?(?:=([a-zA-Z0-9\,\.\-\+\%]+))?$/,
                    pairs = [];
                for(var i=0, imax = all.length; i<imax; i+=1){
                    if(re.test(all[i])){
                        var r = re.exec(all[i]),
                            key = r[1],
                            val = r[2];
                        if(key in pairs){
                            if(!uv.isArray(pairs[key])){
                                pairs[key] = [pairs[key]]; }
                            pairs[key].push(val);
                        } else { pairs[key] = val; }}}
                var arr = [];
                for (var prop in pairs) {
                    if (pairs.hasOwnProperty(prop)){
                        var o = { name: prop, value: pairs[prop] };
                        arr.push(o); }}
                return arr; }
            return []; };
        adr.PathInfo.prototype.parseFolderListFragment = function(str){
            var uv = __imns('util.validation');
            var arr = [];
            if(typeof str === 'string' && str.length > 0){
                var a = str.split(/\//);
                for(var i=0, imax = a.length; i<imax; i+=1){
                    if(typeof a[i] === 'string' && a[i].length > 0){
                        arr.push(a[i]); }}}
            return arr; };

    }

    ut.isUrlLocal = function(url){
        var uc = __imns('util.classes');
        if('PathInfo' in uc){
            return ((new uc.PathInfo(url)).isLocal()) ? true : false; }
        return undefined; };
    ut.isUrlExternal = function(url){
        var ut = __imns('util.classes');
        return ut.isUrlLocal(url) ? false : true; };

    ut.parsePathInfo = function(url){
        var uc = __imns('util.classes');
        if('PathInfo' in uc){
            var pi = new uc.PathInfo();
            return (pi.setUrl(url)) ? pi.parse() : null; }
        return null; };
})();
