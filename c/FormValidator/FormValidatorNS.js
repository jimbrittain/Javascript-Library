"use strict";
/* global window, IMDebugger, $, __imns, Arguments, HTMLFormElement, console, setInterval, clearInterval */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('FormValidator' in adr)){
    adr.FormValidator = function(){
        var uc = __imns('util.classes');
        if(uc.FormValidator.prototype.singleton !== undefined){
            return uc.FormValidator.prototype.singleton; }
        uc.FormValidator.prototype.singleton = this;
        this.defaults = true;
        this.forms = [];
        this.customs = []; };
     /**
       @module FormValidator
       @method FormValidator.registerForm
       @param form {HTMLFormElement}
       @return {Boolean}
       @description - registers form, creates uc.FormValidatorForm (adds fettering to elements), adds to uc.FormValidator.forms
     **/
     adr.FormValidator.prototype.registerForm = function(form){
         var uv = __imns('util.validation'),
             ud = __imns('util.dom');
         var f = this.findForm(form);
         if(f === null){
             if(uv.isHTMLElement(form)){
                 if(('HTMLFormElement' in window && form instanceof HTMLFormElement) || (ud.getTagName(form) === 'form')){
                    f = new (__imns('util.classes')).FormValidatorForm(form);
                    //this.forms.push(f);
                    return true; }}}
         return false; };
     /**
       @module FormValidator
       @method FormValidator.findForm
       @param form {HTMLFormElement}
       @return {null|util.tools.FormValidatorForm}
       @description - searches registered forms
     **/
     adr.FormValidator.prototype.findForm = function(form){
         var f = null;
         for(var i=0, imax=this.forms.length; i<imax; i+=1){
             if(form === this.forms[i].form){
                 f = this.forms[i];
                 break; }}
         return f; };
     /**
       @module FormValidator
       @method FormValidator.addWhenValid
       @param form {HTMLFormElement}
       @param is {Function}
       @param not {Function}
       @alternative @param {Object} including 'form', and 'is' and/or 'not' properties
       @description - adds the functions for when it has been found as being valid or not
       @requires util.validation.isHTMLElement
     **/
     adr.FormValidator.prototype.addWhenValid = function(form, is, not){
         var uv = __imns('util.validation');
         if(!uv.isHTMLElement(form) && typeof form === 'object'){
             not = ('not' in form) ? form.not : not;
             is = ('is' in form) ? form.is : is;
             form = ('form' in form) ? form.form : form; }
         if(this.findForm(form) === null){ this.registerForm(form); }
         var f = this.findForm(form);
         if(f !== null){
             if(is !== undefined){ f.setIs(is); }
             if(not !== undefined){ f.setNot(not); }
             return true; }
         return false; };
     /**
       @module FormValidator
       @method FormValidator.addCustomValidation
       @param obj {Object}
       @return {Boolean}
       @description - create custom validation for control or for form. Object
            should be either util.classes.FormValidatorCustom or
            {
                'handle' : String - name, used for identification and alert activation
                'elements' : HTMLElement, Selector String, Id String or [] thereof
                'func' : Function
            }
     **/
     adr.FormValidator.prototype.addCustomValidation = function(obj){
         var uc = __imns('util.classes');
         if(obj instanceof uc.FormValidatorCustom){
             if(obj.isValid()){
                 this.customs.push(obj);
                 return true; }
         } else {
             var o = uc.FormValidatorCustom(obj);
             if(o.isValid()){ 
                 this.customs.push(o); 
                 return true; }}
         return false; };
     /**
       @module FormValidator
       @class FormValidator
       @method FormValidator.determineForm
       @param form {String|HTMLElement}
       @return {Array} of HTMLFormElements
       @description - may be multiple forms if selector string
      **/
     adr.FormValidator.prototype.determineForm = function(form){
         var uv = __imns('util.validation'),
             ud = __imns('util.dom'),
             ut = __imns('util.tools');
         var arr = [];
         var rarr = [];
         if(typeof form === 'string'){
             var elems = ud.findElementsBySelector(form);
             if(elems.length === 0){
                 elems = ud.findElementById(form); 
                 if(elems !== undefined && uv.isHTMLElement(elems)){ arr.push(elems); }
             } else { arr = elems; }
         } else if(form !== undefined && uv.isHTMLElement(form)){ arr.push(form); }
         if(arr.length > 0){
             for(var i=0, imax = arr.length; i<imax; i+=1){
                 var fo = ud.findForm(arr[i]);
                 if(uv.isHTMLElement(fo)){ rarr.push(fo); }}
             rarr = ut.arrayUnique(rarr); }
         return rarr; };
     adr.FormValidator.prototype.validate = function(form){
         var uv = __imns('util.validation'),
             ud = __imns('util.dom');
         var arr = this.determineForm(form), b = false, okay = true;
         if(arr.length > 0){
             for(var i=0, imax=arr.length; i<imax; i+=1){
                 b = this.validateFormElement(arr[i]);
                 if(!b){ okay = false; }}}
         return okay; };
    adr.FormValidator.prototype.validateControl = function(elem){
        var formElem = this.determineForm(elem)[0],
            form = this.findForm(formElem);
        if(form.checkAll()){
            return this.validate(formElem);
        } else { 
            return this.validateFormControl(elem); 
        }};
    adr.FormValidator.prototype.validateFormElement = function(e){
        var ud = __imns('util.dom');
        var controls = ud.findFormControls(e), r = true, okay = true, i, imax;
        for(i=0, imax=controls.length; i<imax; i+=1){
            r = this.validateFormControl(controls[i]);
            if(!r){ okay = false; }}
        if(this.hasCustomValidation(e)){
            var customs = this.getControlCustomHandles(e);
            for(i=0, imax=customs.length; i<imax; i+=1){
                var result = this.runControlCustomValidation(e, this.customs[i].handle);
                okay = (!result) ? false : okay; }}
        var f = this.findForm(e);
        if(f !== null){
            if(okay){ 
                f.is(); 
            } else { 
                f.not(); }}
        return okay; };
    /**
      @module FormValidator
      @class FormValidator
      @method FormValidator.defaultValidationControl
      @param elem {HTMLElement} - currently only uses HTMLInputElements
      @return {Boolean}
      @description - if type covered, uses default validations and returns, else returns true (essentially skipping)
     **/
    adr.FormValidator.prototype.defaultValidationControl = function(elem){
        if(this.defaults){
            var ud = __imns('util.dom'),
                uv = __imns('util.validation');
            if(uv.isHTMLElement(elem)){
                var result = true, tag = ud.getTagName(elem);
                if(tag === 'input'){
                    var tagType = ud.getAttribute(elem, 'type');
                    tagType = (typeof tagType === 'string') ? tagType.toLowerCase() : tagType;
                    switch (tagType){
                        case 'email':
                            return uv.isEmailAddress(elem.value);
                        case 'url':
                            return uv.isUrl(elem.value);
                        case 'number':
                            return uv.isNumber(elem.value);
                        case 'tel':
                            return uv.isTelephoneNumber(elem.value); }}}}
        return true; };
    adr.FormValidator.prototype.skipFormControl = function(elem){
        var ud = __imns('util.dom');
        var tn = ud.getTagName(elem);
        if(tn === 'input'){
            switch (elem.type){
                case 'hidden':
                case 'submit':
                case 'button':
                case 'reset':
                    return true; }}
         if(tn === 'optgroup' || tn === 'progress' || tn === 'button'){ return true; }
         return false; };
    /**
      @module FormValidator
      @class FormValidator
      @method FormValidator.validateFormControl
      @param elem {HTMLElement}
      @return {Boolean} true if good, false otherwise;
      @description - checks against pattern (if available as fallback check), default methods and custom
      @requires util.dom.getAttribute
     **/
    adr.FormValidator.prototype.validateFormControl = function(elem){
        var ud = __imns('util.dom');
        var result, rr = true;
        if(this.skipFormControl(elem)){ return true; }
        if(ud.hasAttribute(elem, 'pattern')){
            var patt = ud.getAttribute(elem, 'pattern');
            if(typeof patt === 'string' && patt.length > 0 && patt !== 'null'){
                var reg = new RegExp(patt); //check this, syntax may be different;
                result = reg.test(elem.value);
                rr = (!result) ? false : rr;
                this.alert(elem, '--pattern', result); }} //may be fucked up by trying to get attr[value] !elem.value 
        if(this.defaults){ 
            result = this.defaultValidationControl(elem);
            rr = (!result) ? false : rr;
            this.alert(elem, '--default', result); }
        if(this.hasCustomValidation(elem)){
            var customs = this.getControlCustomHandles(elem);
            for(var i=0, imax=customs.length; i<imax; i+=1){
                result = this.runControlCustomValidation(elem, this.customs[i].handle);
                rr = (!result) ? false : rr;
                this.alert(elem, this.customs[i].handle, result); }}
         return rr; };
    adr.FormValidator.prototype.findCustomValidations = function(elem){
        var arr = [];
        for(var i=0, imax=this.customs; i<imax; i+=1){
            if(this.customs[i].influences(elem)){
                arr.push(this.customs[i]); }}
        return arr; };
    adr.FormValidator.prototype.hasCustomValidation = function(elem){
        var a = this.findCustomValidations(elem);
        return (a.length > 0) ? true : false; };
    adr.FormValidator.prototype.getCustomHandles = function(elem){
        var arr = [],
            customs = this.findCustomValidations(elem);
        for(var i=0, imax = customs.length; i<imax; i+=1){ arr.push(customs[i].handle); }
        return arr; };
    adr.FormValidator.prototype.alert = function(elem, handle, result){
        if(result){
            this.alertHide(elem, handle);
        } else { this.alertDisplay(elem, handle); }};

    adr.FormValidator.prototype.alertDisplay = function(elem, handle){
        var ud = __imns('util.dom');
        var alerts  = this.findAlertForControl(elem, handle);
        for(var i=0, imax=alerts.length; i<imax; i+=1){
            var alertElem = alerts[i].element;
            ud.setAttribute(alertElem, 'aria-hidden', 'false');
            ud.addClass(alertElem, 'on'); }};
    /**
      @module FormValidator
      @method FormValidator.alertHide
      @param elem {HTMLElement} - form control element, e.g. button, input, textarea etc;
      @return {Boolean} true;
      @description - uses control element, finds the relevant alert, aria-hidden = true, removes on class from alert;
    **/
    adr.FormValidator.prototype.alertHide = function(elem, handle){
        var ud = __imns('util.dom');
        var alerts = this.findAlertForControl(elem, handle);
        for(var i=0, imax=alerts.length; i<imax; i+=1){
            var alertElem = alerts[i].element;
            ud.setAttribute(alertElem, 'aria-hidden', 'true');
            ud.removeClass(alertElem, 'on'); 
            return true; }};

    /**
      @module FormValidator
      @class FormValidator
      @method FormValidator.findAlertForControl
      @param controlElem {HTMLElement} - input, textarea, button
      @param handle {String}
      @return {Array} of FormValidatorAlert objects
    **/
    adr.FormValidator.prototype.findAlertForControl = function(controlElem, handle){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes');
        var controlId = ud.getAttribute(controlElem, 'id'),
            form = ud.findForm(controlElem),
            attrString = ('.alert[aria-owns=' + controlId + ']'), 
            elems = (form !== null) ? ud.findElementsBySelector(form, attrString) : ud.findElementsBySelector(attrString),
            alerts = [],
            i, imax;
        if(elems.length < 1){
            var arr = ud.findElementsByClass('alert');
            for(i=0, imax=arr.length; i<imax; i+=1){
                if(ud.hasAttribute(arr[i], 'aria-owns') && ud.getAttribute(arr[i], 'aria-owns') === controlId){
                    elems.push(arr[i]); }}}
        for(i=0, imax=elems.length; i<imax; i+=1){
            alerts.push(new uc.FormValidatorAlert(elems[i])); }
        if(handle !== undefined){
            for(i=0, imax=alerts.length; i<imax; i+=1){
                if(handle === alerts[i].handle){
                    return [alerts[i]]; } }
            return [];
         } else { return alerts; }};

    /**
      @module FormValidator
      @class FormValidatorForm
      @constructor
      @param elem {HTMLFormElement}
     **/
    adr.FormValidatorForm = function(elem){
        var uc = __imns('util.classes');
        this.form = null;
        this._is = null;
        this._not = null;
        this._check = [];
        this.master = new uc.FormValidator();
        if(elem !== undefined){ this.init(elem); }};
    /**
      @module FormValidator
      @class FormValidatorForm
      @method FormValidatorForm.init
      @param e {HTMLFormElement}
      @requires util.validation.isFormElement, util.dom.findFormControls, util.tools.fetter
      @description - assigns e to form property, adds submit function, adds change functions to controls
     **/
    adr.FormValidatorForm.prototype.init = function(e){ 
        var ut = __imns('util.tools'),
            ud = __imns('util.dom');
        this.form = ((__imns('util.validation')).isFormElement(e)) ? e : null; 
        if(this.form !== null){
            this.master.forms.push(this);
            var c = this;
            ut.fetter(this.form, 'submit', [this.form, 
                function(e){
                    return (new (__imns('util.classes')).FormValidator()).validate(ut.findEventElement(e));
                }], true);
            var arr = ud.findFormControls(this.form), d = null, i, imax;
            for(i=0, imax=arr.length; i<imax; i+=1){
                this.addControlChangeFunction(arr[i]); 
                this.addControlFocusFunction(arr[i]);
                this.addControlUnfocusFunction(arr[i]);
            }
            for(i=0, imax=arr.length; i<imax; i+=1){
                var elem = arr[i];
                var should = (ud.hasAttribute(elem,'type') && ud.getAttribute(elem,'type') === 'hidden') ? false : true;
                if(should && ud.hasAttribute(elem,'required') && !(ud.getAttribute(elem,'required') === null || ud.getAttribute(elem,'required') === false)){ 
                    this._check.push(elem); }}
        }};
    adr.FormValidatorForm.prototype.addControlFocusFunction = function(elem){
        var c = this;
        (__imns('util.tools')).fetter(elem, 'focus', [elem, function(e){
            c.clearRepeatedCheck();
            var on = __imns('util.tools').findEventElement(e);
            c.repeatedElement = on;
            c.repeated = setInterval(function(){ c.controlRepeatedCheck(on); }, 800);
        }], true);
    };
    adr.FormValidatorForm.prototype.clearRepeatedCheck = function(onElement){
        var should = (this.repeated !== null) ? true : false;
        should = (onElement !== undefined && onElement !== this.repeatedElement) ? false : should;
        if(should){
            clearInterval(this.repeated);
            this.repeated = null; }};
    adr.FormValidatorForm.prototype.controlRepeatedCheck = function(elem){
        this.removeCheck(elem);
        return (new (__imns('util.classes')).FormValidator()).validateControl(elem); };
    adr.FormValidatorForm.prototype.addControlUnfocusFunction = function(elem){
        var c = this;
        (__imns('util.tools')).fetter(elem, 'focusout', [elem, function(e){
            var on = __imns('util.tools').findEventElement(e);
            c.clearRepeatedCheck(on);
        }], true); };
    adr.FormValidatorForm.prototype.addControlChangeFunction = function(elem){
        var c = this;
        (__imns('util.tools')).fetter(elem, 'change', [elem, function(e){ 
            var on = __imns('util.tools').findEventElement(e);
            c.removeCheck(on);
            return (new (__imns('util.classes')).FormValidator()).validateControl(on); 
        }], true); };
    adr.FormValidatorForm.prototype.removeCheck = function(elem){
        for(var i=0, imax=this._check.length; i<imax; i+=1){
            if(elem === this._check[i]){
                this._check.splice(i,1);
                i -= 1; }}};
    adr.FormValidatorForm.prototype.checkAll = function(){ 
        return (this._check.length === 0); };
    /**
      @module FormValidator
      @class FormValidatorForm
      @method FormValidatorForm.is
      @description - used to fire when IS Valid function
     **/
    adr.FormValidatorForm.prototype.is = function(){
        if(this._is !== null && typeof this._is === 'function'){ this._is(); }
        return true; };
    /**
      @module FormValidator
      @class FormValidatorForm
      @method FormValidatorForm.not
      @description - used to fire when NOT Valid function
     **/
    adr.FormValidatorForm.prototype.not = function(){
        if(this._not !== null && typeof this._not === 'function'){ this._not(); }
        return true; };
    /**
      @module FormValidator
      @class FormValidatorForm
      @method FormValidatorForm.setIs
      @param fun {Function}
      @return {Boolean} success
      @description - attempts to assign function to FormValidatorForm.is
     **/
    adr.FormValidatorForm.prototype.setIs = function(fun){
        this._is = (fun !== undefined && typeof fun === 'function') ? fun : this._is;
        return (this._is === fun); };
    /**
      @module FormValidator
      @class FormValidatorForm
      @method FormValidatorForm.setNot
      @param fun {Function}
      @return {Boolean} success
      @description - attempts to assign function to FormValidatorForm.not
     **/
    adr.FormValidatorForm.prototype.setNot = function(fun){
        this._not = (fun !== undefined && typeof fun === 'function') ? fun : this._not;
        return (this._not === fun); };

    adr.FormValidatorCustom = function(o){
        this.handle = null;
        this.func = null;
        this.elements = []; 
        this.init(o); };
    adr.FormValidatorCustom.prototype.isValid = function(){ return (this.handle !== null && this.func !== null && this.elements.length > 0); };
    adr.FormValidatorCustom.prototype.influences = function(elem){
        for(var i=0, imax=this.elements.length; i<imax; i+=1){
            if(this.elements[i] === elem){ return true; }}
        return false; };
    adr.FormValidatorCustom.prototype.init = function(o){
        if(o.handle !== null){ this.setHandle(o.handle); }
        if(o.func !== null){ this.setFunction(o.func); }
        if(o.elements !== null){ this.setElements(o.elements); }};
    adr.FormValidatorCustom.prototype.run = function(){
        var result = true;
        if(this.func !== null && typeof this.func === 'function'){ result = this.func(); }
        return (result !== undefined && !result) ? false : true; };
    adr.FormValidatorCustom.prototype.setHandle = function(str){
        var result = true;
        this.handle = (typeof str === 'string') ? str : this.handle;
        return (this.handle === str); };
    adr.FormValidatorCustom.prototype.setFunction = function(fun){
        var result = true;
        this.func = (typeof fun === 'function') ? fun : this.func;
        return (this.func === fun); };
    adr.FormValidatorCustom.prototype.setElements = function(e){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var arr = [], i, imax;
        if(uv.isArray(e)){
            arr = e;
        } else if(Arguments && Arguments.length > 0){
            for(i=0, imax=Arguments.length; i<imax; i+=1){ arr.push(Arguments[i]); }}
        for(i=0, imax=arr.length; i<imax; i+=1){
            if(uv.isHTMLElement(arr[i])){
                this.elements.push(arr[i]);
            } else if(typeof arr[i] === 'string'){
                var el = ud.findElementsBySelector(arr[i]);
                if(el.length === 0){
                    el = ud.findElementsById(arr[i]);
                    el = (uv.isHTMLElement(el)) ? [el] : []; }
                this.elements = this.elements.concat(el); }}
        return (this.elements > 0) ? true : false; };

    adr.FormValidatorAlert = function(elem){
        this.element = null;
        this.handle = null; 
        this.ownsId = null;
        this.init(elem); };
    adr.FormValidatorAlert.prototype.init = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            this.element = elem;
            this.ownsId = ud.getAttribute(elem, 'aria-owns');
            var elemId = ud.getAttribute(elem, 'id');
            if(this.ownsId !== '' && elemId.indexOf(this.ownsId) !== false){
                this.handle = elemId.substring(this.ownsId.length);
            } else { this.handle = elemId; }}};
    (__imns('util.tools')).addFormValidation = function(elem){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation');
        if(uv.isFormElement(elem)){
            var found = (new uc.FormValidator()).findForm(elem);
            if(found === null){
                var t = new uc.FormValidatorForm(elem);
                return t; 
            } else { return found; }}
        return false; };
}
