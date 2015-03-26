"use strict";
/* global navigator, window, window.vbsActive, vbsPluginCheck, ActiveXReference, MimeTypeReference, */
		function MimeTypeReference(_t, _h){
			this._type =_t;
			this._handlers = [];
			this._handlers.push(_h);
			this._exists = false;
			this._checked = false; }
		MimeTypeReference.prototype.addHandler = function(_h){
			var adding = true;
			for(var i=0, imax=this._handlers.length; i<imax; i += 1){
				if(this._handlers[i] === _h){
					adding = false;
					break; }}
			if(adding){
				this._handlers.push(_h);
				return true;
			} else { return false; }};
		MimeTypeReference.prototype.confirmed = function(){
			if(!this._checked){
				this._exists = true;
				this._checked = true; }};

		function ActiveXReference(_h, _t){
			this._handler = _h;
			this._types = [];
			this._types.push(_t);
			this._exists = false;
			this._checked = false; }
		
		ActiveXReference.prototype.exists = function(){
			if(!this._checked){
				var doesExist = false;
				doesExist = vbsPluginCheck(this._handler);
				// probably should have a doesExist check here if(doesExist){}
				this._checked = true;
				this._exists = doesExist; }
			return this._exists; };
		ActiveXReference.prototype.confirmed = function(){
			if(!this._checked){
				this._exists = true;
				this._checked = true; }};
		ActiveXReference.prototype.addType = function(_t){
			var adding = true;
			for(var i=0, imax=this._types.length; i<imax; i += 1){
				if(this._types[i] === _t){
					adding = false;
					break; }}
			if(adding){
				this._types.push(_t);
				return true;
			} else { return false; }};

function MimeTypeLibrary(){
	if(MimeTypeLibrary.prototype.singleton !== undefined){
		return MimeTypeLibrary.prototype.singleton;
	} else { MimeTypeLibrary.prototype.singleton = this; }
	this._mimelibrary = [];
	this._typelibrary = []; }

MimeTypeLibrary.prototype.addMimeReference = function(_t, _h){
	if(arguments[2] === undefined || arguments[2] !== "closekill"){ this.addCOMReference(_h, _t, "closekill"); }
	if(this._mimelibrary[_t]){
		return this._mimelibrary[_t].addHandler(_h);
	} else {
		this._mimelibrary[_t] = new MimeTypeReference(_t, _h);
		return true; }};

MimeTypeLibrary.prototype.addCOMReference = function(_h, _t){
	if(arguments[2] === undefined || arguments[2] !== "closekill"){ this.addMimeReference(_t, _h, "closekill"); }
	if(this._typelibrary[_h]){
		return this._typelibrary[_h].addType(_t);
	} else {
		this._typelibrary[_h] = new ActiveXReference(_h, _t);
		return true; }};

MimeTypeLibrary.prototype.mimeExists = function(_m){
	for(var prop in this._mimelibrary){
		if(prop === _m){
			this._mimelibrary[prop].confirmed();
			for(var i=0, imax = this._mimelibrary[prop]._handlers.length; i<imax; i += 1){ 
				this._typelibrary[this._mimelibrary[prop]._handlers[i]].confirmed(); }}}};

MimeTypeLibrary.prototype.comExists = function(_c){
	for(var prop in this._typelibrary){
		if(prop === _c){
			this._typelibrary[prop].confirmed();
			for(var i=0, imax = this._typelibrary[prop]._types.length; i < imax; i += 1){
				this._mimelibrary[this._typelibrary[prop]._types[i]].confirmed(); }}}};

MimeTypeLibrary.prototype.checkPluginByMimeType = function(_mimeStr){
	if(this._mimelibrary[_mimeStr] !== undefined && this._mimelibrary[_mimeStr]._checked){
		return this._mimelibrary[_mimeStr]._exists;
	} else {
		if('mimeTypes' in navigator){
			if(navigator.mimeTypes.length > 0){
				if(navigator.mimeTypes[_mimeStr] !== undefined){
					if('enabledPlugin' in navigator.mimeTypes[_mimeStr] && navigator.mimeTypes[_mimeStr].enabledPlugin){
						this.mimeExists(_mimeStr);
						return true; }}
				return false;
			} else {
				if(window.vbsActive !== undefined && window.vbsActive){
					if(this._mimelibrary[_mimeStr] !== undefined){
						var hasHandler = false;
						for(var i=0, imax=this._mimelibrary[_mimeStr]._handlers.length; i < imax; i += 1){
							var doesExist = vbsPluginCheck(this._mimelibrary[_mimeStr]._handlers[i]);
							if(doesExist){ 
								this.comExists(this._mimelibrary[_mimeStr]._handlers[i]);
								hasHandler = true; }}
						return hasHandler; }}
				return false; }
		} else { return false; }}};

var mimeLib = new MimeTypeLibrary();
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.2');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.3');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.4');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.5');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.6');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.7');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.8');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.9');
mimeLib.addMimeReference('application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash.10');
mimeLib.addMimeReference('application/x-shockwave-flash', 'Flash10e.ocx');
mimeLib.addMimeReference('application/x-shockwave-flash', 'Flash9.ocx');
mimeLib.addMimeReference('application/x-shockwave-flash', 'Flash8.ocx');
mimeLib.addMimeReference('application/x-shockwave-flash', 'Flash.ocx');
mimeLib.addMimeReference('application/futuresplash', 'ShockwaveFlash.ShockwaveFlash');
mimeLib.addMimeReference('application/pdf', 'PDF.PdfCtrl.1');
mimeLib.addMimeReference('application/pdf', 'AcroExch.Document');
mimeLib.addMimeReference('application/pdf', 'AcroIEHelper.ocx');
mimeLib.addMimeReference('application/x-ms-wmz', 'WMPlayer.OCX');
mimeLib.addMimeReference('application/x-ms-wmz', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('application/x-ms-wmz', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('application/x-ms-wmz', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('application/x-ms-wmd', 'WMPlayer.OCX');
mimeLib.addMimeReference('application/x-ms-wmd', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('application/x-ms-wmd', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('application/x-ms-wmd', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('application/x-silverlight', 'Windows.XamlDocument');
mimeLib.addMimeReference('application/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('application/mp4', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('application/mp4', 'QuickTime.QuickTime');
mimeLib.addMimeReference('application/x-ms-xbap', 'Windows.Xbap');
mimeLib.addMimeReference('application/xaml+xml', 'Windows.XamlDocument');

mimeLib.addMimeReference('video/x-ms-wmv', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-ms-wmv', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/x-ms-wmv', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/x-ms-wmv', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/x-ms-asf', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-ms-asf', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/x-ms-asf', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/x-ms-asf', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/x-ms-wma', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-ms-wma', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/x-ms-wma', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/x-ms-wma', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/x-ms-wax', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-ms-wax', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/x-ms-wax', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/x-ms-wax', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/x-ms-wvx', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-ms-wvx', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/x-ms-wvx', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/x-ms-wvx', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/quicktime', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('video/quicktime', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('video/quicktime', 'QuickTime.QuickTime');
mimeLib.addMimeReference('video/mpeg', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/mpeg', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('video/mpeg', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('video/mpeg', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('video/mpeg', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('video/mpeg', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('video/mpeg', 'QuickTime.QuickTime');
mimeLib.addMimeReference('video/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('video/mp4', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('video/mp4', 'QuickTime.QuickTime');
mimeLib.addMimeReference('video/x-msvideo', 'WMPlayer.OCX');
mimeLib.addMimeReference('video/x-msvideo', 'MediaPlayer.MediaPlayer.1');

mimeLib.addMimeReference('audio/x-pn-realaudio-plugin', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('audio/mpeg', 'WMPlayer.OCX');
mimeLib.addMimeReference('audio/mpeg', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('audio/mpeg', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('audio/mpeg', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('audio/mpeg', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('audio/mpeg', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('audio/mpeg', 'QuickTime.QuickTime');
mimeLib.addMimeReference('audio/mp3', 'WMPlayer.OCX');
mimeLib.addMimeReference('audio/mp3', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('audio/mp3', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('audio/mp3', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('audio/mp3', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('audio/mp3', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('audio/mp3', 'QuickTime.QuickTime');
mimeLib.addMimeReference('audio/x-wav', 'WMPlayer.OCX');
mimeLib.addMimeReference('audio/x-wav', 'MediaPlayer.MediaPlayer.1');
mimeLib.addMimeReference('audio/x-wav', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)');
mimeLib.addMimeReference('audio/x-wav', 'rmocx.RealPlayer G2 Control');
mimeLib.addMimeReference('audio/mp4', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('audio/mp4', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('audio/mp4', 'QuickTime.QuickTime');

mimeLib.addMimeReference('image/x-quicktime', 'QuickTimeCheckObject.QuickTimeCheck.1');
mimeLib.addMimeReference('image/x-quicktime', 'QuickTime.QuickTime.4');
mimeLib.addMimeReference('image/x-quicktime', 'QuickTime.QuickTime');
mimeLib.addMimeReference('image/svg+xml', 'Adobe.SVGCtl');
