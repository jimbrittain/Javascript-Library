"use strict";
/* global isHTMLElement, console, HTMLClass, DragObject, findElementStyle, BoundaryCoordinates, measure, fetter, window, MouseRecorderInstance, MouseRecorder, document, setInterval, unfetter, clearInterval, SupportedCSSProperty, Coordinates, DragMaster, DragGlobal */
/*jshint -W069 */
function DragGlobal(){
	if(DragGlobal.prototype.singleton !== undefined){ return DragGlobal.prototype.singleton; }
	DragGlobal.prototype.singleton = this;
	this.masters = [];
	this.mri = new MouseRecorderInstance({
		'name' : 'DragMaster', 
		'element' : document, 
		'type' : 'both' });
	this.mouserecorder = new MouseRecorder();
	this.mouserecorder.setRecord(this.mri);
	this.mouserecorder.alwaysRecord(); }

DragGlobal.prototype.add = function(dm){
	if(dm instanceof DragMaster){
		var found = false;
		for(var i=0,imax=this.masters.length; i<imax; i+=1){
			if(dm === this.masters[i]){ found = true; }}
		if(!found){ 
			this.masters.push(dm);
			return true; }}
	return false; };
DragGlobal.prototype.disableSelection = function(){
	var c = this;
	fetter(document, 'dragstart', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	fetter(document, 'selectstart', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	fetter(document, 'select', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	fetter(document, 'draggesture', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	fetter(document, 'drag', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	fetter(document, 'dragdrop', function(e){ (new DragGlobal()).disableCover(e); return false; }, true); };
DragGlobal.prototype.enableSelection = function(){
	var c = this;
	unfetter(document, 'dragstart', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	unfetter(document, 'selectstart', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	unfetter(document, 'select', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	unfetter(document, 'draggesture', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	unfetter(document, 'drag', function(e){ (new DragGlobal()).disableCover(e); return false; }, true);
	unfetter(document, 'dragdrop', function(e){ (new DragGlobal()).disableCover(e); return false; }, true); };
DragGlobal.prototype.disableCover = function(e){
	if(!e){ e = window.event; }
	if('stopPropagation' in e){ e.stopPropagation(); }
	if('preventDefault' in e){ e.preventDefault(); }
	if('cancelBubble' in e){ e.cancelBubble = true; }
	if('focus' in document.body){ document.body.focus(); }
	if('select' in document.body){ document.body.select(); }
	if('selection' in document){ document.selection.clear(); }
	e = undefined;
	return false; };
DragGlobal.prototype.clearStopControls = function(){
	unfetter(document, 'mouseup', function(e){ (new DragGlobal()).allStop(e); }, true);
	unfetter(document, 'touchcancel', function(e){ (new DragGlobal()).allStop(e); }, true);
	unfetter(document, 'touchend', function(e){ (new DragGlobal()).allStop(e); }, true); };
DragGlobal.prototype.initStopControls = function(){
	fetter(document, 'mouseup', function(e){ (new DragGlobal()).allStop(e); }, true);
	fetter(document, 'touchcancel', function(e){ (new DragGlobal()).allStop(e); }, true);
	fetter(document, 'touchend', function(e){ (new DragGlobal()).allStop(e); }, true); };

DragGlobal.prototype.allStop = function(){
	for(var i=0, imax=this.masters.length; i<imax; i+=1){
		this.masters[i].stopDrag(); }
	this.clearStopControls(); };

function DragMaster(ctrlElement){
	if(DragMaster.prototype.id === undefined){ DragMaster.prototype.id = 0; }
	DragMaster.prototype.id += 1;
	this.global = new DragGlobal();
	this.global.add(this);
	this.id = DragMaster.prototype.id;
	
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
	this.construct(ctrlElement); }

DragMaster.prototype.setPosition = function(str){
	str = (typeof str === 'string') ? str.toLowerCase() : '';
	this.position = (str === 'absolute') ? 'absolute' : 'relative';
	return (str === this.position); };

DragMaster.prototype.addFinishFunction = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._finishFunction = f;
		return true;
	} else { this._finishFunction = null; return false; }};
DragMaster.prototype.addStartFunction = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._startFunction = f;
		return true;
	} else { this._startFunction = null; return false; }};
DragMaster.prototype.addBounceFunction = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._bounceFunction = f;
		return true;
	} else { this._bounceFunction = null; return false; }};
DragMaster.prototype.startFunction = function(){
	if(this._startFunction !== null && this._startFunction !== undefined && typeof this._startFunction === 'function'){
		return this._startFunction(this);
	} else { return true; }};
DragMaster.prototype.finishFunction = function(){
	if(this._finishFunction !== null && this._finishFunction !== undefined && typeof this._finishFunction === 'function'){
		return this._finishFunction(this);
	} else { return true; }};
DragMaster.prototype.bounceFunction = function(){
	if(this._bounceFunction !== null && this._bounceFunction !== undefined && typeof this._bounceFunction === 'function'){
		return this._bounceFunction(this);
	} else { return true; }};
DragMaster.prototype.assignFunctional = function(f){
	if(typeof f === "function"){
		this._functional = f;
		return true;
	} else { return false; }};

DragMaster.prototype.constrain = function(x,y){
	if(x !== undefined){ this.constrainX(x); }
	if(y !== undefined){ this.constrainY(y); }};
DragMaster.prototype.constrainX = function(boo){
	if(boo !== undefined && (boo || !boo)){
		this._constrain.x = (boo) ? true: false;
	} else { this._constrain.x = (this._constrain.x) ? false : true; }
	if(this.initialised && this.draggableObjects.length > 0){
		for(var i=0, imax = this.draggableObjects.length; i<imax; i+=1){
			this.draggableObjects[i].constrainX(this._constrain.x); }}};
DragMaster.prototype.constrainY = function(boo){
	if(boo !== undefined && (boo || !boo)){
		this._constrain.y = (boo) ? true : false;
	} else { this._constrain.y = (this._constrain.y) ? false : true; }
	if(this.initialised && this.draggableObjects.length > 0){
		for(var i=0, imax = this.draggableObjects.length; i<imax; i+=1){
			this.draggableObjects[i].constrainY(this._constrain.y); }}};

DragMaster.prototype.findObjectIndex = function(obj){
	var n = -1;
	if(obj instanceof DragObject){
		for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
			if(this.draggableObjects[i] === obj){
				n = i;
				break; }}}
	return n; };
DragMaster.prototype.findIndex = function(obj){
	var n = -1;
	if(obj instanceof DragObject){
		n = this.findObjectIndex(obj);
	} else if(isHTMLElement(obj)){
		n = this.findElementIndex(obj);
	} else if(typeof obj === 'number' && n > 0 && n < this.draggableObjects.length){
		n = obj; }
	return n; };
DragMaster.prototype.findElementIndex = function(elem){
	var n = -1;
	if(elem !== undefined && isHTMLElement(elem)){
		for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
			if(this.draggableObjects[i].dragElement === elem){
				n = i;
				break; }}}
	return n; };
DragMaster.prototype.findObject = function(obj){
	var n = this.findIndex(obj);
	if(n !== -1){
		return this.draggableObjects[n];
	} else { return undefined; }};

DragMaster.prototype.objectExists = function(obj){ return (this.findIndex(obj) === -1) ? false : true; };
DragMaster.prototype.elementExists = function(elem){ return (this.findIndex(elem) === -1) ? false : true; };

DragMaster.prototype.setCodeInterval = function(){
	this.clearCodeInterval();
	var c = this;
	this.codeInt = setInterval(function(){ c.runMoving(); }, 70); };
DragMaster.prototype.clearCodeInterval = function(){
	if(this.codeInt !== null){
		clearInterval(this.codeInt);
		this.codeInt = null; }};


DragMaster.prototype.construct = function(ctrlElement){
	this.initialised = false;
	if(ctrlElement instanceof BoundaryCoordinates){
		this.controlElement = ctrlElement;
	} else if(ctrlElement !== undefined && isHTMLElement(ctrlElement)){
		this.controlElement = new BoundaryCoordinates(ctrlElement);
	} else { this.controlElement = new BoundaryCoordinates(); }};

DragMaster.prototype.isFunctional = function(){
	if(this._functional !== null && typeof this._functional === "function"){
		return this._functional();
	} else { return this.enabled; }};

DragMaster.prototype.disable = function(){
	if(this.enabled){
		this.enabled = false;
		for(var i=0,imax=this.draggableObjects.length; i<imax; i+=1){ this.draggableObjects[i].dragElement.style.position = ''; }
		if(this.dragObject !== null){ this.stopDrag(); }}};
DragMaster.prototype.reenable = function(){
	if(!this.enabled){
		this.enabled = true;
		for(var i=0,imax=this.draggableObjects.length; i<imax; i+=1){ this.draggableObjects[i].dragElement.style.position = this.position; }}};


DragMaster.prototype.add = function(targetElement, controllerElement){
	if(targetElement !== undefined && isHTMLElement(targetElement) && !this.elementExists(targetElement)){
		var tempObject = new DragObject(this);
		tempObject = tempObject.init(targetElement, controllerElement);
		tempObject.constrain(this._constrain.x, this._constrain.y);
		if(tempObject !== undefined && tempObject instanceof DragObject){ 
			if(this.initialised){ tempObject.initRestingControls(); }
			this.draggableObjects.push(tempObject);
			return true; }}
	return false; };
DragMaster.prototype.remove = function(obj){
	var n = this.findIndex(obj);
	if(n !== -1){
		this.draggableObjects[n].clearControls();
		this.draggableObjects.splice(n, 1); }};
DragMaster.prototype.destroy = function(){
	if(this.dragObject !== null){ this.stopDrag(); }
	while(this.draggableObjects.length > 0){
		this.remove(this.draggableObjects[0]); }
	this.dragObject = null;
	this.stopDrag(); };





DragMaster.prototype.defineDragging = function(dragObject){
	this.dragObject = this.draggableObjects[this.findIndex(dragObject.dragElement)];
	(new DragGlobal()).disableSelection(document);
	for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
		if(this.draggableObjects[i] !== this.dragObject){
			this.draggableObjects[i].dragging = false;
			(new HTMLClass()).removeClass(this.draggableObjects[i].dragElement, 'dragging');
		} else {
			this.stackToTop(this.draggableObjects[i]);
			this.draggableObjects[i].dragging = true;
			(new HTMLClass()).addClass(this.draggableObjects[i].dragElement, 'dragging');
			this.draggableObjects[i].initDrag(); }}};

DragMaster.prototype.runMoving = function(){
	var done = true;
	for(var i = 0, imax = this.draggableObjects.length; i < imax; i += 1){
		if(!this.draggableObjects[i].finished){
			this.draggableObjects[i].run();
			done = false; }}
	if(done){ this.clearCodeInterval(); }
	done = undefined; };
DragMaster.prototype.finishedMoving = function(){
	var done = true;
	for(var i = 0, imax = this.draggableObjects.length; i < imax; i += 1){
		if(!this.draggableObjects[i].finished){
			done = false;
			break; }}
	return done; };

DragMaster.prototype.init = function(){
	if(this.enabled && !this.initialised && this.draggableObjects.length > 0){
		this.initialised = true;
		for(var i=0, imax = this.draggableObjects.length; i < imax; i += 1){
			this.draggableObjects[i].initRestingControls(); }
		return true;
	} else { return false; }};
DragMaster.prototype.refresh = DragMaster.prototype.init;

DragMaster.prototype.stackToTop = function(dragObject){
	var n = this.findObjectIndex(dragObject);
	if(n !== -1){
		var tempHold = this.draggableObjects[n];
		this.draggableObjects.splice(n,1);
		this.draggableObjects.push(tempHold);
		this.resolveStacking(); }};
DragMaster.prototype.resolveStacking = function(){
	for(var i=0; i<this.draggableObjects.length; i += 1){
		if(isHTMLElement(this.draggableObjects[i].dragElement)){
			this.draggableObjects[i].dragElement['style']['zIndex'] = 1000 + i;
		} else { 
			this.remove(this.draggableObjects[i]);
			i -= 1; }}};
DragMaster.prototype.stopDrag = function(e){
	if(this.dragObject !== null){
		for(var i=0, imax=this.draggableObjects.length; i<imax; i += 1){ 
			this.draggableObjects[i].dragging = false; }
		if((new SupportedCSSProperty('box-shadow')).exists){
			this.dragObject.dragElement['style'][(new SupportedCSSProperty('box-shadow')).cssProperty] = '0 0 0 rgba(0,0,0,0)';
		}
		this.finishFunction();
		this.dragObject.initRestingControls(); 
		(new DragGlobal()).enableSelection();
		(new HTMLClass()).removeClass(this.dragObject.dragElement, 'dragging');
		this.dragObject = null; }};




function DragObject(mst){
	if(DragObject.prototype.uid === undefined){ DragObject.prototype.uid = 1; } else { DragObject.prototype.uid += 1; }
	this.uid = DragObject.prototype.uid;
	this.master = null;
	
	this._constrain = {
		'x' : false, 
		'y' : false };
	
	this.controllerElement = null;
	this.dragElement = null;
	
	this.bounce = 0;
	this.inertiaRate = 0;
	this.weight = 1; //this needs to be changed by elementWidth;
	
	this.lastMouse = new Coordinates(0,0);
	this.start = new Coordinates(0,0);
	this.kill = {'x': false, 'y': false};
	this.inertia = new Coordinates(0,0);
	
	this.dragging = false;
	this.moved = false;
	this.finished = true; 
	
	if(mst !== undefined && mst instanceof DragMaster){ 
		this.master = mst;
		this.bounce = this.master.bounce;
		this.inertiaRate = this.master.inertiaRate;
		this.weight = this.master.weight; //this needs to be changed by elementWidth;
	}
}
	
DragObject.prototype.init = function(targetElement){
	if(targetElement !== undefined && isHTMLElement(targetElement)){
		this.dragElement = targetElement;
		this.controllerElement = (arguments.length > 1 && arguments[1] !== null && isHTMLElement(arguments[1])) ? arguments[1] : targetElement;
		this.start.x = findElementStyle(this.dragElement, 'offsetLeft');
		this.start.y = findElementStyle(this.dragElement, 'offsetTop');
		var positional = new Coordinates('0','0');
		if(this.master.position === 'absolute' && this.dragElement['style']['position'] !== this.master.position){
			if('parentNode' in this.dragElement){
				positional.x -= Number(findElementStyle(this.dragElement.parentNode, 'offsetLeft'));
				positional.y -= Number(findElementStyle(this.dragElement.parentNode, 'offsetTop')); }}
		this.dragElement['style']['position'] = this.master.position;
		if(this.dragElement['style']['left'] === ""){ this.dragElement['style']['left'] = (isNaN(positional.x)) ? positional.x : "0px"; }
		if(this.dragElement['style']['top'] === ""){ this.dragElement['style']['top'] = (isNaN(positional.y)) ? positional.y : "0px"; }
		return this;
	} else { return undefined; }};

DragObject.prototype.beginDrag = function(){
	if(this.master.isFunctional() && this.master.enabled){
		if((new SupportedCSSProperty('box-shadow')).exists){
			if((new SupportedCSSProperty('transition')).exists){
				this.dragElement['style'][(new SupportedCSSProperty('transition')).cssProperty] = (new SupportedCSSProperty('box-shadow')).cssProperty + ' 400ms'; }
			this.dragElement['style'][(new SupportedCSSProperty('box-shadow')).cssProperty] = '-4px 4px 7px rgba(0,0,0,0.05)'; }
		this.master.defineDragging(this); }};

DragObject.prototype.initDrag = function(){
	this.moved = false;
	this.finished = false;
	this.lastMouse = new Coordinates((new DragGlobal()).mouserecorder.x, (new DragGlobal()).mouserecorder.y);
	this.start.x = parseFloat(measure(this.dragElement['style']['left'], 'px', this.dragElement)) - findElementStyle(this.dragElement, 'offsetLeft');
	this.start.y = parseFloat(measure(this.dragElement['style']['top'], 'px', this.dragElement)) - findElementStyle(this.dragElement, 'offsetTop');
	this.inertia = new Coordinates(0,0);
	this.initActiveControls();
	this.master.startFunction();
	this.master.setCodeInterval(); };

DragObject.prototype.calculateInertia = function(change){
	if(isNaN(change)){
		return 0;
	} else {
		var cInt = change * this.inertiaRate;
		return (isNaN(cInt)) ? 0 : cInt; }};

DragObject.prototype.constrain = function(x,y){
	if(x !== undefined){ this.constrainX(x); }
	if(y !== undefined){ this.constrainY(y); }};
DragObject.prototype.constrainX = function(boo){
	if(boo !== undefined && (boo || !boo)){
		this._constrain.x = (boo) ? true : false;
	} else {
		this._constrain.x = (this._constrain.x) ? false : true; }
	return this._constrain.x; };
DragObject.prototype.constrainY = function(boo){
	if(boo !== undefined && (boo || !boo)){
		this._constrain.y = (boo) ? true : false;
	} else {
		this._constrain.y = (this._constrain.y) ? false : true; }
	return this._constrain.y; };


DragObject.prototype.calculateChange = function(){
	var xChange = 0;
	var yChange = 0;
	var change = new Coordinates(0,0);
	if(this.dragging && this.master.dragObject === this){
		change.x = ((new DragGlobal()).mouserecorder.x - this.lastMouse.x) * this.weight;
		change.y = ((new DragGlobal()).mouserecorder.y - this.lastMouse.y) * this.weight;
		switch(this.kill.x){
			case 'positive':
				change.x = ((new DragGlobal()).mouserecorder.x > this.lastMouse.x) ? 0 : change.x;
				break;
			case 'negative':
				change.x = ((new DragGlobal()).mouserecorder.x < this.lastMouse.x) ? 0 : change.x;
				break; }
		switch(this.kill.y){
			case 'positive':
				change.y = ((new DragGlobal()).mouserecorder.y > this.lastMouse.y) ? 0 : change.y;
				break;
			case 'negative':
				change.y = ((new DragGlobal()).mouserecorder.y < this.lastMouse.y) ? 0 : change.y;
				break; }
		this.lastMouse.x = (new DragGlobal()).mouserecorder.x;
		this.lastMouse.y = (new DragGlobal()).mouserecorder.y; }
	change.x += this.inertia.x;
	change.y += this.inertia.y;
	this.inertia.x = this.calculateInertia(change.x);
	this.inertia.y = this.calculateInertia(change.y);
	return change; };

DragObject.prototype.clearControls = function(){
	var c = this, m = this.master;
	(new DragGlobal()).clearStopControls();
	unfetter(this.controllerElement, 'mousedown', function(e){ c.beginDrag(e); }, true);
	unfetter(this.controllerElement, 'touchstart', function(e){ c.beginDrag(e); }, true); };

DragObject.prototype.initActiveControls = function(){
	var c = this, m = this.master;
	unfetter(this.controllerElement, 'mousedown', function(e){ c.beginDrag(e); }, true);
	unfetter(this.controllerElement, 'touchstart', function(e){ c.beginDrag(e); }, true);
	(new DragGlobal()).initStopControls(); };

DragObject.prototype.initRestingControls = function(){
	var c = this, m = this.master;
	var f = function(e){ c.beginDrag(e); c.uid = Number(c.uid); };
	fetter(this.controllerElement, 'mousedown', f, true);
	fetter(this.controllerElement, 'touchstart', f, true);
	(new DragGlobal()).clearStopControls(); };

DragObject.prototype.resolveChange = function(d1, d2, b1, b2, change, inertia){
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
DragObject.prototype.run = function(){
	var change = this.calculateChange();
	var targetBounds = new BoundaryCoordinates({
		'left' : findElementStyle(this.dragElement, 'offsetLeft'), 
		'top' : findElementStyle(this.dragElement, 'offsetTop'), 
		'width' : findElementStyle(this.dragElement, 'offsetWidth'), 
		'height' : findElementStyle(this.dragElement, 'offsetHeight')});
	
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