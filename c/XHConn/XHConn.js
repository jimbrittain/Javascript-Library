"use strict";
// Extended and combined version of XHConn: XHConn - Simple XMLHTTP Interface - bfults@gmail.com and Cross-Browser XMLHttpRequest v1.2 by Andrew Gregory - http://www.scss.com.au/family/andrew/webdesign/xmlhttprequest/
/* global XMLHttpRequest, ActiveXObject, window, java, setTimeout, navigator */
/*jshint -W002 */
/**
    @module XHConn
    @class XHConn
    @singleton
    @constructor
*/
function XHConn(){
    if(XHConn.prototype.singleton !== undefined){ 
        return (XHConn.prototype.xhconnTried && XHConn.prototype.xhconnFailed) ? false : XHConn.prototype.singleton; }
    XHConn.prototype.singleton = this;
    XHConn.prototype.xhconnTried = true;
    XHConn.prototype.xhconnFailed = false;
    XHConn.prototype.oldOpera = false;

    var xmlhttp;
    var bComplete = false;

    if(typeof XMLHttpRequest !== undefined){
        try { xmlhttp = new XMLHttpRequest(); }
        catch (e) { xmlhttp = false;}
    } else if(typeof ActiveXObject !== undefined){
        try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e){ 
            try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) { xmlhttp = false; }}}

    if (!xmlhttp){
        if('opera' in window && !window.XMLHttpRequest){
            XHConn.prototype.oldOpera = true;
            this.oldOperaBuild();
            try { xmlhttp = new window.XMLHttpRequest(); }
            catch(e) { xmlhttp = false;}
            if(!xmlhttp){
                XHConn.prototype.xhconnFailed = true; }
        } else { XHConn.prototype.xhconnFailed = true; }}

    this.s_connect = function(sURL, sMethod, sVars, fnDone){
        if(!xmlhttp){return false; }
        bComplete = false;
        sMethod = sMethod.toUpperCase();
        try {
            if(sMethod === "GET"){
                xmlhttp.open(sMethod, sURL+"?"+sVars, true);
                sVars = "";
            } else {
                if(!XHConn.prototype.oldOpera){
                    xmlhttp.open(sMethod, sURL, true);
                    xmlhttp.setRequestHeader("Method", "POST "+sURL+" HTTP/1.1");
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                } else {
                    return false;
                }
            }
            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState === 4 && !bComplete){
                    bComplete = true;
                    fnDone(xmlhttp);
                }
            };
            xmlhttp.send(sVars);
        } catch(z) { return false; }
        return true; };
    return this; }
/**
    @method XHConn.connect 
    @module XHConn
    @param {String} sURL - url for request
    @param {String} sMethod - method for request {POST | GET}
    @param {Function} fnDone - function when done
 */
XHConn.prototype.connect = function(sURL, sMethod, sVars, fnDone){
    if(!XHConn.prototype.oldOpera){
        this.s_connect(sURL, sMethod, sVars, fnDone);
    } else {
        this.o_connect(sURL, sMethod, sVars, fnDone); }};

XHConn.prototype.oldOperaBuild = function(){
    window.XMLHttpRequest = function(){
        this.readyState = 0; // 0=uninitialized,1=loading,2=loaded,3=interactive,4=complete
        this.status = 0; // HTTP status codes
        this.statusText = '';
        this._headers = [];
        this._aborted = false;
        this._async = true;
        this._defaultCharset = 'ISO-8859-1';
        this._getCharset = function() {
            var charset = this._defaultCharset;
            var contentType = this.getResponseHeader('Content-type').toUpperCase();
            var val = contentType.indexOf('CHARSET=');
            if(val !== -1){charset = contentType.substring(val);}
            val = charset.indexOf(';');
            if(val !== -1){charset = charset.substring(0, val);}
            val = charset.indexOf(',');
            if(val !== -1){charset = charset.substring(0, val);}
            return charset; };
        this.abort = function() { this._aborted = true; };
        this.getAllResponseHeaders = function(){ return this.getAllResponseHeader('*'); };
        this.getAllResponseHeader = function(header){
            var ret = '';
            for(var i=0, imax = this._headers.length; i < imax; i += 1){
                if(header === '*' || this._headers[i].h === header){
                    ret += this._headers[i].h + ': ' + this._headers[i].v + '\n'; }}
            return ret; };
        this.getResponseHeader = function(header){
            var ret = this.getAllResponseHeader(header);
            var i = ret.indexOf('\n');
            if (i !== -1){ ret = ret.substring(0, i); }
            return ret; };
        this.setRequestHeader = function(header, value) { this._headers[this._headers.length] = {h:header, v:value}; };
        this.open = function(method, url, async, user, password){
            this.method = method;
            this.url = url;
            this._async = true;
            this._aborted = false;
            this._headers = [];
            if(arguments.length >= 3){ this._async = async; }
            if(arguments.length > 3){ window.opera.postError('XMLHttpRequest.open() - user/password not supported'); }
            this.readyState = 1;
            if(this.onreadystatechange){ this.onreadystatechange(); }};
        this.send = function(data){
            if(!navigator.javaEnabled()){
                this.abort();
                return; }
            if(this._async){
                setTimeout(this._sendasync, 0, this, data);
            } else { this._sendsync(data); }};
        this._sendasync = function(req, data){ if(!req._aborted) { req._sendsync(data); }};
        this._sendsync = function(data){
            this.readyState = 2;
            if(this.onreadystatechange){ this.onreadystatechange(); }
            var url = new java.net.URL(new java.net.URL(window.location.href), this.url);
            var conn = url.openConnection();
            for(var i=0, imax = this._headers.length; i<imax; i += 1){
                conn.setRequestProperty(this._headers[i].h, this._headers[i].v); }
            this._headers = [];
            if(this.method === 'POST'){
                conn.setDoOutput(true);
                var wr = new java.io.OutputStreamWriter(conn.getOutputStream(), this._getCharset());
                wr.write(data);
                wr.flush();
                wr.close(); }
            var gotContentEncoding = false, gotContentLength = false, gotContentType = false, gotDate = false, gotExpiration = false, gotLastModified = false;
            for (i=0; i<1000; i+=1){
                var hdrName = conn.getHeaderFieldKey(i), hdrValue = conn.getHeaderField(i);
                if(hdrName === null && hdrValue === null){ break; }
                if (hdrName !== null){
                    this._headers[this._headers.length] = {h:hdrName, v:hdrValue};
                    switch (hdrName.toLowerCase()){
                        case 'content-encoding': gotContentEncoding = true; break;
                        case 'content-length': gotContentLength = true; break;
                        case 'content-type': gotContentType = true; break;
                        case 'date': gotDate = true; break;
                        case 'expires': gotExpiration = true; break;
                        case 'last-modified': gotLastModified = true; break; }}}
            var val;
            val = conn.getContentEncoding();
            if(val !== null && !gotContentEncoding){ this._headers[this._headers.length] = {h:'Content-encoding', v:val}; }
            val = conn.getContentLength();
            if(val !== -1 && !gotContentLength){ this._headers[this._headers.length] = {h:'Content-length', v:val}; }
            val = conn.getContentType();
            if(val !== null && !gotContentType){ this._headers[this._headers.length] = {h:'Content-type', v:val}; }
            val = conn.getDate();
            if(val !== 0 && !gotDate){ this._headers[this._headers.length] = {h:'Date', v:(new Date(val)).toUTCString()}; }
            val = conn.getExpiration();
            if(val !== 0 && !gotExpiration){ this._headers[this._headers.length] = {h:'Expires', v:(new Date(val)).toUTCString()}; }
            val = conn.getLastModified();
            if(val !== 0 && !gotLastModified){ this._headers[this._headers.length] = {h:'Last-modified', v:(new Date(val)).toUTCString()}; }
            var reqdata = '';
            var stream = conn.getInputStream();
            if (stream){
                var reader = new java.io.BufferedReader(new java.io.InputStreamReader(stream, this._getCharset()));
                var line;
                while((line = reader.readLine()) !== null){
                    if(this.readyState === 2){
                        this.readyState = 3;
                        if (this.onreadystatechange){ this.onreadystatechange(); }}
                    reqdata += line + '\n'; }
                reader.close();
                this.status = 200;
                this.statusText = 'OK';
                this.responseText = reqdata;
                this.readyState = 4;
                if(this.onreadystatechange){ this.onreadystatechange(); }
                if(this.onload){ this.onload(); }
            } else {
                this.status = 404;
                this.statusText = 'Not Found';
                this.responseText = '';
                this.readyState = 4;
                if(this.onreadystatechange){ this.onreadystatechange(); }
                if(this.onerror){this.onerror();}}
        };
    };
};
