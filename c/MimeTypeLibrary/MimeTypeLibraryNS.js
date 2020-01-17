"use strict";
/* global __imns, navigator, window, window.vbsActive, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('MimeTypeLibrary' in adr)){
    /**
     @module MimeTypeLibrary
     @namespace component.classes
     @class MimeTypeReference
     @constructor
     @param {String} mimetype - Mimetype
     @param {String} handler - ActiveX Controller
     */
    adr.MimeTypeReference = function(mimetype, handler){
        this.mimetype = mimetype;
        this.handlers = [];
        this.exists = false;
        this.checked = false; 
        this.addHandler(handler); };
    /**
        @class MimeTypeReference
        @method MimeTypeReference.__addSingleHandler
        @param {String}
        @return {Boolean}
     */
    adr.MimeTypeReference.prototype.__addSingleHandler = function(handler){
        var adding = true;
        for(var i=0, imax=this.handlers.length; i<imax; i += 1){
            if(this.handlers[i] === handler){
                adding = false;
                break; }}
        if(adding){
            this.handlers.push(handler);
            return true;
        } else { return false; }};
    /**
         @class MimeTypeReference
         @method MimeTypeReference.addHandler
         @param {String|Array} handler
         @return {Boolean}
     */
    adr.MimeTypeReference.prototype.addHandler = function(handler){
        var uv = __imns('util.validation');
        if(!(uv.isArray(handler)) && typeof handler === 'string'){ handler = [handler]; }
        if(uv.isArray(handler)){
            var added = false;
            for(var i=0, imax = handler.length; i<imax; i+=1){
                var a = this.__addSingleHandler(handler[i]);
                added = (a) ? true : added; }
            return added; }
        return false; };
   adr.MimeTypeReference.prototype.canNativeCheck = function(){ return ('mimeTypes' in navigator && navigator.mimeTypes.length > 0); };
   adr.MimeTypeReference.prototype.check = function(){
       if(this.canNativeCheck()){
           if(navigator.mimeTypes[this.mimetype] !== undefined){
               var nmt = navigator.mimeTypes[this.mimetype];
               if('enabledPlugin' in nmt && nmt.enabledPlugin){
                   this.exists();
                   return true;
               } else { this.checked = true; }}}};
    /**
        @class MimeTypeReference
        @method MimeTypeReference.confirmed
        @description - Used to confirmed exists, if !this.checked;
     */
    adr.MimeTypeReference.prototype.confirmed = function(){
        if(!this.checked){
            this.exists = true;
            this.checked = true; }};

    /**
        @module MimeTypeLibrary
        @class MimeTypeCollection
        @constructor
        @singleton
     */
    adr.MimeTypeCollection = function(){
        var cc = __imns('component.classes');
        if(cc.MimeTypeCollection.prototype.singleton !== undefined){ return cc.MimeTypeCollection.prototype.singleton; }
        cc.MimeTypeCollection.prototype.singleton = this;
        this.references = []; };
    /**
        @class MimeTypeCollection
        @method MimeTypeCollection.add
        @param {String} mimetype
        @param {String|Array} handler
        @return {Boolean}
     */
    adr.MimeTypeCollection.prototype.add = function(mimetype, handler){
        var i = this.references.length, cc = __imns('component.classes');
        while (i > 0) {
            i -= 1;
            if(this.references[i].mimetype === mimetype){
                return this.references[i].addHandler(handler); }}
        var ref = new cc.MimeTypeReference(mimetype, handler);
        this.references.push(ref); 
        return true; };
     /**
        @class MimeTypeCollection
        @method MimeTypeCollection.find
        @param {String} mimetype
        @return {MimeTypeReference|null}
      */
     adr.MimeTypeCollection.prototype.find = function(mimetype){
         var i = this.references.length;
         while (i > 0) {
             i -= 1;
             if(this.references[i].mimetype === mimetype){
                 return this.references[i]; }}
         return null; };
     /**
        @class MimeTypeCollection
        @method MimeTypeCollection.findHandlersForMimeType
        @param {String} mimetype
        @return {Array}
      */
     adr.MimeTypeCollection.prototype.findHandlersForMimeType = function(mimetype){ // one to many
         var ref = this.find(mimetype), cc = __imns('component.classes');
         if(ref instanceof cc.MimeTypeReference){ return ref.handlers; }
         return []; };
    /**
        @class MimeTypeCollection
        @method MimeTypeCollection.exists
        @param {String} mimetype
        @param {Boolean|undefined} propagate
        @return {Boolean}
     */
    adr.MimeTypeCollection.prototype.exists = function(mimetype, propagate){
        propagate = (propagate === undefined || propagate !== false) ? true : false;
        var i = this.references.length, cc = __imns('component.classes'), axc = new cc.ActiveXCollection(), done = false;
        while (i > 0){
            i -= 1;
            if(this.references[i].mimetype === mimetype){
                done = true;
                this.references[i].confirmed();
                if(propagate){ for(var n=0, nmax = this.references[i].handlers.length; n < nmax; n += 1){ axc.exists(this.references[i].handlers[n], false); }}}}
        return done; };

    /**
        @class FileExtensionReference
        @module MimeTypeLibrary
        @constructor
        @param {String} extension
        @param {String} mimetype
     */
    adr.FileExtensionReference = function(extension, mimetype){
        this.extension = (typeof extension === 'string' && extension.length > 1 && extension.length < 5) ? extension.toLowerCase() : undefined;
        this.mimetype = (typeof mimetype === 'string') ? mimetype : undefined; 
        if(this.extension === null || this.mimetype === null){ return undefined; }};

    /**
        @class FileExtensionCollection
        @module MimeTypeLibrary
        @constructor
        @singleton
     */
    adr.FileExtensionCollection = function(){
        var cc = __imns('component.classes');
        if(cc.FileExtensionCollection.prototype.singleton !== undefined){ return cc.FileExtensionCollection.prototype.singleton; }
        cc.FileExtensionCollection.prototype.singleton = this; 
        this.references = []; };
    /**
        @class FileExtensionCollection
        @method FileExtensionCollection.add
        @param {String} extension
        @param {String} mimetype
        @return {Boolean}
     */
    adr.FileExtensionCollection.prototype.add = function(extension, mimetype){
        var cc = __imns('component.classes');
        if(this.findMimeTypeForFileExtension(extension) === null){
            var ref = new cc.FileExtensionReference(extension, mimetype);
            if(ref instanceof cc.FileExtensionReference){ 
                this.references.push(ref);
                return true; }}
        return false; };
    /**
        @class FileExtensionCollection
        @method FileExtensionCollection.findExtensionsForMimeType
        @param {String} mimetype
        @return {Array}
     */
    adr.FileExtensionCollection.prototype.findExtensionsForMimeType = function(mimetype){ //one to many
        var i = this.references.length, arr = [];
        while (i > 0) {
            i -= 1;
            if(this.references[i].mimetype === mimetype){
                arr.push(this.references[i].extension); }}
        return arr; };
    /**
        @class FileExtensionCollection
        @method FileExtensionCollection.findMimeTypeForFileExtension
        @param {String} extension
        @return {String|null}
     */
    adr.FileExtensionCollection.prototype.findMimeTypeForFileExtension = function(extension){ //one to one
        var i = this.references.length;
        while (i > 0) {
            i -= 1;
            if(this.references[i].extension === extension){
                return this.references[i].mimetype; }}
        return null; };

    /**
        @module MimeTypeLibrary
        @class ActiveXReference
        @constructor
        @param {String} handler
        @param {String|Array} mimetype
     */
    adr.ActiveXReference = function(handler, mimetype){
        this.handler = handler;
        this.mimetypes = [];
        this.exists = false;
        this.checked = false; 
        if(mimetype !== undefined){ this.addMimeType(mimetype); }};
    /**
        @class ActiveXReference
        @method ActiveXReference.exists
        @return {Boolean}
        @requires util.tools.vbsPluginCheck //check this is in namespace may need to be in window as vbs!
     */
    adr.ActiveXReference.prototype.exists = function(){
        var ut = __imns('util.tools');
        if(!this.checked){
            this.exists  = ut.vbsPluginCheck(this.handler);
            this.checked = true; }
        return this.exists; };
    /**
        @class ActiveXReference
        @method ActiveXReference.confirmed
        @description Sets as confirmed;
     */
    adr.ActiveXReference.prototype.confirmed = function(){
        if(!this.checked){
            this.exists = true;
            this.checked = true; }};
    /**
        @class ActiveXReference
        @method ActiveXReference.__addSingleMimeType
        @param {String} mimetype
        @return {Boolean}
     */
    adr.ActiveXReference.prototype.__addSingleMimeType = function(mimetype){
        var adding = true;
        for(var i=0, imax=this.mimetypes.length; i<imax; i += 1){
            if(this.mimetypes[i] === mimetype){
                adding = false;
                break; }}
        if(adding){
            this.mimetypes.push(mimetype);
            return true;
        } else { return false; }};
    /**
        @class ActiveXReference
        @method ActiveXReference.addMimeType
        @param {String|Array} mimetype
        @return {Boolean}
     */
    adr.ActiveXReference.prototype.addMimeType = function(mimetype){
        var uv = __imns('util.validation');
        mimetype = (!(uv.isArray(mimetype)) && typeof mimetype === 'string') ? [mimetype] : mimetype;
        if(uv.isArray(mimetype)){
            var added = false;
            for(var i=0, imax = mimetype.length; i<imax; i+=1){
                var a = this.__addSingleMimeType(mimetype[i]);
                added = (a) ? true : added; }
            return added; }
        return false; };

    /**
        @module MimeTypeLibrary
        @class ActiveXCollection
        @constructor
        @singleton
     */
    adr.ActiveXCollection = function(){
        var cc = __imns('component.classes');
        if(cc.ActiveXCollection.prototype.singleton !== undefined){ return cc.ActiveXCollection.prototype.singleton; }
        cc.ActiveXCollection.prototype.singleton = this;
        this.references = []; };
    /**
        @class ActiveXCollection
        @method ActiveXCollection.findHandlersFromMimeType
        @param {String} mimetype
        @return {Array}
     */
    adr.ActiveXCollection.prototype.findHandlersFromMimeType = function(mimetype){ //one to many
        var i = this.references.length, arr = [];
        while (i > 0){
            i -= 1;
            if(this.references[i].hasType(mimetype)){ arr.push(this.references[i].handler); }}
        return arr; };
    /**
        @class ActiveXCollection
        @method ActiveXCollection.findHandler
        @param {String} handler
        @return {ActiveXReference}
        @description - either finds and returns or creates a new handler
    */
    adr.ActiveXCollection.prototype.findHandler = function(handler){
        var i = this.references.length, cc = __imns('component.classes');
        while (i > 0){
            i -= 1;
            if(this.references[i].handler === handler){ return this.references[i]; }}
        var ref = new cc.ActiveXReference(handler);
        this.references.push(ref);
        return this.references[this.references.length - 1]; };
    /**
        @class ActiveXCollection
        @method ActiveXCollection.add
        @param {String} mimetype
        @param {String|Array} mimetype
        @return {Boolean}
    */
    adr.ActiveXCollection.prototype.add = function(handler, mimetype){
        var ref = this.findHandler(handler);
        return ref.addMimeType(mimetype); };
    /**
        @class ActiveXCollection
        @method ActiveXCollection.exists
        @param {String} handler
        @param {Boolean|undefined:true} propagate
        @return {Boolean}
    */
    adr.ActiveXCollection.prototype.exists = function(handler, propagate){
        propagate = (propagate === undefined || propagate !== false) ? true : false;
        var i = this.references.length, cc = __imns('component.classes'), mtc = new cc.MimeTypeCollection(), done = false;
        while (i > 0){
            i -= 1;
            if(this.references[i].handler === handler){
                this.references[i].confirmed();
                done = true;
                if(propagate){
                    for(var n = 0, nmax = this.references[i].mimetypes.length; n<nmax; n += 1){
                        mtc.exists(this.references[i].mimetypes[n], false); }}}}
        return done; };

    /**
        @module MimeTypeLibrary
        @class MimeTypeLibrary
        @singleton MimeTypeLibrary
     */
    adr.MimeTypeLibrary = function(){
        var cc = __imns('component.classes');
        if(cc.MimeTypeLibrary.prototype.singleton !== undefined){
            return cc.MimeTypeLibrary.prototype.singleton;
        } else { cc.MimeTypeLibrary.prototype.singleton = this; }
        this.extensionlibrary = new cc.FileExtensionCollection();
        this.handlerlibrary = new cc.ActiveXCollection();
        this.mimelibrary = new cc.MimeTypeCollection(); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.addFileExtensionReference
        @param {String} extension
        @param {String|Array} mimetype
        @return {Boolean}
     */
    adr.MimeTypeLibrary.prototype.addFileExtensionReference = function(extension, mimetype){
        var cc = __imns('component.classes');
        return this.extensionlibrary.add(extension, mimetype); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.determineExtensionFromFileName
        @requires util.tools.findExtensionFromFileName
        @param {String} filename
        @return {String|null} filename extension
     */
    adr.MimeTypeLibrary.prototype.determineExtensionFromFileName = function(filename){
        var ut = __imns('util.tools');
        return ut.findExtensionFromFilename(filename); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.determineMimeTypeFromFilename
        @param {String} filename
        @return {String|null} mimetype
    */
    adr.MimeTypeLibrary.prototype.determineMimeTypeFromFileName = function(filename){
        var ext = this.determineExtensionFromFileName(filename);
        return this.extensionlibrary.findMimeTypeForFileExtension(ext); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.addMimeReference
        @param {String} mimetype
        @param {String|Array} handler
        @param {String} [opt] extension
        @return {Boolean}
    */
    adr.MimeTypeLibrary.prototype.addMimeReference = function(mimetype, handler, extension){
        if(extension !== undefined){ this.extensionlibrary.add(extension, mimetype); }
        this.handlerlibrary.add(handler, mimetype);
        return this.mimelibrary.add(mimetype, handler); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.addMultipleMimeReferences
        @param {Array} a
    */
    adr.MimeTypeLibrary.prototype.addMultipleMimeReferences = function(a){
        var uv = __imns('util.validation');
        if(uv.isArray(a)){
            for(var i=0, imax = a.length; i<imax; i+=1){
                if(uv.isArray(a[i])){
                    if(a[i].length === 3){ 
                        this.addMimeReference(a[i][0], a[i][1], a[i][2]);
                    } else if (a[i].length === 2){ 
                        this.addMimeReference(a[i][0], a[i][1]); }}}}};
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.addFileExtensionReference
        @param {String} extension
        @param {String} mimetype
        @param {String|Array} handler
        @return {Boolean}
     */
    adr.MimeTypeLibrary.prototype.addFileExtensionReference = function(extension, mimetype, handler){
        if(handler !== undefined){
            this._addCOMReference(handler, mimetype);
            this.mimelibrary.add(mimetype, handler); }
        return this.extensionlibrary.add(extension, mimetype); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.addCOMReference
        @param {String} handler
        @param {String|Array} mimetype
        @param {String} extension
        @return {Boolean}
     */
    adr.MimeTypeLibrary.prototype.addCOMReference = function(handler, mimetype, extension){
        if(extension !== undefined){ this.extensionlibrary.add(extension, mimetype); }
        this.mimelibrary.add(mimetype, handler);
        return this.handlerlibrary.add(handler, mimetype); };
     /**
        @alias MimeTypeLibrary.addCOMReference
      */
     adr.MimeTypeLibrary.prototype.addActiveXReference = adr.MimeTypeLibrary.prototype.addCOMReference;

    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.mimeExists
        @param {String} mimetype
        @description - does mimetype exist?
     */
    adr.MimeTypeLibrary.prototype.mimeExists = function(mimetype){ return this.mimelibrary.exists(mimetype); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.comExists
        @param {String} handler
        @description - does activeX handler exist?
     */
    adr.MimeTypeLibrary.prototype.comExists = function(handler){ return this.handlerlibrary.exists(handler); };
    /**
        @class MimeTypeLibrary
        @method MimeTypeLibrary.checkPluginByMimeType
        @param {String} mimetype
    */
    adr.MimeTypeLibrary.prototype.checkPluginByMimeType = function(mimetype){
        var ut = __imns('util.tools'), cc = __imns('component.classes'), ref = this.mimelibrary.find(mimetype);
        if(ref instanceof cc.MimeTypeReference){
            if(ref.checked){ 
                return ref.exists; 
            } else if(ref.canNativeCheck()){
                ref.check();
                return ref.exists();
            } else {
                if(window.vbsActive !== undefined && window.vbsActive){
                    var handlers = this.mimelibrary.findHandlers(mimetype), hasHandler = false;
                    for(var i=0, imax= handlers.length; i < imax; i += 1){
                        var doesExist = ut.vbsPluginCheck(handlers[i]);
                        if(doesExist){ 
                            this.comExists(handlers[i]);
                            hasHandler = true; }}
                    return hasHandler; }}}
        return false; };

    var ut = __imns('util.tools');
    ut.determineMimeTypeFromFileExtension = function(filename){
        var cc = __imns('component.classes');
        return (new cc.MimeTypeLibrary()).determineMimeTypeFromFileExtension(filename); };

    (new adr.MimeTypeLibrary()).addMultipleMimeReferences([
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.2', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.3', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.4', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.5', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.6', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.7', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.8', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.9', 'swf'],
        ['application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.10', 'swf'],
        ['application/x-shockwave-flash', 'Flash10e.ocx', 'swf'],
        ['application/x-shockwave-flash', 'Flash9.ocx', 'swf'],
        ['application/x-shockwave-flash', 'Flash8.ocx', 'swf'],
        ['application/x-shockwave-flash', 'Flash.ocx', 'swf'],
        ['application/futuresplash', 'ShockwaveFlash.ShockwaveFlash', 'spl'],
        ['application/pdf', 'PDF.PdfCtrl.1', 'pdf'],
        ['application/pdf', 'AcroExch.Document', 'pdf'],
        ['application/pdf', 'AcroIEHelper.ocx', 'pdf'],
        ['application/x-ms-wmz', 'WMPlayer.OCX', 'wmz'],
        ['application/x-ms-wmz', 'MediaPlayer.MediaPlayer.1', 'wmz'],
        ['application/x-ms-wmz', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wmz'],
        ['application/x-ms-wmz', 'rmocx.RealPlayer G2 Control', 'wmz'],
        ['application/x-ms-wmd', 'WMPlayer.OCX', 'wmd'],
        ['application/x-ms-wmd', 'MediaPlayer.MediaPlayer.1', 'wmd'],
        ['application/x-ms-wmd', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wmd'],
        ['application/x-ms-wmd', 'rmocx.RealPlayer G2 Control', 'wmd'],
        ['application/x-silverlight', 'Windows.XamlDocument', 'xaml'],
        ['application/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1', 'mp4'],
        ['application/mp4', 'QuickTime.QuickTime.4', 'mp4'],
        ['application/mp4', 'QuickTime.QuickTime', 'mp4'],
        ['application/x-ms-xbap', 'Windows.Xbap', 'mp4'],
        ['application/xaml+xml', 'Windows.XamlDocument', 'xaml'],
        ['video/x-ms-wmv', 'WMPlayer.OCX', 'wmv'],
        ['video/x-ms-wmv', 'MediaPlayer.MediaPlayer.1', 'wmv'],
        ['video/x-ms-wmv', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wmv'],
        ['video/x-ms-wmv', 'rmocx.RealPlayer G2 Control', 'wmv'], 
        ['video/x-ms-asf', 'WMPlayer.OCX', 'asf'], 
        ['video/x-ms-asf', 'MediaPlayer.MediaPlayer.1', 'asf'],
        ['video/x-ms-asf', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'asf'],
        ['video/x-ms-asf', 'rmocx.RealPlayer G2 Control', 'asf'],
        ['video/x-ms-wma', 'WMPlayer.OCX', 'wma'],
        ['video/x-ms-wma', 'MediaPlayer.MediaPlayer.1', 'wma'],
        ['video/x-ms-wma', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wma'], 
        ['video/x-ms-wma', 'rmocx.RealPlayer G2 Control', 'wma'],
        ['video/x-ms-wax', 'WMPlayer.OCX', 'wax'], 
        ['video/x-ms-wax', 'MediaPlayer.MediaPlayer.1', 'wax'], 
        ['video/x-ms-wax', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wax'],
        ['video/x-ms-wax', 'rmocx.RealPlayer G2 Control', 'wax'],
        ['video/x-ms-wvx', 'WMPlayer.OCX', 'wvx'],
        ['video/x-ms-wvx', 'MediaPlayer.MediaPlayer.1', 'wvx'],
        ['video/x-ms-wvx', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wvx'], 
        ['video/x-ms-wvx', 'rmocx.RealPlayer G2 Control', 'wvx'], 
        ['video/quicktime', 'QuickTimeCheckObject.QuickTimeCheck.1', 'mov'], 
        ['video/quicktime', 'QuickTime.QuickTime.4', 'mov'],
        ['video/quicktime', 'QuickTime.QuickTime', 'mov'],
        ['video/mpeg', 'WMPlayer.OCX', 'mpeg'], 
        ['video/mpeg', 'MediaPlayer.MediaPlayer.1', 'mpg'],
        ['video/mpeg', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'mpg'],
        ['video/mpeg', 'rmocx.RealPlayer G2 Control', 'mpg'], 
        ['video/mpeg', 'QuickTimeCheckObject.QuickTimeCheck.1', 'mpg'], 
        ['video/mpeg', 'QuickTime.QuickTime.4', 'mpg'], 
        ['video/mpeg', 'QuickTime.QuickTime', 'mpg'], 
        ['video/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1', 'mpg'], 
        ['video/mp4', 'QuickTime.QuickTime.4', 'mp4'],
        ['video/mp4', 'QuickTime.QuickTime', 'mp4'], 
        ['video/x-msvideo', 'WMPlayer.OCX', 'wmv'], 
        ['video/x-msvideo', 'MediaPlayer.MediaPlayer.1', 'wmv'], 
        ['audio/x-pn-realaudio-plugin', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'rm'],
        ['audio/x-pn-realaudio-plugin', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'ra'],
        ['audio/mpeg', 'WMPlayer.OCX', 'aac'],
        ['audio/mpeg', 'MediaPlayer.MediaPlayer.1', 'aac'], 
        ['audio/mpeg', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'aac'],
        ['audio/mpeg', 'rmocx.RealPlayer G2 Control', 'aac'], 
        ['audio/mpeg', 'QuickTimeCheckObject.QuickTimeCheck.1', 'aac'], 
        ['audio/mpeg', 'QuickTime.QuickTime.4', 'aac'],
        ['audio/mpeg', 'QuickTime.QuickTime', 'aac'],
        ['audio/mp3', 'WMPlayer.OCX', 'mp3'], 
        ['audio/mp3', 'MediaPlayer.MediaPlayer.1', 'mp3'],
        ['audio/mp3', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'mp3'], 
        ['audio/mp3', 'rmocx.RealPlayer G2 Control', 'mp3'],
        ['audio/mp3', 'QuickTimeCheckObject.QuickTimeCheck.1', 'mp3'],
        ['audio/mp3', 'QuickTime.QuickTime.4', 'mp3'],
        ['audio/mp3', 'QuickTime.QuickTime', 'mp3'],
        ['audio/x-wav', 'WMPlayer.OCX', 'wav'], 
        ['audio/x-wav', 'MediaPlayer.MediaPlayer.1', 'wav'], 
        ['audio/x-wav', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'wav'],
        ['audio/x-wav', 'rmocx.RealPlayer G2 Control', 'wav'], 
        ['audio/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1', 'm4a'],
        ['audio/mp4', 'QuickTime.QuickTime.4', 'm4a'],
        ['audio/mp4', 'QuickTime.QuickTime', 'm4a'], 
        ['audio/opus', 'WMPlayer.OCX', 'opus'],
        ['audio/opus', 'QuickTime.QuickTime', 'opus'],
        ['audio/opus', 'QuickTime.QuickTime.4', 'opus'],
        ['audio/ogg', 'WMPlayer.OCX', 'ogg'],
        ['audio/ogg', 'QuickTime.QuickTime', 'ogg'],
        ['audio/ogg', 'QuickTime.QuickTime.4', 'ogg'],
        ['audio/ogg', 'WMPlayer.OCX', 'oga'],
        ['audio/ogg', 'QuickTime.QuickTime', 'oga'],
        ['audio/ogg', 'QuickTime.QuickTime.4', 'oga'],
        ['audio/x-flac', 'QuickTime.QuickTime.4', 'flac'],
        ['image/x-quicktime', 'QuickTimeCheckObject.QuickTimeCheck.1', ''],
        ['image/x-quicktime', 'QuickTime.QuickTime.4', ''], 
        ['image/x-quicktime', 'QuickTime.QuickTime', ''], 
        ['image/svg+xml', 'Adobe.SVGCtl', '']
    ]);
}
