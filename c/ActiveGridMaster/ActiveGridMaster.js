"use strict";
/*global ActiveGridComponent */
function ActiveGridMaster(){
	if(ActiveGridMaster.prototype.singleton !== undefined){ return ActiveGridMaster.prototype.singleton; }
	ActiveGridMaster.prototype.singleton = this;
	this.delegation = [];
	this.data = null;
	this.controlling = null;
	this.components = []; }
ActiveGridMaster.prototype.delegate = function(data){
	var arr = [];
	for(var i=0,imax=this.delegation.length;i<imax; i+=1){
		if(this.delegation[i].name === this.controlling){
			arr = this.delegation[i].order;
			break; }}
	if(arr.length === 0){
		for(var m=0,mmax=this.components.length; m<mmax; m+=1){
			this.components[m].renew(data); }
	} else {
		this.data = data;
		for(var n=0,nmax=arr.length; n<nmax; n+=1){
			var tempCom = this.findComponentByName(arr[n]);
			if(tempCom instanceof ActiveGridComponent){ tempCom.renew(); }
		}}};
ActiveGridMaster.prototype.addDelegation = function(name, order){
	if(typeof name === 'object' && 'name' in name && 'order' in name){
		order = name.order;
		name = name.name; }
	if(name !== undefined && order !== undefined && typeof name === 'string'){
		var found = -1;
		for(var i=0,imax = this.delegation.length; i<imax; i+=1){
			if(this.delegation[i].name === name){
				found = i;
				break; }}
		if(found === -1){
			this.delegation.push({
				'name' : name, 
				'order' : order });
		} else { this.delegation[i].order = order; }
		return true;
	} else { return false; }};
ActiveGridMaster.prototype.findComponentIdByName = function(s){
	var found = -1;
	for(var i=0,imax = this.components.length; i<imax; i+=1){
		if(this.components[i].name === s){
			found = i;
			break; }}
	return found; };
ActiveGridMaster.prototype.findComponentByName = function(s){
	var found = this.findComponentIdByName(s);
	if(found !== -1){
		return this.components[found];
	} else { return null; }};
ActiveGridMaster.prototype.prepare = function(s){
	var com = this.findComponentByName(s);
	if(com instanceof ActiveGridComponent){
		return com.prepare();
	} else { return false; }};
ActiveGridMaster.prototype.prepareAll = function(){
	for(var i=0, imax=this.components.length; i<imax; i+=1){
		this.components[i].prepare(); }};
ActiveGridMaster.prototype.add = function(args){
	if(args instanceof ActiveGridComponent){
		if(args.name !== null && this.findComponentIdByName(args.name) === -1){
			this.components.push(args);
			return true;
		}
	} else {
		var tempCom = new ActiveGridComponent(args);
		if(tempCom !== null && this.findComponentIdByName(tempCom.name) === -1){
			this.components.push(tempCom);
			return true; }}
	return false; };
ActiveGridMaster.prototype.fallback = function(args){
	this.findComponentByName(this.controlling).fallback(args); };
ActiveGridMaster.prototype.assignControlling = function(args){
	if(args instanceof ActiveGridComponent){
		if(this.findComponentIdByName(args.name) !== -1){
			this.controlling = args.name;
			return true;
		} else { return false; }
	} else if(typeof args === 'string' && this.findComponentIdByName(args) !== -1){
		this.controlling = args;
		return true;
	} else { return false; }};
	
function ActiveGridComponent(args){
	this.name = "";
	this.data = {};
	this.initialised = false;
	this.master = new ActiveGridMaster();
	this._prepare = null;
	this._renew = null; 
	if(args !== undefined){ 
		return this.init(args); }}
ActiveGridComponent.prototype.init = function(args){
	var targetCom = this;
	if('name' in args){
		if(this.master.findComponentIdByName(args.name) !== -1){ targetCom = this.master.findComponentByName(args.name); }
		targetCom.name = args.name;
		if('prepare' in args){ targetCom.setPrepare(args.prepare); }
		if('renew' in args){ targetCom.setRenew(args.renew); }
		if('fallback' in args){ targetCom.setFallback(args.fallback); }
		return targetCom;
	} else { return null; }};
ActiveGridComponent.prototype.setRenew = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._renew = f;
		return true;
	} else { return false; }};
ActiveGridComponent.prototype.setPrepare = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._prepare = f;
		return true;
	} else { return false; }};
ActiveGridComponent.prototype.setFallback = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._fallback = f;
		return true;
	} else { return false; }};
ActiveGridComponent.prototype.renew = function(){
	if(this._renew !== null){ 
		this._renew();
		return true;
	} else { return false; }};
ActiveGridComponent.prototype.fallback = function(args){
	if(this._fallback !== null){
		this._fallback(args);
		return true;
	} else { return false; }};
ActiveGridComponent.prototype.prepare = function(){
	if(this._prepare !== null){
		this._prepare();
		this.initialised = true;
		return true;
	} else { return false; }};
	
function getAGDataFromUrl(destination){
	var data = "";
	if(destination.indexOf('?') !== -1){
		var getProps = destination.substring(destination.indexOf('?') + 1);
		getProps = (getProps.indexOf('#') !== -1) ? getProps.substring(0,getProps.indexOf('#')) : getProps;
		var appendUrl = destination.substring(0,destination.indexOf('?'));
		appendUrl = (appendUrl.indexOf('/') === 0) ? appendUrl.substring(1) : appendUrl;
		appendUrl = (appendUrl.indexOf('.php') === (appendUrl.length - 4)) ? appendUrl.substring(0,(appendUrl.length - 4)) : appendUrl;
		data = getProps + '&' + 'page=' + appendUrl; }
	return data; }