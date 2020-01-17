"use strict";
/* global __imns, document, console, window */
/**
 * @class WPGallery
 * @dependencies 
 *      __imns
 *      uv.isHTMLElement, uv.isString, uv.isInArray, uv.isFunction
 *      ut.handlePassedArguments, ut.fetter, ut.findEventElement, ut.findEvent, ut.preventEvent, ut.deepClone, 
 *      ud.getAttribute, ud.findElementById, ud.hasClass, ud.addClass, ud.findElementsBySelector, ud.removeClass, ud.replaceElementWith, ud.returnXMLfromString, 
 *      uc.XHConn, uc.PathInfo
 **/
var adr = __imns('component.classes');
if (!('WPGallery' in adr)) {
    adr.prepareWPGalleries = function(){
        var cv = __imns('component.vars');
        var ut = __imns('util.tools'),
            ud = __imns('util.dom');
        ut.fetter(document, 'DOMContentLoaded', ['prepareWPGalleries', function(){
            var elems = ud.findElementsByClass('wpgallery'),
                cv = __imns('component.vars'),
                cc = __imns('component.classes');
            if ('ajaxObject' in window && 'wpgalleryajl' in window.ajaxObject) { cv.wpgalleryajl = window.ajaxObject.wpgalleryajl; }
            if (!('wpgalleries' in cv)) {
                cv.wpgalleries = []; }
            for (var i=0, imax=elems.length; i<imax; i+=1) {
                var t = elems[i];
                var tid = ud.getAttribute(t, 'id');
                cv.wpgalleries.push(new cc.WPGallery({ id: tid }));
            }
        }], true, 'after');
    };
    adr.WPGallery = function(o){
        var cc = __imns('component.classes'),
            cv = __imns('component.vars');

        if (cc.WPGallery.prototype.galleries === undefined) { cc.WPGallery.prototype.galleries = []; }
        if ((cc.WPGallery.prototype.ajaxLink === '' || cc.WPGallery.prototype.ajaxLink === undefined)&& 'wpgalleryajl' in cv) {
            cc.WPGallery.prototype.ajaxLink = cv.wpgalleryajl;
        } else { cc.WPGallery.prototype.ajaxLink = ''; }

        this.gallery = '';

        this.previewName = 'preview';
        this.definition = '';

        this.galleryLink = false;
        this.ajaxLink = cc.WPGallery.prototype.ajaxLink;

        this.ajax = '';
        this.ajaxreceipts = [];
        this.ajaxid = 1;

        this.links = {
            thumbs: [],
            navigation: [] };
        return this.init(o); };

    /**
     * @method init
     * @param {String|Object}
     * @returns {WPGallery|this|FALSE}
     * @description used to establish
     **/
    adr.WPGallery.prototype.init = function(o){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var dv = __imns('application.vars'),
            cc = __imns('component.classes');

        //this.ajaxLink = cc.WPGallery.prototype.ajaxLink;
        this.ajax = new uc.XHConn();
        o = (uv.isString(o)) ? {id: o} : o;
        if (typeof o === 'object') {
            var obj = {
                id: '',
                name: ''};
            o = ut.handlePassedArguments(o, obj);
            o.id = (o.id === '') ? o.name : o.id;
            if ('id' in o) {
                if (!this.isGalleryInitialised(o.id)) {
                    this.gallery = o.id;
                    if (this.valid()) {
                        cc.WPGallery.prototype.galleries.push(this); 
                        var c = this;
                        ut.fetter(document, "DOMContentLoaded", ['WPgallery', function(evt){ c.prepare(); }], true, 'after');
                        return this;
                    } else { return false; }
                } else {
                    return this.findGallery(obj.id); }}}};
    /**
     * @method findGallery
     * @param {WPGallery|HTMLElement|String}
     * @return {WPGallery} instance
     * @description - used for creation/initialisation of gallery
     **/
    adr.WPGallery.prototype.findGallery = function(gall) {
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        var arr = cc.WPGallery.prototype.galleries,
            i = 0, imax;
        if (uv.isString(gall)) {
            for (i=0, imax = arr.length; i<imax; i+=1) {
                if (arr[i].gallery === gall) { return arr[i]; }}
        } else if (uv.isHTMLElement(gall)) {
            for (i=0, imax = arr.length; i<imax; i+=1) {
                if (arr[i].getGalleryElement() === gall) {
                    return arr[i]; }}
        } else if (typeof gall === 'object' && gall.constructor === cc.WPGallery) {
            for (i=0, imax = arr.length; i<imax; i+=1) {
                if (arr[i] === gall) { return arr[i]; }}
        }
        return false; };
    /**
     * @method isGalleryInitialised
     * @param {WPGallery|HTMLElement|String}
     * @return {Boolean}
     * @description - used for creation/initialisation of gallery
     **/
    adr.WPGallery.prototype.isGalleryInitialised = function(n)
    {
        return (this.findGallery(n) !== false) ? true : false;
    };
    /**
     * @method valid
     * @return {Boolean}
     * @description - currently only used by checking the Gallery Element exists
     **/
    adr.WPGallery.prototype.valid = function(){
        return (this.getGalleryElement() !== false) ? true : false;
    };
    /**
     * @method getGalleryElement
     * @returns {HTMLElement | FALSE}
     * @description - ensures HTMLElement exists based on gallery id
     * @dependencies findElementById, isHTMLElment
     **/
    adr.WPGallery.prototype.getGalleryElement = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if (this.galleryElement !== false) {
            var el = ud.findElementById(this.gallery);
            if (el && uv.isHTMLElement(el)) {
                this.galleryElement = el; }}
        return (uv.isHTMLElement(this.galleryElement)) ? this.galleryElement : false; };

    adr.WPGallery.prototype.getGalleryDefinition = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        if (this.definition !== '') {
            return this.definition;
        } else {
            var def = ud.findDataAttribute(this.getGalleryElement(), 'definition');
            this.definition = (uv.isString(def) && def !== '') ? def : '';
            return this.definition;
        }
    };
    adr.WPGallery.prototype.setPreviewedThumbs = function(id){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        this.clearPreviewedThumbs();
        var idString = this.getGalleryName + '-' + id;
        var thumb = ud.findElementById(idString);
        if (uv.isHTMLElement(thumb)) {
            ud.addClass(thumb, 'previewed');
            if (!this.hasPreview() && 'focus' in thumb) {
                thumb.focus(); }
            return true; }
        return false; };
    
    adr.WPGallery.prototype.clearPreviewedThumbs = function(){
        var ud = __imns('util.dom');
        var thumbs = ud.findElementsBySelector(this.getGalleryElement(), '.thumbs li'),
            count = 0;
        for (var i=0, imax = thumbs.length; i < imax; i += 1) {
            if(ud.hasClass(thumbs[i], 'previewed')) {
                count += 1;
                ud.removeClass(thumbs[i], 'previewed'); }}
        return (count > 0) ? true : false; };

    adr.WPGallery.prototype.hidePreview = function(){
        if (this.hasPreview()) {
            var ud = __imns('util.dom');
            var pi = ud.findElementsBySelector(this.getGalleryElement(), ('.' + this.previewName)),
                count = 0;
            for (var i=0, imax = pi.length; i < imax; i += 1) {
                ud.addClass(pi[i], 'hidden-preview');
                count += 1;
            }
            return (count > 0) ? true : false; }
        return false; };

    adr.WPGallery.prototype.unhidePreview = function(){
        if (this.hasPreview()) {
            var ud = __imns('util.dom');
            var pi = ud.findElementsBySelector(this.getGalleryElement(), ('.' + this.previewName + '.hidden-preview')),
                count = 0;
            for (var i=0, imax = pi.length; i < imax; i += 1) {
                ud.removeClass(pi[i], 'hidden-preview');
                count += 1; }
            return (count > 0) ? true : false; }
        return false; };
    adr.WPGallery.prototype.showPreview = function(id){
        if (this.hasPreview()) { this.unhidePreview(); } 
        this.previewedThumb(id);
    };
    /**
     * @method WPGallery.previewedThumb
     * @param id {String|Number}
     **/
    adr.WPGallery.prototype.previewedThumb = function(id){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation'),
            udb = __imns('util.debug');
        if (!uv.isNumber(id)) {
            (new udb.IMDebugger()).pass('WPGallery.previewedThumb supplied a none-number for an id');
            return false; }
        this.clearPreviewedThumbs();
        var elems = ud.findElementsBySelector(this.getGalleryElement(), '#gall' + id);
        if (elems.length === 1){
            var elem = elems[0],
                par = ud.findParent(elem);
            while (uv.isHTMLElement(par)) {
                if (ud.getTagName(par) !== 'li') {
                    par = ud.findParent(par);
                } else {
                    break;
                }
            }
            if (uv.isHTMLElement(par)) {
                ud.addClass(par, 'previewed');
                return true; }
            (new udb.IMDebugger()).pass('WPGallery.previewedThumb cannot find <li> parent');
        }
        //may need better error-handling here rather than report;
        (new udb.IMDebugger()).pass('WPGallery.previewedThumb cannot find supplied id');
        return false; };

    adr.WPGallery.prototype.hasPreview = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var p = ud.findElementsBySelector(this.getGalleryElement(), this.previewName),
            count = 0;
        for (var i=0, imax=p.length; i<imax; i+=1) {
            if (p[i] && uv.isHTMLElement(p[i])) {
                count += 1; }}
        return (count > 0) ? true : false; };

    adr.WPGallery.prototype.previewImage = function(e){
        this.clearPreviewedThumbs();
        this.hidePreview();
        //setAndShow;
    };

    adr.WPGallery.prototype.prepare = function(s){
        s = (s !== undefined) ? s : 'all';
        switch (s) {
            case 'navigation':
            case 'inner':
                this.preparePreviewLinks();
                this.prepareNavigationLinks();
                this.prepareThumbLinks();
                return true;
            case 'preview':
                this.preparePreviewLinks();
                return true;
            case 'thumbs':
                this.prepareThumbLinks();
                return true;
            case 'all':
                this.prepareNavigationLinks();
                this.prepareThumbLinks();
                this.preparePreviewLinks();
                return true;
        }
        return false; };

    adr.WPGallery.prototype.prepareNavigationLinks = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var els = ud.findElementsBySelector(this.getGalleryElement(), 'nav a');
        for (var i=0, imax = els.length; i<imax; i+=1) {
            var el = els[i];
            if (!uv.isInArray(this.links.nav, el)) {
                this.prepareNavigationLink(el); }}
        return true; };
    adr.WPGallery.prototype.prepareThumbLinks = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var els = ud.findElementsBySelector(this.getGalleryElement(), '.thumbs li a');
        for (var i=0, imax=els.length; i<imax; i+=1) {
            var el = els[i];
            if (!uv.isInArray(this.links.thumbs, el)) {
                this.prepareThumbLink(el); }}
        return true; };
    adr.WPGallery.prototype.preparePreviewLinks = function(){
        //not written yet;
        return true;
    };

    adr.WPGallery.prototype.sanitizeRequestType = function(r){
        var uv = __imns('util.validation');
        r = (r === undefined) ? 'gallery' : r;
        r = (!uv.isString(r)) ? undefined : r;
        switch (r) {
            case 'gallery':
            case 'navigation':
            case 'preview':
            case 'thumbs':
                return r; }
        return 'gallery'; };

    adr.WPGallery.prototype.produceAjaxLink = function(orgHref, requestType){
        var uc = __imns('util.classes');

        requestType = this.sanitizeRequestType(requestType);
        var nh = new uc.PathInfo(this.ajaxLink),
            oh = new uc.PathInfo(orgHref);
        nh.addGetVars(oh.getVarsList);
        nh.addGetVar({
            name: 'action',
            value: 'wpgalleryajax'}, false);
        nh.addGetVar({
            name: 'ajax',
            value: 'true' }, false);
        nh.addGetVar({
            name: 'gd',
            value: this.getGalleryDefinition() }, false);
        nh.addGetVar({
            name: 'gallreq',
            value: requestType }, false);
        return nh.url; };

    adr.WPGallery.prototype.request = function(evt, requestType){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var elem = (uv.isHTMLElement(evt)) ? evt : ut.findEventElement(evt),
            sHref = ud.getAttribute(elem, 'href');
        if (requestType === 'preview' && !this.hasPreview()) {
            var pi = new uc.PathInfo(sHref),
                id = pi.findGetVar('preview').value;
            if (id !== undefined) { 
                this.showPreview(id); }
            ut.preventEvent(evt);
            return false;
        } else {
            if (elem !== null) {
                var requestUrl = this.produceAjaxLink(sHref, requestType);
                this.ajax.connect(requestUrl, 'get', '', this.produceAjaxFunction(this, this.assignAjax(requestType, sHref)));
                ut.preventEvent(evt);
                return false; }}
        return true; };

    /**
     * @method receipt
     * @param response {Object} XHTTP response object
     * @param requestType {String}
     * @returns {Boolean} success or failure
     * @dependencies - returnXMLFromString
     * @todo thumbs adding for carousel, at the moment page only
     **/
    adr.WPGallery.prototype.receipt = function(response, receiptTicket){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var responseElems = ud.returnXMLFromString(response.responseText),
            firstChild = ('firstChild' in responseElems) ? responseElems.firstChild : responseElems,
            existingElems = [],
            requestType = receiptTicket.requestType,
            focusElem = null, 
            success = false,
            i = 0, imax;
        switch (requestType) {
            case 'preview':
                if (ud.hasClass(firstChild, 'preview')) {
                    existingElems = ud.findElementsBySelector(this.getGalleryElement(), '.preview');
                    for (i=0, imax=existingElems.length; i<imax; i+=1) {
                        ud.replaceElementWith(existingElems[i], firstChild);
                        success = true; }}
                break;
            case 'thumbs':
                /* falls through */
            case 'thumbsprior':
                /* falls through */
            case 'thumbsnext':
                if (ud.hasClass(firstChild, 'thumbs')) {
                    if (requestType === 'thumbsprior') {
                        //add previous;
                        success = true;
                    } else {
                        //add at the end;
                        success = true;
                    }
                    this.prepare('thumbs');
                }
                break;
            case 'inner':
                /* falls through */
            case 'navigation':
                if (ud.hasClass(firstChild, 'inner')) {
                    existingElems = ud.findElementsBySelector(this.getGalleryElement(), '.inner');
                    for (i=0, imax=existingElems.length; i<imax; i+=1) {
                        var n = ud.replaceElementWith(existingElems[i], firstChild);
                        success = true; }
                    this.prepare('inner');
                    focusElem = ud.findElementsBySelector(this.getGalleryElement(), '.inner')[0];
                }
                break;
            case 'gallery':
                /* falls through */
            default:
                if (ud.getAttribute(firstChild, 'id') === this.galleryName) {
                    var currentGallery = this.getGalleryElement();
                    ud.replaceElementWith(currentGallery, firstChild);
                    success = true; 
                    this.prepare('all');
                    focusElem = this.getGalleryElement();
                }
                break;
        }
        if (success) {
            if (focusElem !== null && uv.isHTMLElement(focusElem) && 'focus' in focusElem) {
                focusElem.focus(); 
                if ('scrollIntoView' in focusElem) {
                    focusElem.scrollIntoView();
                }
            }
            return success;
        } else {
            if (receiptTicket.url !== undefined) {
                window.location(receiptTicket.url);
            }
        }
    };
    /**
     * @method produceAjaxFunction
     * @returns anonymous function {Function}
     * @param obj {Object} self reference to instance of WPGallery
     * @param id {Number} id for removal, validity and callback checks
     * @description used to create an anonymous function 
     **/
    adr.WPGallery.prototype.produceAjaxFunction = function(obj, id){
        var fun = function(r){
            var a = obj.removeAjax(id);
            if (a !== false && a.valid){
                obj.receipt(r, a); }};
        return fun; };
    /**
     * @method removeAjax
     * @param id {Number} id for removal
     * @returns {Object|Boolean (False)} ajaxreceipt object, anonymous, should probably be class based
     * @description removes ajaxreceipt object from the waiting list, and is then used if valid to fire receipt (essentially for queuing purposes)
     **/
    adr.WPGallery.prototype.removeAjax = function(id){
        for (var i=0; i<this.ajaxreceipts.length; i+=1) {
            var a = this.ajaxreceipts[i];
            if (a.id === id) {
                this.ajaxreceipts.splice(i,1);
                return a; }}
        return false; };
    /**
     * @method affectedByAjax
     * @param requestType {String}
     * @return {Array} containing strings of affected requestTypes
     **/
    adr.WPGallery.prototype.affectedByAjax = function(requestType){
        switch (requestType) {
            case 'all':
                return ['navigation', 'preview', 'thumbs', 'inner', 'all'];
            case 'navigation':
                return ['navigation', 'thumbs', 'all'];
            case 'inner':
                return ['navigation', 'inner', 'thumbs', 'all'];
            case 'thumbs':
                return ['thumbs', 'all'];
            case 'preview':
                return ['preview', 'all'];
        }
    };
    /**
     * @method assignAjax
     * @param requestType {String}
     * @returns {id (Number int)}
     * @description kills validity on same requestType of all other ajaxreceipts
     **/
    adr.WPGallery.prototype.assignAjax = function(requestType, fallbackHref){
        var uv = __imns('util.validation');
        var id = (this.ajaxid += 1),
            affectedArr = this.affectedByAjax(requestType);
        for (var i=0, imax = this.ajaxreceipts.length; i<imax; i+=1) {
            var a = this.ajaxreceipts[i];
            if (uv.isInArray(a.requestType, affectedArr)) {
                a.valid = false; }}
        this.ajaxreceipts.push({
            id: id,
            url: fallbackHref,
            requestType: requestType,
            valid: true });
        return id;
    };
    /**
     * @method prepareNavigationLink
     * @param el {HTMLAnchorElement}
     * @returns {Boolean}
     * @description sets onClick on link and adds it to links.navigation prepared so doesn’t add multiple
     * @todo Could use HTMLAnchorElement check to confirm is what it should be
     **/
    adr.WPGallery.prototype.prepareNavigationLink = function(el){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        if (el && uv.isHTMLElement(el) && !uv.isInArray(el, this.links.navigation)) {
            var c = this;
            ut.fetter(el, 'click', ['gallerynav', function(evt){ return c.request(evt, 'navigation'); }], true);
            this.links.navigation.push(el);
            return true; }
        return false; };
    /**
     * @method prepareThumbLink
     * @param el {HTMLAnchorElement}
     * @returns {Boolean}
     * @description sets onClick on link and adds it to links.thumbs prepared so doesn’t add multiple
     * @todo Could use HTMLAnchorElement check to confirm is what it should be
     **/
    adr.WPGallery.prototype.prepareThumbLink = function(el){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        if (el && uv.isHTMLElement(el) && !uv.isInArray(el, this.links.thumbs)) {
            var c = this;
            ut.fetter(el, 'click', ['gallerypreview', function(evt){ return c.request(el, 'preview'); }], true);
            this.links.thumbs.push(el);
            return true; }
        return false; };
    adr.prepareWPGalleries();
}
