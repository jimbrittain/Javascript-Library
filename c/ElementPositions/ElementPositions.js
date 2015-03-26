"use strict";
/*jshint -W069 */
/*global isHTMLElement, getAttributer, CookieInterface, findElementStyle, findElementByID, Coordinates, CookieInterface, CookieObject */
function ElementPositions(){
	if(ElementPositions.prototype.singleton !== undefined){ return ElementPositions.prototype.singleton; }
	ElementPositions.prototype.singleton = this;
	this.elem_names = [];
	this.coords = [];
	this.default_coords = []; }
ElementPositions.prototype.add = function(s){
	var added = false, found = -1;
	if(this.findId(s) === -1){
		if(typeof s === 'string'){
			this.elem_names.push(s);
			this.default_coords.push(new Coordinates(0,0));
			added = true;
		} else if(s !== undefined && isHTMLElement(s)){
			var id = getAttributer(s, 'id');
			if(id !== ""){
				this.elem_names.push(id);
				this.default_coords.push(new Coordinates(0,0));
				added = true; }}
		return added;
	} else { return false; }};
ElementPositions.prototype.addElement = ElementPositions.prototype.add;
ElementPositions.prototype.findId = function(s){
	var found = -1, i=0, imax=0;
	if(typeof s === 'string'){
		for(i=0, imax = this.elem_names.length; i<imax; i+=1){
			if(s === this.elem_names[i]){ found = i; break; }}
	} else if(s !== undefined && isHTMLElement(s)){
		for(i=0, imax = this.elem_names.length; i<imax; i+=1){
			if(s === findElementByID(this.elem_names[i])){ found = i; break; }}
	} else if(typeof s === 'number' && Math.round(s) === s && s > -1){
		found = (s < this.elem_names.length && this.elem_names[s] !== undefined) ? s : -1; }
	return found; };
ElementPositions.prototype.remove = function(s){
	var p = this.findId(s);
	if(p !== -1){
		this.elem_names.splice(p,1);
		this.coords.splice(p,1);
		this.default_coords.splice(p,1);
		return true; }};
ElementPositions.prototype.setDefaultCoordinates = function(s, coords){
	var p = this.findId(s);
	if(p !== -1){
		if(coords !== undefined){
			coords = (!(coords instanceof Coordinates)) ? new Coordinates(coords) : coords;
			this.default_coords[p] = coords;
			return true; }}
	return false; };
ElementPositions.prototype.establish = function(s){
	var coords, p;
	if(s === undefined){
		for(var i=0,imax=this.elem_names.length;i<imax; i+=1){
			coords = (this.coords[i] !== undefined) ? this.coords[i] : this.default_coords[i];
			coords = (coords instanceof Coordinates) ? coords : new Coordinates(0,0);
			this.setPosition(this.elem_names[i], coords); }
		return true;
	} else {
		p = this.findId(s);
		if(p !== -1){
			coords = (this.coords[p] !== undefined) ? this.coords[p] : this.default_coords[p];
			coords = (coords instanceof Coordinates) ? coords : new Coordinates(0,0);
			this.setPosition(s, coords);
			return true; } else { return false; }}};
ElementPositions.prototype.reset = function(s, b){
	b = (b === undefined || !b) ? false : true;
	var coords, i, imax, e, p;
	if(s === undefined){
		for(i=0,imax=this.elem_names.length; i<imax; i+=1){
			e = findElementByID(this.elem_names[i]);
			if(e !== undefined && isHTMLElement(e)){
				coords = (this.default_coords[i] !== undefined && this.default_coords[i] instanceof Coordinates) ? this.default_coords[i] : new Coordinates(0,0);
				this.setPosition(this.elem_names[i], coords); }}
		if(b){ this.clear(); }
		return true;
	} else {
		p = this.findId(s);
		if(p !== -1){
			coords = (this.default_coords[p] !== undefined && this.default_coords[p] instanceof Coordinates) ? this.default_coords[p] : new Coordinates(0,0);
			this.setPosition(s, coords);
			if(b){ this.clear(s); }
			return true; }}};
ElementPositions.prototype.resetWithClear = function(s){ this.reset(s, true); };
ElementPositions.prototype.clear = function(s){
	if(s === undefined){
		for(var i=0,imax=this.elem_names.length; i<imax; i+=1){
			this.clearIndividual(this.elem_names[i]); }
		return true;
	} else { 
		return (this.findId(s) !== -1) ? this.clearIndividual(s) : false; }};
ElementPositions.prototype.clearIndividual = function(s){
	var p = this.findId(s), e;
	if(p !== -1){
		e = findElementByID(this.elem_names[p]);
		if(e !== undefined && isHTMLElement(e)){
			e.style['left'] = '';
			e.style['top'] = '';
			return true; }}
	return false; };
ElementPositions.prototype.setPosition = function(s, coords, move){
	move = (move === undefined || move) ? true : false;
	coords = (coords instanceof Coordinates) ? coords : new Coordinates(coords);
	var p = this.findId(s);
	var e = (p !== -1) ? findElementByID(this.elem_names[p]) : undefined;
	if(e !== undefined && isHTMLElement(e)){
		e.style['left'] = coords.x;
		e.style['top'] = coords.y;
		this.getPosition(s);
		this.remember();
		return true; }
	return false; };
ElementPositions.prototype.getPosition = function(s){
	var c, p;
	if(s === undefined){
		for(var i=0,imax = this.elem_names.length; i<imax; i+=1){
			c = this.getCurrentCoordinates(this.elem_names[i]);
			if(c instanceof Coordinates){ this.coords[i] = c; }}
		return true;
	} else {
		c = this.getCurrentCoordinates(s);
		if(c instanceof Coordinates){
			p = this.findId(s);
			this.coords[p] = c;
			return true;
		} else { return false; }}};
ElementPositions.prototype.getCurrentCoordinates = function(s){
	var p = this.findId(s);
	var e = (p !== -1) ? findElementByID(this.elem_names[p]) : undefined;
	if(e !== undefined && isHTMLElement(e)){
		return new Coordinates(parseInt(findElementStyle(e, 'left')), parseInt(findElementStyle(e, 'top'))); }
	return null; };
ElementPositions.prototype.recall = function(boo){
	boo = (boo === undefined || boo) ? true : false;
	var d = new CookieInterface(), a, b, c, co = [];
	if(d.hasItem('positions')){
		a = (d.findItem('positions').value).split(';');
		for(var i=0,imax=a.length; i<imax; i+=1){
			b = a[i].split(':');
			if(b.length === 2 && !isNaN(Number(b[0])) && !isNaN(Number(b[1])) && b[0] >= 0 && b[1] >= 0){
				c = new Coordinates(b[0], b[1]);
				co.push(c); } else { co.push(new Coordinates(0,0)); }}
		for(var n=0,nmax=co.length; n<nmax; n+=1){ this.setPosition(n, co[n], boo); }}
	return false; };
ElementPositions.prototype.recallWithSet = function(){ this.recall(true); };
ElementPositions.prototype.remember = function(){
	var str = '', d = new CookieInterface();
	for(var i=0, imax=this.coords.length; i<imax; i+=1){
		str += this.coords[i].x + ':' + this.coords[i].y + ';'; }
	str = (imax > 0) ? str.substr(0, str.length - 1) : str;
	d.setItem(new CookieObject({
		'name' : 'positions', 
		'value' : str, 
		'expires' : new Date().getTime() + (60 * 60 * 24 * 28)})); };
