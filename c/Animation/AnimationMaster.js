"use strict";
/* global isCSSCubicBezier, CubicBezierCoordinates, document, isNumber, findElementsByTag, isArray, SupportedCSSProperty, findElementStyle, isHTMLElement, clearInterval, setInterval, measure, fetter, unfetter, whatmeasure, Animation, IMDebugger, AnimationProperty, console */
// requires isCSSCubicBezier, findElementsByTag, SupportedCSSProperty, fetter, whatmeasure, isNumber
// to do pause, multiplebits, check preserve.
// should pause be a toggle? should it then have a reset starts?

/*
 * @module AnimationMaster
 * @constructor
 * 
 */
function AnimationMaster(){
	if(AnimationMaster.prototype.singleton !== undefined){ return AnimationMaster.prototype.singleton; }
	AnimationMaster.prototype.singleton = this;
	this.needsAnimation = '';
	this.id_count = 0;
	this.animations = [];
	this.fps = 26;
	this.init(); }
AnimationMaster.prototype.init = function(){
	var c = this;
	var transfun = function(){
		c.needsAnimation = (new SupportedCSSProperty('transition-property', findElementsByTag('body')[0]).exists) ? false : true;
		unfetter(document, 'DOMContentLoaded', transfun); };
	fetter(document, 'DOMContentLoaded', transfun, true, 'both'); };
AnimationMaster.prototype.internalFind = function(o){
	var r = [];
	if('animation' in o){
		r = this.findPositionByAnimation(o.animation);
		return (r !== -1) ? this.animations[r] : null;
	} else if('id' in o){
		r = this.findPositionById(o.id);
		return (r !== -1) ? this.animations[r] : null; }
	r = [];
	if('element' in o && 'descriptor' in o){
		r = this.findPositionsByElementsAndDescriptors(o.element, o.descriptor);
	} else if('element' in o){
		r = this.findPositionsByElement(o.element);
	} else if('descriptor' in o){
		r = this.findPositionsByDescriptor(o.descriptor); }
	if(r.length === 0){
		return null;
	} else if(r.length === 1){
		return this.animations[r[0]];
	} else {
		var a = [];
		for(var i = 0, imax = r.length; i < imax; i += 1){ a.push(this.animations[r[i]]); }
		return a; }};
AnimationMaster.prototype.findPositionById = function(id){
	var f = -1;
	for(var i=0, imax = this.animations.length; i < imax; i += 1){ if(this.animations[i].id === id){ f = i; break; }}
	return f; };
AnimationMaster.prototype.findPositionByAnimation = function(anim){
	var f = -1;
	for(var i=0, imax = this.animations.length; i < imax; i += 1){ if(this.animations[i] === anim){ f = i; break; }}
	return f; };
AnimationMaster.prototype.findPositionsByElement = function(element){
	var f = [];
	for(var i=0, imax = this.animations.length; i < imax; i += 1){ if(this.animations[i].element === element){ f.push(i); }}
	return f; };
AnimationMaster.prototype.findPositionsByDescriptor = function(descriptor){
	var f = [];
	for(var i=0, imax = this.animations.length; i < imax; i += 1){ if(this.animations[i].descriptor === descriptor){ f.push(i); }}
	return f; };
AnimationMaster.prototype.findPositionsByElementsAndDescriptors = function(elem, desc){
	var f = [];
	for(var i=0, imax = this.animations.length; i < imax; i += 1){
		if(this.animations[i].element === elem && this.animations[i].descriptor === desc){ f.push(i); }}
	return f; };
AnimationMaster.prototype.getId = function(anim){
	if(anim instanceof Animation){
		if(this.findPositionByAnimation(anim) === -1){
			this.id_count += 1;
			this.animations.push(anim);
			return this.id_count;
		} else { return this.animations[this.findPositionByAnimation(anim)].id; }
	} else { throw new TypeError('AnimationMaster.getId must be provided an Animation'); }};
AnimationMaster.prototype.find = function(){
	var _id = null,  _element = null, _descriptor = null, _animation = null, obj = {};
	if(arguments.length === 1 && typeof arguments[0] === 'object'){
		obj = arguments[0];
		_id = ('id' in obj && isNumber(obj.id) && Math.round(obj.id) === obj.id) ? obj.id : null;
		_element = ('element' in obj && isHTMLElement(obj.element)) ? obj.element : null;
		_descriptor = ('descriptor' in obj && typeof obj.descriptor === 'string') ? obj.descriptor : null;
		//_animation = ('animation' in obj && obj.animation instanceof Animation) ? obj.animation : null;
	} else if(arguments.length === 3){
		_id = (isNumber(arguments[0]) && (Math.round(arguments[0]) === arguments[0])) ? arguments[0] : null;
		_element = (arguments[1] !== undefined && isHTMLElement(arguments[1])) ? arguments[1] : null;
		_descriptor = (arguments[2] !== undefined && typeof arguments[2] === 'string') ? arguments[2] : null;
	} else if(arguments.length === 1 && arguments[0] !== undefined){
		var n = arguments[0];
		if(isHTMLElement(n)){
			_element = n;
		} else if(n instanceof Animation){
			_animation = n;
		} else if(isNumber(n) && Math.round(n) === n){
			_id = n;
		} else if(typeof n === 'string'){ 
			_descriptor = n; }}
	if(_animation !== null || _element !== null || _descriptor !== null || _id !== null){
		obj = {};
		if(_animation !== null){ obj.animation = _animation; }
		if(_element !== null){ obj.element = _element; }
		if(_descriptor !== null){ obj.descriptor = _descriptor; }
		if(_id !== null){ obj.id = _id; }
		return this.internalFind(obj);
	} else { return null; }};

function AnimationProperty(n){
	this.name = "";
	this.start = "";
	this.end = "";
	this.type = "css"; //CSS||custom;
	this._get = null;
	this._set = null; 
	if(n !== undefined){ this.init(n); }
}
AnimationProperty.prototype.init = function(o){
	if('name' in o){ this.setName(o.name); }
	if('start' in o){ this.setStart(o.start); }
	if('end' in o){ this.setEnd(o.end); }
	if('get' in o && 'set' in o){ this.custom(o.get, o.set); }};
AnimationProperty.prototype.getStart = function(elem){ return (this.start !== "") ? this.start : this.get(elem); };
AnimationProperty.prototype.getEnd = function(elem){ return (this.end !== "") ? this.end : this.get(elem); };
AnimationProperty.prototype.get = function(elem){
	var fun = (this.type === 'custom' && this._get !== null && typeof this._get === 'function') ? this._get : this.cssGet;
	try {
		return fun(elem);
	} catch(e) {
		(new IMDebugger()).pass('Animation Property (' + this.name + '), requires custom get'); }
	return ""; };
AnimationProperty.prototype.set = function(elem, val){
	var fun = (this.type === 'custom' && this._set !== null && typeof this._set === 'function') ? this._set : this.cssSet;
	try {
		return fun(elem, val);
	} catch(e){
		(new IMDebugger()).pass('Animation Property (' + this.name + '), requires custom set');
	}
	return ""; };
AnimationProperty.prototype.cssGet = function(elem){
	if(elem !== undefined && isHTMLElement(elem) && 'style' in elem){
		return findElementStyle(elem, (new SupportedCSSProperty(this.name)).cssProperty);
	} else { return ""; }};
AnimationProperty.prototype.cssSet = function(elem, val){
	if(elem !== undefined && isHTMLElement(elem) && 'style' in elem){
		elem.style[(new SupportedCSSProperty(this.name)).jsProperty] = val;
		return (elem.style[(new SupportedCSSProperty(this.name)).jsProperty] === val) ? true : false;
	} else { return false; }};

AnimationProperty.prototype.setName = function(n){
	if(n !== undefined && typeof n === 'string' && n.length > 0){
		if((new SupportedCSSProperty(n)).exists){
			this.name = n;
			this.type = 'css';
		} else {
			this.name = n;
			this.type = 'custom'; }}};
AnimationProperty.prototype.setStart = function(s){ this.start = s; };
AnimationProperty.prototype.setEnd = function(e){ this.end = e; };
AnimationProperty.prototype.customGet = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._get = f;
		this.type = "custom";
		return true; } else { return false; }};
AnimationProperty.prototype.customSet = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._set = f;
		this.type = "custom";
		return true;
	} else { return false; }};
AnimationProperty.prototype.custom = function(getter, setter){
	this.customGet(getter);
	this.customSet(setter);
	return (this.customOkay()) ? true : false; };
AnimationProperty.prototype.isCustom = function(){
	if(this.type === 'css'){
		this.type = (this.name !== '' && (new SupportedCSSProperty(this.name)).exists) ? 'css' : 'custom';
		return (this.type === 'custom') ? true : false;
	} else { return true; }};
AnimationProperty.prototype.customOkay = function(){ return (this.isCustom() && this._get !== null && this._set !== null) ? true : false; };


function Animation(o){
	this.master = null;
	this.element = null;
	this.id = null;
	this.default_timing = 500;
	this.timings = [];
	this.properties = [];
	this.timing_functions = [];
	this.cubic_beziers = [];
	this.forceJSAnimation = false;
	
	this.animating = false;
	
	this.preserve_initial = true;
	this.retain_initial = false;
	this.preserve = null;

	this.interval = null;
	this.descriptor = "";
	this.endFunction = null;
	this.paused = true;
	this.transitionFunctionKeywords = [
		{ 'n': 'ease', 'v': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'},
		{ 'n': 'linear', 'v': 'cubic-bezier(0.0, 0.0, 1.0, 1.0)'}, 
		{ 'n': 'ease-in', 'v': 'cubic-bezier(0.42, 0, 1.0, 1.0)'}, 
		{ 'n': 'ease-out', 'v': 'cubic-bezier(0, 0, 0.58, 1.0)'}, 
		{ 'n': 'ease-in-out', 'v': 'cubic-bezier(0.42, 0, 0.58, 1.0)'}
	];
	this.init(o); }
Animation.prototype.init = function(o){
	this.master = new AnimationMaster();
	this.id = this.master.getId(this); 
	if(o !== undefined){
		if('element' in o){ this.addElement(o.element); }
		if('descriptor' in o){ this.addDescriptor(o.descriptor); }
		if('endFunction' in o){ this.addEndFunction(o.endFunction); }
		if('duration' in o){ this.addDuration(o.duration); }
		if('timingFunction' in o){ this.addTimingTransitionFunction(o.timingFunction); }
		if('property' in o){ this.addProperty(o.property); }}};
Animation.forceJSAnimate = function(boo){
	if(boo === undefined){
		this.forceJSAnimation = (this.forceJSAnimation) ? false : true;
	} else { this.forceJSAnimation = (boo) ? true : false; }
	return this.forceJSAnimation; };
Animation.prototype.addElement = function(elem){
	this.element = (elem !== undefined && isHTMLElement(elem)) ? elem : null;
	return (this.element === elem); };
Animation.prototype.addDescriptor = function(str){
	this.descriptor = (typeof str === 'string') ? str : "";
	return (this.descriptor === str); };
Animation.prototype.addEndFunction = function(fun){
	this.endFunction = (typeof fun === 'function') ? fun : null; };
Animation.prototype.addDuration = function(t){
	if(!isArray(t)){
		if(typeof t === "string"){
			t = t.split(',');
		} else if(typeof t === 'number'){ 
			t = [t];
		} else { t = []; }}
	this.timings = [];
	var regSecs = /^[0-9]*\.?[0-9]+( )?s$/;
	var regMS = /^[0-9]*\.?[0-9]+( )?ms$/;
	for(var i=0, imax = t.length; i < imax; i += 1){
		if(regMS.test(t[i])){
			this.timings.push(parseFloat(t[i]));
		} else if(regSecs.test(t[i])){ 
			this.timings.push(parseFloat(t[i]) * 1000);
		} else if(isNumber(t[i]) && t[i] > 0){ this.timings.push(t[i]); }}
	if(this.timings.length === 1){ this.default_timing = this.timings[0]; } else { this.default_timing = null; }};
Animation.prototype.run = function(){
	var i=0, imax = 0, c = this;
	this.animation_end = (this.timings.length === 0) ? this.default_timing : 0;
	for(i=0, imax = this.timings.length; i < imax; i += 1){ this.animation_end = (this.timings[i] > this.animation_end) ? this.timings[i] : this.animation_end; }
	this.animating = true;
	if(this.master.needsAnimation || this.forceJSAnimation){
		this.animation_start = new Date().getTime();
		this.cubic_beziers = [];
		for(i=0, imax = this.timing_functions.length; i<imax; i += 1){ 
			this.cubic_beziers[i] = new CubicBezierCoordinates();
			this.cubic_beziers[i].cssSet(this.timing_functions[i]); }
		this.interval = setInterval(function(){ c.animate(); }, 1000/this.master.fps);
	} else {
		this.gatherInitialTransitions();
		var l = this.properties.length;
		for(i=0; i<l; i+=1){
			var p = this.properties[i].get(this.element);
			if(p === ''){ p = this.properties[i].setStart(p); }}
		this.transitionSetter({
			'property' : this.producePropertyString(), 
			'duration' : this.produceTimingDurationString(), 
			'timingFunction' : this.produceTimingFunctionString()});
		this.clearInt();
		this.interval = setInterval(function(){
			this.animating = false;
			if(c.endFunction !== null && typeof c.endFunction === 'function'){ c.endFunction(); }
			c.clear(); }, this.animation_end);
		for(i=0, imax = this.properties.length; i<imax; i += 1){ 
			this.properties[i].set(this.element, this.properties[i].getEnd(this.element)); }}};
Animation.prototype.getCubicBezier = function(i){
	if(this.cubic_beziers.length > 0){
		if(isNumber(i) && i > -1 && i < this.cubic_beziers.length){
			return this.cubic_beziers[i];
		} else { return this.cubic_beziers[0]; }
	} else { (new IMDebugger()).pass('Animation has no cubic beziers, will need resolution'); }};
Animation.prototype.gatherInitialTransitions = function(){
	if(this.preserve_initial){
		this.preserve = {
			'property' : this.element.style[(new SupportedCSSProperty('transition-property')).jsProperty], 
			'duration' : this.element.style[(new SupportedCSSProperty('transition-duration')).jsProperty], 
			'timingFunction' : this.element.style[(new SupportedCSSProperty('transition-timing-function')).jsProperty]};
	} else { this.preserve = null; }
	if(this.retain_initial){
		this.addProperty(this.preserve.property);
		this.addTiming(this.preserve.duration);
		this.addTimingFunction(this.preserve.timingFunction);}};
Animation.prototype.resetInitialTransitions = function(){
	if(this.preserve_initial && this.preserve !== null){
		this.transitionSetter(this.preserve.property, this.preserve.duration, this.preserve.timingFunction);
	} else { this.transitionSetter('', '', ''); }};
Animation.prototype.transitionSetter = function(p, d, f){
	if(typeof p === 'object' && 'property' in p && 'duration' in p && 'timingFunction' in p){
		f = p.timingFunction;
		d = p.duration;
		p = (new SupportedCSSProperty(p.property)).cssProperty; }
	this.element.style[(new SupportedCSSProperty('transition-property')).jsProperty] = p;
	this.element.style[(new SupportedCSSProperty('transition-duration')).jsProperty] = d;
	this.element.style[(new SupportedCSSProperty('transition-timing-function')).jsProperty] = f; };
Animation.prototype.animate = function(){
	var i=0, imax=0, timeNow = new Date().getTime() - this.animation_start, p, v; //number of miliseconds since;
	if(timeNow <= this.animation_end){
		for(i=0,imax=this.properties.length; i < imax; i += 1){
			var onTime = (this.timings[i] !== undefined) ? this.timings[i] : this.default_timing;
			if(timeNow > onTime){
				this.properties[i].set(this.element, this.properties[i].getEnd(this.element));
			} else {
				try {
					p = timeNow/onTime;
					v = (parseFloat(this.properties[i].getStart(this.element)) + ((this.getCubicBezier(i)).findYPositionFromX(p) * (parseFloat(this.properties[i].getEnd(this.element)) - parseFloat(this.properties[i].getStart(this.element))))) + whatmeasure(this.properties[i].getEnd(this.element));
					this.properties[i].set(this.element, v);
				} catch(e){ (new IMDebugger()).pass(e); }}}
	} else {
		for(i=0,imax = this.properties.length; i < imax; i += 1){
			try {
				this.properties[i].set(this.element, this.properties[i].getEnd(this.element));
			} catch(e) {}}
		this.animating = false;
		if(this.endFunction !== null && typeof this.endFunction === 'function'){ this.endFunction(); }
		this.clear(); }};
Animation.prototype.addTimingTransitionFunction = function(s){
	var a = this.stringParser(s), b = [], added = 0;
	for(var i=0, imax = a.length; i<imax; i+=1){
		if(isCSSCubicBezier(a[i])){
			b.push(a[i]);
		} else {
			for(var n=0, nmax = this.transitionFunctionKeywords.length; n<nmax; n += 1){
				if(this.transitionFunctionKeywords[n].n === a[i]){
					b.push(this.transitionFunctionKeywords[n].v);
					break; }}}}
	for(var m=0, mmax = b.length; m<mmax; m += 1){
		this.timing_functions.push(b[m]);
		added += 1; }
	return added; };
Animation.prototype.stringParser = function(s){
	if(typeof s === 'string'){
		if(s.indexOf(',') !== -1){
			var l = s.length, i = 0, preceded = false, ss = 0, a = [];
			while(i < l){
				var on_char = s.charAt(i);
				if(on_char === '('){ 
					preceded = true;
				} else if(on_char === ')'){
					preceded = false;
				} else if(s.charAt(i) === ',' && !preceded){
					a.push(s.substring(ss, i));
					ss = i + 1; }
				i += 1; }
			a.push(s.substring(ss));
			for(var d = 0, dmax = a.length; d < dmax; d += 1){ a[d] = a[d].replace(/^\s\s*/, '').replace(/\s\s*$/, ''); }
			return a;
		} else { return [s]; }
	} else if(isNumber(s)){
		return [s];
	} else {
			 if(isArray(s)){ 
			 	return s; 
			 } else { return []; }}};
Animation.prototype.setProperty = function(_n, _s, _e){
	if(arguments){
		if(arguments.length === 1){ return (this.addProperty(arguments[0]) > 0) ? true : false; }
		if(arguments.length === 2){ return (this.addProperty(arguments[0], arguments[1]) > 0) ? true : false; }
		if(arguments.length === 3){ return (this.addProperty(arguments[0], arguments[1], arguments[2]) > 0) ? true : false; }
	} else { return false; }};
Animation.prototype.addProperty = function(_name, _start, _end, _custom){
	var o = {
		'name' : '',
		'start' : 0, 
		'end' : 0 };
	if(typeof _name === 'object' && !isArray(_name)){
		_name.name =('property' in _name && !('name' in _name)) ?  _name.property : _name.name; 
		if('name' in _name){ o.name = _name.name; }
		if('start' in _name){ o.start = _name.start; }
		if('end' in _name){ o.end = _name.end; }
		if('custom' in _name){ o.custom = _name.custom; }
	} else {
		var arr = (isArray(_name) && arguments.length === 1) ? _name : arguments;
		if(arr.length > 0){
			if(arr[0] !== undefined){ o.name = arr[0]; }
			if(arr[1] !== undefined){ o.start = arr[1]; }
			if(arr[2] !== undefined){ o.end = arr[2]; }
			if(arr[3] !== undefined){ o.custom = arr[3]; }}}
	o.name = this.stringParser(o.name);
	o.start = this.stringParser(o.start);
	o.end = this.stringParser(o.end);
	var added = 0, n, p, start_measure, end_measure;
	for(var i=0, imax = o.name.length; i<imax; i+=1){
		n = {
			'name' : o.name[i], 
			'start': o.start[i], 
			'end': o.end[i] };
		start_measure = (n.start !== undefined) ? whatmeasure(n.start) : '';
		end_measure = (n.end !== undefined) ? whatmeasure(n.end) : '';
		n.start = (n.start !== undefined) ? measure(n.start, end_measure, (this.element !== null) ? this.element : undefined) : undefined;
		n.end = (n.end !== undefined) ? measure(n.end, end_measure, (this.element !== null) ? this.element : undefined) : undefined;
		p = new AnimationProperty(n);
		if(p.isCustom()){
			if('custom' in o){
				if(isArray(o.custom) && o.custom[i] !== undefined){
					p.custom(o.custom[i]);
				} else if('get' in o.custom && 'set' in o.custom){ p.custom(o.custom.get, o.custom.set); }}}
		var ti = this.findPropertyIndex(n.name);
		if(ti === -1){
			this.properties.push(p);
		} else { 
			if(n.start !== undefined){ this.properties[ti].setStart(n.start); }
			if(n.end !== undefined){ this.properties[ti].setEnd(n.end); }
			if(n.custom !== undefined){ this.properites[ti].custom(n.custom.get, n.custom.set); }}
		added += 1; }
	return added; };

Animation.prototype.findPropertyIndex = function(p){
	var e = -1;
	for(var i=0, imax = this.properties.length; i<imax; i+=1){ if(this.properties[i].name === p){ e = i; break; }}
	return e; };
Animation.prototype.producePropertyString = function(){
	if(this.properties.length === 0){
		return 'all';
	} else {
		var s = '';
		for(var i=0, imax = this.properties.length; i<imax; i+=1){
			if(!this.properties[i].isCustom()){ s += this.properties[i].name + ', '; }}
		s = (s.length > 0) ? s.substring(0, s.length - 2) : s;
		return s; }};
Animation.prototype.produceTimingDurationString = function(){ return (this.timings.length === 0) ? this.default_timing + 'ms' : this.timings.join('ms,') + 'ms'; };
Animation.prototype.produceTimingFunctionString = function(){ return (this.timing_functions.length === 0) ? "linear" : this.timing_functions.join(','); };
Animation.prototype.clear = function(){
	if(this.interval !== null){ 
		clearInterval(this.interval);
		this.interval = null; }
	if(!this.master.needsAnimation){ 
		this.resetInitialTransitions();}};
Animation.prototype.clearInt = function(){
	if(this.interval !== null){ clearInterval(this.interval); }
	this.interval = null; };
Animation.prototype.set = function(){
	var c = this;
	this.clear();
	this.setInterval(function(){ c.animateStep(); }, (this.timing * 1000)/this.master.fps); };
Animation.prototype.pause = function(){
	if(this.animating){
		this.animating = false;
		this.clearInt();
		if(!this.master.needsAnimation){
			for(var i=0, imax = this.properties.length; i < imax; i += 1){
				this.properties[i].set(this.element, this.properties[i].get(this.element)); }
			this.element.style['transition-property'] = 'none'; }
		return true;
	} else {
		this.recalculateStarts();
		this.animating = true;
		this.run(); }};
Animation.prototype.recalculateStarts = function(){
	for(var i=0, imax = this.properties.length; i<imax; i+=1){
		var a = this.properties[i].get(this.element);
		a = measure(a, whatmeasure(this.properties[i].getEnd(this.element)), this.element);
		this.properties[i].setStart(a); }};
