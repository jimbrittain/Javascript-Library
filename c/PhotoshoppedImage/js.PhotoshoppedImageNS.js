"use strict";
/*global document, window, console, __imns, setInterval, clearInterval */
/*jshint -W069 */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('PhotoshoppedImages' in adr)){


    adr.PhotoshoppedImages = function(){
        var cc = __imns('component.classes');
        if(cc.PhotoshoppedImages.prototype.singleton !== undefined){ return cc.PhotoshoppedImages.prototype.singleton; } else { cc.PhotoshoppedImages.prototype.singleton = this; }
        this.idcount = -1;
        this.tested = 'pending';
        this.shopped_class = 'shopped';
        this.unshopped_class = 'unshopped';
        this.direction = 'right';
        this.mouserecord = '';
        this.varyclip = true;
        this.psimages = []; 
        this.construct(); };
    adr.PhotoshoppedImages.prototype.construct = function(){
        var uc = __imns('util.classes');
        this.psimages = [];
        this.mouserecord = new uc.MouseRecorder();
        this.mouserecord.setRecord({
            'name' : 'photoshopped', 
            'jsObject' : this, 
            'type' : 'both'}); };
    adr.PhotoshoppedImages.prototype.addImage = function(psi){
        var cc = __imns('component.classes');
        if(psi instanceof cc.PhotoshoppedImage){
            var checked = this.findImage(psi);
            if(!(checked instanceof cc.PhotoshoppedImage)){
                this.psimages.push(psi);
                this.idcount += 1;
                return this.idcount; }} else { return false; }
        return false; };
    adr.PhotoshoppedImages.prototype.findImageIdFromHolder = function(holder){
        var id = -1;
        if(holder !== undefined){
            for(var i=0, imax = this.psimages.length; i<imax; i+=1){
                if(holder === this.psimages[i].holder){ return i; }}}
        return id; };
    adr.PhotoshoppedImages.prototype.findImageFromHolder = function(holder){
        var id = (holder !== undefined) ? this.findImageIdFromHolder(holder) : -1;
        if(id === -1){
            return null;
        } else { return this.psimages[id]; }};
    adr.PhotoshoppedImages.prototype.findImageFromInstance = function(obj){
        var cc = __imns('component.classes');
        if(obj instanceof cc.PhotoshoppedImage){
            for(var i=0, imax=this.psimages.length; i<imax; i+=1){
                if(obj === this.psimages[i]){ return this.psimages[i]; }}}
        return null; };
    adr.PhotoshoppedImages.prototype.findImage = function(obj){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(obj instanceof cc.PhotoshoppedImage){
            this.findImageFromInstance(obj);
        } else if(uv.isNumber(obj) && obj > -1 && obj < this.psimages.length && parseInt(obj) === obj){
            return this.psimages[obj];
        } else if(obj !== undefined && uv.isHTMLElement(obj)){ return this.findImageFromHolder(obj); }
        return null; };
    adr.PhotoshoppedImages.prototype.isCSSReady = function(test){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        if(this.tested !== 'pending'){ 
            return this.tested;
        } else {
            var result = null;
            test = (test !== undefined && test instanceof cc.PhotoshoppedImage) ? test : false;
            result = (test !== false) ? (new uc.SupportedCSSProperty('clip', test.holder)).exists() : (new uc.SupportedCSSProperty('clip')).exists();
            this.tested = result;
            cc.PhotoshoppedImages.prototype.isCSSReady = function(){ return this.tested; }; //overwrite isCSSReady;
            return result; }};
    adr.PhotoshoppedImages.prototype.setClipDirection = function(dir, obj){ //obj is optional, when omitted does all;
        var cc = __imns('component.classes');
        dir = (dir === 'up') ? 'bottom' : dir;
        dir = (dir === 'down') ? 'top' : dir;
        if(dir !== undefined){
            if(dir === 'left' || dir === 'right' || dir === 'top' || dir === 'bottom'){
                if(obj !== undefined){
                    var n = this.findImage(obj);
                    if(n instanceof cc.PhotoshoppedImage){ 
                        n.setClipDirection(dir);
                        return true;
                    } else { return false;  }
                } else {
                    this.direction = dir;
                    for(var i = 0, imax = this.psimages.length; i<imax; i+=1){
                        this.psimages[i].setClipDirection(dir); }}
                    return true;
            } else { return false; }
        } else { return false; }};
    adr.PhotoshoppedImages.prototype.varyClipDirection = function(boo, obj){
        var cc = __imns('component.classes');
        boo = (boo !== undefined && (boo === true || boo === false)) ? boo : -1;
        boo = (boo === -1) ? !this.varyclip : boo;
        if(obj !== undefined){
            var n = this.findImage(obj);
            if(n instanceof cc.PhotoshoppedImage){ 
                n.varyClipDirection(boo);
                return true;
            } else { return false; }
        } else {
            this.varyclip = boo;
            for(var i=0, imax = this.psimages.length; i<imax; i+=1){
                this.psimages[i].varyClipDirection(boo); }
            return true; }};
    adr.PhotoshoppedImage = function(o){ 
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        this.id = -1;
        this.holder = '';
        this.shopped_image = '';
        this.unshopped_image = '';
        this.master = new cc.PhotoshoppedImages();
        this.full_width = 300;
        this.full_height = 1000;
        this.direction = this.master.direction;
        this.varyclip = this.master.varyclip;
        this.initiated = false;
        this.working = false;
        this.currentpos = new uc.Coordinates();
        return (o !== undefined) ? this.init(o) : this; };
    adr.PhotoshoppedImage.prototype.init = function(o){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ut = __imns('util.tools');
        var initHolder = "", initShopped = "", initUnshopped = "";
        if(o !== undefined && uv.isHTMLElement(o)){
            initHolder = o;
        } else if('holder' in o){
            initHolder = ('holder' in o && o.holder !== undefined && uv.isHTMLElement(o.holder)) ? o.holder : "";
            initShopped = ('shopped' in o && o.shopped !== undefined && uv.isHTMLElement(o.shopped)) ? o.shopped : "";
            initUnshopped = ('unshopped' in o && o.unshopped !== undefined && uv.isHTMLElement(o.unshopped)) ? o.unshopped : ""; }
        if(initHolder !== ""){
            var n = this.master.findImageIdFromHolder(initHolder);
            if(n !== -1){
                return n;
            } else {
                var childrenArr = [], on = "";
                this.id = this.master.addImage(this);
                this.holder = initHolder;
                if(initShopped !== "" && uv.isChildOf(initShopped, initHolder)){
                    this.shopped_image = initShopped;
                } else {
                    childrenArr = ut.htmlNodesToArray(this.holder.childNodes);
                    while(childrenArr.length > 0){
                        if(uv.isHTMLElement(childrenArr[0])){
                            if(ut.hasClass(childrenArr[0], this.master.shopped_class)){
                                this.shopped_image = childrenArr[0];
                                childrenArr = [];
                            } else {
                                if(childrenArr[0].childNodes){ childrenArr.concat(ut.htmlNodesToArray(childrenArr[0].childNodes)); }}}
                        if(childrenArr.length > 0){ childrenArr.shift(); }}}
                if(initUnshopped !== "" && ut.isChildOf(initUnshopped, initHolder)){
                    this.unshopped_image = initUnshopped;
                } else {
                    childrenArr = ut.htmlNodesToArray(this.holder.childNodes);
                    while(childrenArr.length > 0){
                        if(uv.isHTMLElement(childrenArr[0])){
                            if(ut.hasClass(childrenArr[0], this.master.unshopped_class)){
                                this.unshopped_image = childrenArr[0];
                                childrenArr = [];
                            } else {
                                if(childrenArr[0].childNodes){ childrenArr.concat(ut.htmlNodesToArray(childrenArr[0].childNodes)); }}}
                        if(childrenArr.length > 0){ childrenArr.shift(); }}}
                this.initiated = (this.id !== false && this.shopped_image !== "" && this.unshopped_image !== "") ? true : false; }
            this.initiated = (this.initiated) ? this.build() : false; }
        return this; };
    adr.PhotoshoppedImage.prototype.build = function(){ return (this.prepareHolder() && this.prepareShoppedImage() && this.prepareUnshoppedImage()); };
    adr.PhotoshoppedImage.prototype.active = function(){ 
        var uv = __imns('util.validation');
        if(this.initiated && this.holder !== undefined && uv.isHTMLElement(this.holder) && this.shopped_image !== undefined && uv.isHTMLElement(this.shopped_image) && this.unshopped_image !== undefined && uv.isHTMLElement(this.unshopped_image)){
            this.active = function(){ return true; };
        } else { this.active = function(){ return false; }; }
        return this.active; };
    adr.PhotoshoppedImage.prototype.calculateFullWidth = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.active() && this.shopped_image !== undefined && uv.isHTMLElement(this.shopped_image)){
            this.full_width = Math.floor(parseFloat(ud.findElementStyle(this.shopped_image, 'width')));
            return this.full_width;
        } else {
            this.full_width = 0;
            return 0; }};
    adr.PhotoshoppedImage.prototype.calculateFullHeight = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.active() && this.shopped_image !== undefined && uv.isHTMLElement(this.shopped_image)){
            this.full_height = Math.floor(parseFloat(ud.findElementStyle(this.shopped_image, 'height')));
            return this.full_height;
        } else {
            this.full_height = 0;
            return 0; }};
    adr.PhotoshoppedImage.prototype.prepareHolder = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.active() && this.holder !== undefined && uv.isHTMLElement(this.holder)){
            var curr = ud.findElementStyle(this.holder, 'position');
            if(!(curr === 'relative' || curr === 'absolute')){ this.holder.style['position'] = 'relative'; }
            this.setDownActions();
            return true;
        } else { return false; }};
    adr.PhotoshoppedImage.prototype.prepareShoppedImage = function(){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ud = __imns('util.dom');
        if(this.active() && this.shopped_image !== undefined && uv.isHTMLElement(this.shopped_image)){
            if(ud.findElementStyle(this.shopped_image, 'position') !== 'relative'){ this.shopped_image.style['position'] = 'relative'; }
            //disable ondrag?
            this.currentpos = new uc.Coordinates(this.calculateFullWidth(), this.calculateFullHeight());
            return (this.currentpos.x === 0 || this.currentpos.y === 0) ? false : true;
        } else { return false; }};
    adr.PhotoshoppedImage.prototype.prepareUnshoppedImage = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.active() && this.unshopped_image !== undefined && uv.isHTMLElement(this.unshopped_image)){
            if(ud.findElementStyle(this.unshopped_image, 'position') !== 'absolute'){
                this.unshopped_image.style['position'] = 'absolute';
                this.unshopped_image.style['top'] = 0;
                this.unshopped_image.style['left'] = 0; }
            this.doClip(this.offCoordinates());
            if(ud.findElementStyle(this.unshopped_image, 'visibility') !== 'visible'){ this.unshopped_image.style['visibility'] = 'visible'; }
            return true;
        } else { return false; }};
    adr.PhotoshoppedImage.prototype.setMoveActions = function(obj){
        var cc = __imns('component.classes');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        obj.removeMoveActions();
        var m = obj;
        obj.interval_id = setInterval(function(){ 
            var ut = __imns('util.tools');
            ut.debounce(function(){ m.moveActions(m); }, 50); });
        return true; };
    adr.PhotoshoppedImage.prototype.removeMoveActions = function(obj){
        var cc = __imns('component.classes');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        if(obj.interval_id !== null){
            clearInterval(obj.interval_id);
            obj.interval_id = null; }
        return true; };
    adr.PhotoshoppedImage.prototype.moveActions = function(obj){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        if(obj.working){
            var onCoords = new uc.Coordinates(obj.master.mouserecord.x, obj.master.mouserecord.y);
            var bounds = new uc.BoundaryCoordinates(obj.holder);
            if((onCoords.x >= bounds.x1 && onCoords.x <= bounds.x2) && (onCoords.y >= bounds.y1 && onCoords.y <= bounds.y2)){
                if(this.currentpos.x !== obj.master.mouserecord.x || this.currentpos.y !== obj.master.mouserecord.y){
                    var clipCoords = new uc.Coordinates(Math.round(onCoords.x - bounds.x1), Math.round(onCoords.y - bounds.y1));
                    this.doClip(clipCoords); }
            } else {
                obj.removeMoveActions();
                obj.removeUpActions();
                obj.setDownActions(); }
        } else { obj.removeMoveActions(); }
        this.currentpos = new uc.Coordinates(obj.master.mouserecord.x, obj.master.mouserecord.y); };
    adr.PhotoshoppedImage.prototype.detectClipDirection = function(){
        var uc = __imns('util.classes');
        var onCoords = new uc.Coordinates(this.master.mouserecord.x, this.master.mouserecord.y);
        if(!this.working){
            var bounds = new uc.BoundaryCoordinates(this.holder);
            var o = {
                'top' : onCoords.y - bounds.y1, 
                'bottom' : onCoords.y - bounds.y2, 
                'left' : onCoords.x - bounds.x1, 
                'right' : onCoords.x - bounds.x2 };
            var dir = '', lowest = bounds.y2;
            for(var prop in o){
                if(o.hasOwnProperty(prop)){
                    if(Math.abs(o[prop]) <= lowest){
                        lowest = Math.abs(o[prop]);
                        dir = prop; }}}
            switch(dir){
                case "top":
                    dir = 'bottom';
                    break;
                case "bottom":
                    dir = 'top';
                    break;
                case "right":
                    dir = 'left';
                    break;
                case "left":
                /*falls through*/
                default:
                    dir = 'right';
                    break; }
            this.setClipDirection(dir); }};
    adr.PhotoshoppedImage.prototype.setDownActions = function(obj){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        ut.fetter(obj.holder, "mouseenter", [obj, function(){ if(obj.varyclip){ obj.detectClipDirection(); }}], true);
        ut.fetter(obj.holder, "mouseenter touchstart", [obj, function(){ obj.downActions(obj); }], false);
        return true; };
    adr.PhotoshoppedImage.prototype.removeDownActions = function(obj){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        ut.unfetter(obj.holder, "mouseenter", [obj, function(){ if(obj.varyclip){ obj.detectClipDirection(); }}], true);
        ut.unfetter(obj.holder, "mouseenter touchstart", [obj, function(){ obj.downActions(obj); }], false);
        return true; };
    adr.PhotoshoppedImage.prototype.downActions = function(obj){
        var cc = __imns('component.classes');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        obj.working = true;
        obj.removeDownActions(obj);
        obj.setUpActions(obj);
        obj.setMoveActions(obj);
        return true; };
    adr.PhotoshoppedImage.prototype.setUpActions = function(obj){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        obj.removeUpActions(obj);
        obj.setDownActions(obj);
        ut.fetter(obj.holder, "mouseleave touchend", [obj, function(){ obj.upActions(obj); }], false);
        return true; };
    adr.PhotoshoppedImage.prototype.removeUpActions = function(obj){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        ut.unfetter(obj.holder, "mouseleave touchend", [obj, function(){ obj.upActions(obj); }], false);
        return true; };
    adr.PhotoshoppedImage.prototype.upActions = function(obj){
        var cc = __imns('component.classes');
        obj = (obj instanceof cc.PhotoshoppedImage) ? obj.master.findImage(obj.id) : this;
        obj.working = false;
        obj.doClip(obj.offCoordinates());
        obj.removeUpActions();
        obj.removeDownActions();
        obj.setDownActions(); 
        return true; };
    adr.PhotoshoppedImage.prototype.offCoordinates = function(){ 
        var uc = __imns('util.classes');
        return (new uc.Coordinates((this.direction === 'left') ? this.full_width : 0, (this.direction === 'top') ? this.full_height : 0)); };
    adr.PhotoshoppedImage.prototype.varyClipDirection = function(boo){
        boo = (boo !== undefined && (boo === true || boo === false)) ? boo : -1;
        boo = (boo === -1) ? !this.varyclip : boo;
        this.varyclip = boo;
        return true; };
    adr.PhotoshoppedImage.prototype.setClipDirection = function(dir){
        var uc = __imns('util.classes');
        dir = (dir === 'up') ? 'bottom' : dir;
        dir = (dir === 'down') ? 'top' : dir;
        if(dir !== undefined && (dir === 'left' || dir === 'right' || dir === 'top' || dir === 'bottom')){
            this.direction = dir;
            var onCoords = this.currentpos;
            var bounds = new uc.BoundaryCoordinates(this.holder);
            if(this.working){
                if((onCoords.x >= bounds.x1 && onCoords.x <= bounds.x2) && (onCoords.y >= bounds.y1 && onCoords.y <= bounds.y2)){
                    if(this.currentpos.x !== this.master.mouserecord.x || this.currentpos.y !== this.master.mouserecord.y){
                        var clipCoords = new uc.Coordinates(Math.round(onCoords.x - bounds.x1), Math.round(onCoords.y - bounds.y1));
                        this.doClip(clipCoords); }}
            } else { this.doClip(this.offCoordinates()); }}};
    adr.PhotoshoppedImage.prototype.prepareHolderActions = function(){
        var uv = __imns('util.validation');
        if(this.active() && this.holder !== undefined && uv.isHTMLElement(this.holder)){ 
            this.working = false;
            this.setDownActions(this); }};
    adr.PhotoshoppedImage.prototype.doClip = function(coords){
        if(this.direction === 'right' || this.direction === 'left'){
            if(this.active() && this.initiated){
                this.unshopped_image.style['clip'] = 'rect(auto ' + ((this.direction === 'right') ? ((Math.ceil(coords.x)) + 'px') : 'auto') + ' auto ' + ((this.direction === 'left') ? (Math.ceil(coords.x) + 'px') : 'auto') + ')'; }
        } else if(this.direction === 'top' || this.direction === 'bottom'){
            if(this.active() && this.initiated){
                this.unshopped_image.style['clip'] = 'rect(' + ((this.direction === 'top') ? (Math.ceil(coords.y) + 'px') : 'auto') + ', auto, ' + ((this.direction === 'bottom') ? (Math.ceil(coords.y) + 'px') : 'auto') + ', auto)'; }}};


}
