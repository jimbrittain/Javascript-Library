"use strict";
/* global console, window, document, clearInterval, setInterval, __imns */
/* isHTMLElement, console, HTMLClass, DragObject, findElementStyle, BoundaryCoordinates, measure, fetter, window, MouseRecorderInstance, MouseRecorder, document, setInterval, unfetter, clearInterval, SupportedCSSProperty, Coordinates, DragMaster, DragGlobal */
/*jshint -W069 */

var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('DragGlobal' in adr)){


    adr.DragGlobal = function(){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        if(cc.DragGlobal.prototype.singleton !== undefined){ return cc.DragGlobal.prototype.singleton; }
        cc.DragGlobal.prototype.singleton = this;
        this.masters = [];
        this.mri = new uc.MouseRecorderInstance({
            'name' : 'DragMaster', 
            'element' : document, 
            'type' : 'both' });
        this.mouserecorder = new uc.MouseRecorder();
        this.mouserecorder.setRecord(this.mri);
        this.mouserecorder.alwaysRecord(); };

    adr.DragGlobal.prototype.add = function(dm){
        var cc = __imns('component.classes');
        if(dm instanceof cc.DragMaster){
            var found = false;
            for(var i=0,imax=this.masters.length; i<imax; i+=1){
                if(dm === this.masters[i]){ found = true; }}
            if(!found){ 
                this.masters.push(dm);
                return true; }}
        return false; };

    adr.DragGlobal.prototype.findDragMasterFromElement = function(elem){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var hold = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            for(var i=0, imax=this.masters.length; i<imax; i+=1){
                for(var j=(this.masters[i].draggableObjects.length - 1); j>-1; j-=1){
                    var on_selection = this.masters[i].draggableObjects[j];
                    if(on_selection.controllerElement === elem || on_selection.dragElement === elem){
                        hold = this.masters[i];
                        break; }}}}
        return (hold !== -1 && hold instanceof cc.DragMaster) ? hold : null; };
    adr.DragGlobal.prototype.findDragObjectFromElement = function(elem){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        var hold = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            for(var i=0, imax = this.masters.length; i<imax; i+=1){
                for(var j=(this.masters[i].draggableObjects.length - 1); j>-1; j-=1){
                    var on_selection = this.masters[i].draggableObjects[j];
                    if(on_selection.controllerElement === elem || on_selection.dragElement === elem){
                        hold = on_selection;
                        break; }}}}
        return (hold !== -1 && hold instanceof cc.DragObject) ? hold : null; };

    adr.DragGlobal.prototype.disableSelection = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.fetter(document, 'dragstart', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.fetter(document, 'selectstart', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.fetter(document, 'select', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.fetter(document, 'draggesture', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.fetter(document, 'drag', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.fetter(document, 'dragdrop', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true); };
    adr.DragGlobal.prototype.enableSelection = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.unfetter(document, 'dragstart', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.unfetter(document, 'selectstart', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.unfetter(document, 'select', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.unfetter(document, 'draggesture', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.unfetter(document, 'drag', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true);
        ut.unfetter(document, 'dragdrop', [c, function(e){ (new cc.DragGlobal()).disableCover(e); return false; }], true); };
    adr.DragGlobal.prototype.disableCover = function(e){
        if(!e){ e = window.event; }
        if('stopPropagation' in e){ e.stopPropagation(); }
        if('preventDefault' in e){ e.preventDefault(); }
        if('cancelBubble' in e){ e.cancelBubble = true; }
        if('focus' in document.body){ document.body.focus(); }
        if('select' in document.body){ document.body.select(); }
        if('selection' in document){ document.selection.clear(); }
        e = undefined;
        return false; };
    adr.DragGlobal.prototype.clearStopControls = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.unfetter(document, 'mouseup', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true);
        ut.unfetter(document, 'touchcancel', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true);
        ut.unfetter(document, 'touchend', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true); };
    adr.DragGlobal.prototype.initStopControls = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this;
        ut.fetter(document, 'mouseup', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true);
        ut.fetter(document, 'touchcancel', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true);
        ut.fetter(document, 'touchend', [c, function(e){ (new cc.DragGlobal()).allStop(e); }], true); };

    adr.DragGlobal.prototype.allStop = function(){
        for(var i=0, imax=this.masters.length; i<imax; i+=1){
            this.masters[i].stopDrag(); }
        this.clearStopControls(); };

    adr.DragMaster = function(ctrlElement){
        var cc = __imns('component.classes');
        if(cc.DragMaster.prototype.id === undefined){ cc.DragMaster.prototype.id = 0; }
        cc.DragMaster.prototype.id += 1;
        this.global = new cc.DragGlobal();
        this.global.add(this);
        this.id = cc.DragMaster.prototype.id;

        this.enabled = true;
        this.initialised = false;
        this.inertiaRate = 0.7;
        this.weight = 0.1;
        this.bounce = 0.7;
        this.codeInt = null;

        this.position = 'relative';
        this._functional = null;
        this.draggableObjects = [];
        this._constrain = {
            'x' : false, 
            'y' : false };

        this._finishFunction = null;
        this._startFunction = null;
        this._bounceFunction = null;

        this.dragObject = null;
        this.controlElement = null; 
        this.construct(ctrlElement); };

    adr.DragMaster.prototype.setPosition = function(str){
        str = (typeof str === 'string') ? str.toLowerCase() : '';
        this.position = (str === 'absolute') ? 'absolute' : 'relative';
        return (str === this.position); };

    adr.DragMaster.prototype.addFinishFunction = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._finishFunction = f;
            return true;
        } else { this._finishFunction = null; return false; }};
    adr.DragMaster.prototype.addStartFunction = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._startFunction = f;
            return true;
        } else { this._startFunction = null; return false; }};
    adr.DragMaster.prototype.addBounceFunction = function(f){
        if(f !== undefined && typeof f === 'function'){
            this._bounceFunction = f;
            return true;
        } else { this._bounceFunction = null; return false; }};
    adr.DragMaster.prototype.startFunction = function(){
        if(this._startFunction !== null && this._startFunction !== undefined && typeof this._startFunction === 'function'){
            return this._startFunction(this);
        } else { return true; }};
    adr.DragMaster.prototype.finishFunction = function(){
        if(this._finishFunction !== null && this._finishFunction !== undefined && typeof this._finishFunction === 'function'){
            return this._finishFunction(this);
        } else { return true; }};
    adr.DragMaster.prototype.bounceFunction = function(){
        if(this._bounceFunction !== null && this._bounceFunction !== undefined && typeof this._bounceFunction === 'function'){
            return this._bounceFunction(this);
        } else { return true; }};
    adr.DragMaster.prototype.assignFunctional = function(f){
        if(typeof f === "function"){
            this._functional = f;
            return true;
        } else { return false; }};

    adr.DragMaster.prototype.constrain = function(x,y){
        if(x !== undefined){ this.constrainX(x); }
        if(y !== undefined){ this.constrainY(y); }};
    adr.DragMaster.prototype.constrainX = function(boo){
        if(boo !== undefined && (boo || !boo)){
            this._constrain.x = (boo) ? true: false;
        } else { this._constrain.x = (this._constrain.x) ? false : true; }
        if(this.initialised && this.draggableObjects.length > 0){
            for(var i=0, imax = this.draggableObjects.length; i<imax; i+=1){
                this.draggableObjects[i].constrainX(this._constrain.x); }}};
    adr.DragMaster.prototype.constrainY = function(boo){
        if(boo !== undefined && (boo || !boo)){
            this._constrain.y = (boo) ? true : false;
        } else { this._constrain.y = (this._constrain.y) ? false : true; }
        if(this.initialised && this.draggableObjects.length > 0){
            for(var i=0, imax = this.draggableObjects.length; i<imax; i+=1){
                this.draggableObjects[i].constrainY(this._constrain.y); }}};

    adr.DragMaster.prototype.findObjectIndex = function(obj){
        var cc = __imns('component.classes');
        var n = -1;
        if(obj instanceof cc.DragObject){
            for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
                if(this.draggableObjects[i] === obj){
                    n = i;
                    break; }}}
        return n; };
    adr.DragMaster.prototype.findIndex = function(obj){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        var n = -1;
        if(obj instanceof cc.DragObject){
            n = this.findObjectIndex(obj);
        } else if(uv.isHTMLElement(obj)){
            n = this.findElementIndex(obj);
        } else if(typeof obj === 'number' && n > 0 && n < this.draggableObjects.length){
            n = obj; }
        return n; };
    adr.DragMaster.prototype.findElementIndex = function(elem){
        var uv = __imns('util.validation');
        var n = -1;
        if(elem !== undefined && uv.isHTMLElement(elem)){
            for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
                if(this.draggableObjects[i].dragElement === elem){
                    n = i;
                    break; }}}
        return n; };
    adr.DragMaster.prototype.findObject = function(obj){
        var n = this.findIndex(obj);
        if(n !== -1){
            return this.draggableObjects[n];
        } else { return undefined; }};

    adr.DragMaster.prototype.objectExists = function(obj){ return (this.findIndex(obj) === -1) ? false : true; };
    adr.DragMaster.prototype.elementExists = function(elem){ return (this.findIndex(elem) === -1) ? false : true; };

    adr.DragMaster.prototype.setCodeInterval = function(){
        this.clearCodeInterval();
        var c = this;
        this.codeInt = setInterval(function(){ c.runMoving(); }, 70); };
    adr.DragMaster.prototype.clearCodeInterval = function(){
        if(this.codeInt !== null){
            clearInterval(this.codeInt);
            this.codeInt = null; }};
    adr.DragMaster.prototype.construct = function(ctrlElement){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation');
        this.initialised = false;
        if(ctrlElement instanceof uc.BoundaryCoordinates){
            this.controlElement = ctrlElement;
        } else if(ctrlElement !== undefined && uv.isHTMLElement(ctrlElement)){
            this.controlElement = new uc.BoundaryCoordinates(ctrlElement);
        } else { this.controlElement = new uc.BoundaryCoordinates(); }};
    adr.DragMaster.prototype.isFunctional = function(){
        if(this._functional !== null && typeof this._functional === "function"){
            return this._functional();
        } else { return this.enabled; }};
    adr.DragMaster.prototype.disable = function(){
        if(this.enabled){
            this.enabled = false;
            for(var i=0,imax=this.draggableObjects.length; i<imax; i+=1){ this.draggableObjects[i].dragElement.style.position = ''; }
            if(this.dragObject !== null){ this.stopDrag(); }}};
    adr.DragMaster.prototype.reenable = function(){
        if(!this.enabled){
            this.enabled = true;
            for(var i=0,imax=this.draggableObjects.length; i<imax; i+=1){ this.draggableObjects[i].dragElement.style.position = this.position; }}};
    adr.DragMaster.prototype.add = function(targetElement, controllerElement){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation');
        if(targetElement !== undefined && uv.isHTMLElement(targetElement) && !this.elementExists(targetElement)){
            var tempObject = new cc.DragObject(this);
            tempObject = tempObject.init(targetElement, controllerElement);
            tempObject.constrain(this._constrain.x, this._constrain.y);
            if(tempObject !== undefined && tempObject instanceof cc.DragObject){ 
                if(this.initialised){ tempObject.initRestingControls(); }
                this.draggableObjects.push(tempObject);
                return true; }}
        return false; };
    adr.DragMaster.prototype.remove = function(obj){
        var n = this.findIndex(obj);
        if(n !== -1){
            this.draggableObjects[n].clearControls();
            this.draggableObjects.splice(n, 1); }};
    adr.DragMaster.prototype.destroy = function(){
        if(this.dragObject !== null){ this.stopDrag(); }
        while(this.draggableObjects.length > 0){
            this.remove(this.draggableObjects[0]); }
        this.dragObject = null;
        this.stopDrag(); };
    adr.DragMaster.prototype.defineDragging = function(dragObject){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        this.dragObject = this.draggableObjects[this.findIndex(dragObject.dragElement)];
        (new cc.DragGlobal()).disableSelection(document);
        for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
            if(this.draggableObjects[i] !== this.dragObject){
                this.draggableObjects[i].dragging = false;
                (new uc.HTMLClass()).removeClass(this.draggableObjects[i].dragElement, 'dragging');
            } else {
                this.stackToTop(this.draggableObjects[i]);
                this.draggableObjects[i].dragging = true;
                (new uc.HTMLClass()).addClass(this.draggableObjects[i].dragElement, 'dragging');
                this.draggableObjects[i].initDrag(); }}};
    adr.DragMaster.prototype.runMoving = function(){
        var done = true;
        for(var i = 0, imax = this.draggableObjects.length; i < imax; i += 1){
            if(!this.draggableObjects[i].finished){
                this.draggableObjects[i].run();
                done = false; }}
        if(done){ this.clearCodeInterval(); }
        done = undefined; };
    adr.DragMaster.prototype.finishedMoving = function(){
        var done = true;
        for(var i = 0, imax = this.draggableObjects.length; i < imax; i += 1){
            if(!this.draggableObjects[i].finished){
                done = false;
                break; }}
        return done; };
    adr.DragMaster.prototype.init = function(){
        if(this.enabled && !this.initialised && this.draggableObjects.length > 0){
            this.initialised = true;
            for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
                this.draggableObjects[i].initRestingControls(); }
            return true;
        } else { return false; }};
    adr.DragMaster.prototype.refresh = adr.DragMaster.prototype.init;

    adr.DragMaster.prototype.stackToTop = function(dragObject){
        var n = this.findObjectIndex(dragObject);
        if(n !== -1){
            var tempHold = this.draggableObjects[n];
            this.draggableObjects.splice(n,1);
            this.draggableObjects.push(tempHold);
            this.resolveStacking(); }};
    adr.DragMaster.prototype.resolveStacking = function(){
        var uv = __imns('util.validation');
        for(var i=0; i<this.draggableObjects.length; i += 1){
            if(uv.isHTMLElement(this.draggableObjects[i].dragElement)){
                this.draggableObjects[i].dragElement['style']['zIndex'] = 1000 + i;
            } else { 
                this.remove(this.draggableObjects[i]);
                i -= 1; }}};
    adr.DragMaster.prototype.stopDrag = function(e){
        var uc = __imns('util.classes'),
            cc = __imns('component.classes');
        if(this.dragObject !== null){
            for(var i=0, imax=this.draggableObjects.length; i<imax; i += 1){ 
                this.draggableObjects[i].dragging = false; }
            if((new uc.SupportedCSSProperty('box-shadow')).exists){
                this.dragObject.dragElement['style'][(new uc.SupportedCSSProperty('box-shadow')).cssProperty] = '0 0 0 rgba(0,0,0,0)';
            }
            this.finishFunction();
            this.dragObject.initRestingControls(); 
            (new cc.DragGlobal()).enableSelection();
            (new uc.HTMLClass()).removeClass(this.dragObject.dragElement, 'dragging');
            this.dragObject = null; }};

    adr.DragObject = function(mst){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        if(cc.DragObject.prototype.uid === undefined){ cc.DragObject.prototype.uid = 1; } else { cc.DragObject.prototype.uid += 1; }
        this.uid = cc.DragObject.prototype.uid;
        this.master = null;

        this._constrain = {
            'x' : false, 
            'y' : false };

        this.controllerElement = null;
        this.dragElement = null;

        this.bounce = 0;
        this.inertiaRate = 0;
        this.weight = 1; //this needs to be changed by elementWidth;

        this.lastMouse = new uc.Coordinates(0,0);
        this.start = new uc.Coordinates(0,0);
        this.kill = {'x': false, 'y': false};
        this.inertia = new uc.Coordinates(0,0);

        this.dragging = false;
        this.moved = false;
        this.finished = true; 

        if(mst !== undefined && mst instanceof cc.DragMaster){ 
            this.master = mst;
            this.bounce = this.master.bounce;
            this.inertiaRate = this.master.inertiaRate;
            this.weight = this.master.weight; //this needs to be changed by elementWidth;
        }
    };
    adr.DragObject.prototype.init = function(targetElement){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ud = __imns('util.dom');
        if(targetElement !== undefined && uv.isHTMLElement(targetElement)){
            this.dragElement = targetElement;
            this.controllerElement = (arguments.length > 1 && arguments[1] !== null && uv.isHTMLElement(arguments[1])) ? arguments[1] : targetElement;
            this.start.x = ud.findElementStyle(this.dragElement, 'offsetLeft');
            this.start.y = ud.findElementStyle(this.dragElement, 'offsetTop');
            var positional = new uc.Coordinates('0','0');
            if(this.master.position === 'absolute' && this.dragElement['style']['position'] !== this.master.position){
                if('parentNode' in this.dragElement){
                    positional.x -= Number(ud.findElementStyle(this.dragElement.parentNode, 'offsetLeft'));
                    positional.y -= Number(ud.findElementStyle(this.dragElement.parentNode, 'offsetTop')); }}
            this.dragElement['style']['position'] = this.master.position;
            if(this.dragElement['style']['left'] === ""){ this.dragElement['style']['left'] = (isNaN(positional.x)) ? positional.x : "0px"; }
            if(this.dragElement['style']['top'] === ""){ this.dragElement['style']['top'] = (isNaN(positional.y)) ? positional.y : "0px"; }
            return this;
        } else { return undefined; }};
    adr.DragObject.prototype.beginDrag = function(){
        var uc = __imns('util.classes');
        if(this.master.isFunctional() && this.master.enabled){
            if((new uc.SupportedCSSProperty('box-shadow')).exists){
                if((new uc.SupportedCSSProperty('transition')).exists){
                    this.dragElement['style'][(new uc.SupportedCSSProperty('transition')).cssProperty] = (new uc.SupportedCSSProperty('box-shadow')).cssProperty + ' 400ms'; }
                this.dragElement['style'][(new uc.SupportedCSSProperty('box-shadow')).cssProperty] = '-4px 4px 7px rgba(0,0,0,0.05)'; }
            this.master.defineDragging(this); }};
    adr.DragObject.prototype.initDrag = function(){
        var cc = __imns('component.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom'),
            ut = __imns('util.tools'),
            uc = __imns('util.classes');
        this.moved = false;
        this.finished = false;
        this.lastMouse = new uc.Coordinates((new cc.DragGlobal()).mouserecorder.x, (new cc.DragGlobal()).mouserecorder.y);
        this.start.x = parseFloat(ut.measure(this.dragElement['style']['left'], 'px', this.dragElement)) - ud.findElementStyle(this.dragElement, 'offsetLeft');
        this.start.y = parseFloat(ut.measure(this.dragElement['style']['top'], 'px', this.dragElement)) - ud.findElementStyle(this.dragElement, 'offsetTop');
        this.inertia = new uc.Coordinates(0,0);
        this.initActiveControls();
        this.master.startFunction();
        this.master.setCodeInterval(); };
    adr.DragObject.prototype.calculateInertia = function(change){
        if(isNaN(change)){
            return 0;
        } else {
            var cInt = change * this.inertiaRate;
            return (isNaN(cInt)) ? 0 : cInt; }};
    adr.DragObject.prototype.constrain = function(x,y){
        if(x !== undefined){ this.constrainX(x); }
        if(y !== undefined){ this.constrainY(y); }};
    adr.DragObject.prototype.constrainX = function(boo){
        if(boo !== undefined && (boo || !boo)){
            this._constrain.x = (boo) ? true : false;
        } else {
            this._constrain.x = (this._constrain.x) ? false : true; }
        return this._constrain.x; };
    adr.DragObject.prototype.constrainY = function(boo){
        if(boo !== undefined && (boo || !boo)){
            this._constrain.y = (boo) ? true : false;
        } else {
            this._constrain.y = (this._constrain.y) ? false : true; }
        return this._constrain.y; };
    adr.DragObject.prototype.calculateChange = function(){
        var uc = __imns('util.classes'),
            cc = __imns('component.classes');
        var xChange = 0;
        var yChange = 0;
        var change = new uc.Coordinates(0,0);
        if(this.dragging && this.master.dragObject === this){
            change.x = ((new cc.DragGlobal()).mouserecorder.x - this.lastMouse.x) * this.weight;
            change.y = ((new cc.DragGlobal()).mouserecorder.y - this.lastMouse.y) * this.weight;
            switch(this.kill.x){
                case 'positive':
                    change.x = ((new cc.DragGlobal()).mouserecorder.x > this.lastMouse.x) ? 0 : change.x;
                    break;
                case 'negative':
                    change.x = ((new cc.DragGlobal()).mouserecorder.x < this.lastMouse.x) ? 0 : change.x;
                    break; }
            switch(this.kill.y){
                case 'positive':
                    change.y = ((new cc.DragGlobal()).mouserecorder.y > this.lastMouse.y) ? 0 : change.y;
                    break;
                case 'negative':
                    change.y = ((new cc.DragGlobal()).mouserecorder.y < this.lastMouse.y) ? 0 : change.y;
                    break; }
            this.lastMouse.x = (new cc.DragGlobal()).mouserecorder.x;
            this.lastMouse.y = (new cc.DragGlobal()).mouserecorder.y; }
        change.x += this.inertia.x;
        change.y += this.inertia.y;
        this.inertia.x = this.calculateInertia(change.x);
        this.inertia.y = this.calculateInertia(change.y);
        return change; };
    adr.DragObject.prototype.clearControls = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this, m = this.master;
        (new cc.DragGlobal()).clearStopControls();
        ut.unfetter(this.controllerElement, 'mousedown', [c, function(e){ c.beginDrag(e); }], true);
        ut.unfetter(this.controllerElement, 'touchstart', [c, function(e){ c.beginDrag(e); }], true); };
    adr.DragObject.prototype.initActiveControls = function(){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        var c = this, m = this.master;
        ut.unfetter(this.controllerElement, 'mousedown', [c, function(e){ c.beginDrag(e); }], true);
        ut.unfetter(this.controllerElement, 'touchstart', [c, function(e){ c.beginDrag(e); }], true);
        (new cc.DragGlobal()).initStopControls(); };
    adr.DragObject.prototype.initRestingControls = function(){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        var c = this, m = this.master;
        var f = function(e){ 
            var elem = ('srcElement' in e) ? e.srcElement : (('target' in e) ? e.target : c.controllerElement);
            var on_drag_object = (new cc.DragGlobal()).findDragObjectFromElement(elem);
            c = (on_drag_object !== null && c !== on_drag_object) ? on_drag_object : c;
            c.beginDrag(e); 
            c.uid = Number(c.uid); };
        ut.fetter(this.controllerElement, 'mousedown', [c,f], true);
        ut.fetter(this.controllerElement, 'touchstart', [c,f], true);
        (new cc.DragGlobal()).clearStopControls(); };
    adr.DragObject.prototype.resolveChange = function(d1, d2, b1, b2, change, inertia){
        var _d1 = d1 + change;
        var _d2 = d2 + change;
        var kill = false, valid = false, count = 0, has = false;
        if(_d1 >= b1 && _d2 <= b2){ kill = false; }
        do {
            if(count > 1){ valid = true; } //only gets here if bounced twice; in which case too big; Revert to last pos;
            if(_d1 >= b1 && _d2 <= b2){
                d1 = _d1;
                d2 = _d2;
                valid = true;
            } else {
                has = true;
                var diff = 0;
                var diff_ab = 0;
                if(b1 > _d1){
                    diff = _d1 - b1;
                    if(inertia < 0){ inertia *= -1; }
                    kill = 'negative';
                } else {
                    diff = _d2 - b2;
                    if(inertia > 0){ inertia *= -1; }
                    kill = 'positive'; }
                diff_ab = change - diff; //bounce does not take into account weight currently;
                diff_ab *= this.master.bounce;
                inertia *= this.master.bounce;
                _d1 -= diff;
                _d1 -= diff_ab;
                _d1 = Math.floor(_d1);
                _d2 = _d1 + (d2 - d1);
                count += 1; }
        } while(!valid);
        var obj = {
            'd1' : Math.round(d1), 
            'd2' : Math.round(d2), 
            'inertia' : inertia, 
            'kill' : kill };
        if(has){ this.master.bounceFunction(); }
        return obj; };
    adr.DragObject.prototype.run = function(){
        var uc = __imns('util.classes'),
            ud = __imns('util.dom');
        var change = this.calculateChange();
        var targetBounds = new uc.BoundaryCoordinates({
            'left' :    ud.findElementStyle(this.dragElement, 'offsetLeft'), 
            'top' :     ud.findElementStyle(this.dragElement, 'offsetTop'), 
            'width' :   ud.findElementStyle(this.dragElement, 'offsetWidth'), 
            'height' :  ud.findElementStyle(this.dragElement, 'offsetHeight')});

        var xMove = this.resolveChange(targetBounds.x1, targetBounds.x2, this.master.controlElement.getX1(), this.master.controlElement.getX2(), change.x, this.inertia.x);
        var yMove = this.resolveChange(targetBounds.y1, targetBounds.y2, this.master.controlElement.getY1(), this.master.controlElement.getY2(), change.y, this.inertia.y);

        this.kill.x = xMove.kill;
        this.kill.y = yMove.kill;
        this.inertia.x = xMove.inertia;
        this.inertia.y = yMove.inertia;

        if(xMove.d1 === targetBounds.x1 && yMove.d1 === targetBounds.y1){
            if(!this.moved && !this.dragging){
                this.finished = true;
            } else { this.moved = false; }
        } else {
            this.moved = true;
            this.finished = false;
            if(!this._constrain.x){ this.dragElement['style']['left'] = (xMove.d1 + this.start.x) + 'px'; }
            if(!this._constrain.y){ this.dragElement['style']['top'] = (yMove.d1 + this.start.y) + 'px'; }}};


}
