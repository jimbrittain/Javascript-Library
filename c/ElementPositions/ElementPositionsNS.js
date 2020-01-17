"use strict";
/*jshint -W069 */
/*global __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ElementPositions' in adr)){
    

    adr.ElementPositions = function(){
        var cc = __imns('component.classes');
        if(cc.ElementPositions.prototype.singleton !== undefined){ return cc.ElementPositions.prototype.singleton; }
        cc.ElementPositions.prototype.singleton = this;
        this.elem_names = [];
        this.coords = [];
        this.default_coords = []; };
    adr.ElementPositions.prototype.add = function(s){
        var uc = __imns('util.classes'),
            ut = __imns('util.tools'),
            uv = __imns('util.validation');
        var added = false, found = -1;
        if(this.findId(s) === -1){
            if(typeof s === 'string'){
                this.elem_names.push(s);
                this.default_coords.push(new uc.Coordinates(0,0));
                added = true;
            } else if(s !== undefined && uv.isHTMLElement(s)){
                var id = ut.getAttribute(s, 'id');
                if(id !== ""){
                    this.elem_names.push(id);
                    this.default_coords.push(new uc.Coordinates(0,0));
                    added = true; }}
            return added;
        } else { return false; }};
    adr.ElementPositions.prototype.addElement = adr.ElementPositions.prototype.add;
    adr.ElementPositions.prototype.findId = function(s){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var found = -1, i=0, imax=0;
        if(typeof s === 'string'){
            for(i=0, imax = this.elem_names.length; i<imax; i+=1){
                if(s === this.elem_names[i]){ found = i; break; }}
        } else if(s !== undefined && uv.isHTMLElement(s)){
            for(i=0, imax = this.elem_names.length; i<imax; i+=1){
                if(s === ud.findElementByID(this.elem_names[i])){ found = i; break; }}
        } else if(typeof s === 'number' && Math.round(s) === s && s > -1){
            found = (s < this.elem_names.length && this.elem_names[s] !== undefined) ? s : -1; }
        return found; };
    adr.ElementPositions.prototype.remove = function(s){
        var p = this.findId(s);
        if(p !== -1){
            this.elem_names.splice(p,1);
            this.coords.splice(p,1);
            this.default_coords.splice(p,1);
            return true; }};
    adr.ElementPositions.prototype.setDefaultCoordinates = function(s, coords){
        var uc = __imns('util.classes');
        var p = this.findId(s);
        if(p !== -1){
            if(coords !== undefined){
                coords = (!(coords instanceof uc.Coordinates)) ? new uc.Coordinates(coords) : coords;
                this.default_coords[p] = coords;
                return true; }}
        return false; };
    adr.ElementPositions.prototype.establish = function(s){
        var uc = __imns('util.classes');
        var coords, p;
        if(s === undefined){
            for(var i=0,imax=this.elem_names.length;i<imax; i+=1){
                coords = (this.coords[i] !== undefined) ? this.coords[i] : this.default_coords[i];
                coords = (coords instanceof uc.Coordinates) ? coords : new uc.Coordinates(0,0);
                this.setPosition(this.elem_names[i], coords); }
            return true;
        } else {
            p = this.findId(s);
            if(p !== -1){
                coords = (this.coords[p] !== undefined) ? this.coords[p] : this.default_coords[p];
                coords = (coords instanceof uc.Coordinates) ? coords : new uc.Coordinates(0,0);
                this.setPosition(s, coords);
                return true; } else { return false; }}};
    adr.ElementPositions.prototype.reset = function(s, b){
        var ud = __imns('util.dom'),
            uc = __imns('util.classes'),
            uv = __imns('util.validation');
        b = (b === undefined || !b) ? false : true;
        var coords, i, imax, e, p;
        if(s === undefined){
            for(i=0,imax=this.elem_names.length; i<imax; i+=1){
                e = ud.findElementByID(this.elem_names[i]);
                if(e !== undefined && uv.isHTMLElement(e)){
                    coords = (this.default_coords[i] !== undefined && this.default_coords[i] instanceof uc.Coordinates) ? this.default_coords[i] : new uc.Coordinates(0,0);
                    this.setPosition(this.elem_names[i], coords); }}
            if(b){ this.clear(); }
            return true;
        } else {
            p = this.findId(s);
            if(p !== -1){
                coords = (this.default_coords[p] !== undefined && this.default_coords[p] instanceof uc.Coordinates) ? this.default_coords[p] : new uc.Coordinates(0,0);
                this.setPosition(s, coords);
                if(b){ this.clear(s); }
                return true; }}};
    adr.ElementPositions.prototype.resetWithClear = function(s){ this.reset(s, true); };
    adr.ElementPositions.prototype.clear = function(s){
        if(s === undefined){
            for(var i=0,imax=this.elem_names.length; i<imax; i+=1){
                this.clearIndividual(this.elem_names[i]); }
            return true;
        } else { 
            return (this.findId(s) !== -1) ? this.clearIndividual(s) : false; }};
    adr.ElementPositions.prototype.clearIndividual = function(s){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var p = this.findId(s), e;
        if(p !== -1){
            e = ud.findElementByID(this.elem_names[p]);
            if(e !== undefined && uv.isHTMLElement(e)){
                e.style['left'] = '';
                e.style['top'] = '';
                return true; }}
        return false; };
    adr.ElementPositions.prototype.setPosition = function(s, coords, move){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom');
        move = (move === undefined || move) ? true : false;
        coords = (coords instanceof uc.Coordinates) ? coords : new uc.Coordinates(coords);
        var p = this.findId(s);
        var e = (p !== -1) ? ud.findElementByID(this.elem_names[p]) : undefined;
        if(e !== undefined && uv.isHTMLElement(e)){
            e.style['left'] = coords.x;
            e.style['top'] = coords.y;
            this.getPosition(s);
            this.remember();
            return true; }
        return false; };
    adr.ElementPositions.prototype.getPosition = function(s){
        var uc = __imns('util.classes');
        var c, p;
        if(s === undefined){
            for(var i=0,imax = this.elem_names.length; i<imax; i+=1){
                c = this.getCurrentCoordinates(this.elem_names[i]);
                if(c instanceof uc.Coordinates){ this.coords[i] = c; }}
            return true;
        } else {
            c = this.getCurrentCoordinates(s);
            if(c instanceof uc.Coordinates){
                p = this.findId(s);
                this.coords[p] = c;
                return true;
            } else { return false; }}};
    adr.ElementPositions.prototype.getCurrentCoordinates = function(s){
        var uv = __imns('util.validation'),
            uc = __imns('util.classes'),
            ud = __imns('util.dom');
        var p = this.findId(s);
        var e = (p !== -1) ? ud.findElementByID(this.elem_names[p]) : undefined;
        if(e !== undefined && uv.isHTMLElement(e)){
            return new uc.Coordinates(parseInt(ud.findElementStyle(e, 'left')), parseInt(ud.findElementStyle(e, 'top'))); }
        return null; };
    adr.ElementPositions.prototype.recall = function(boo){
        var uc = __imns('util.classes');
        boo = (boo === undefined || boo) ? true : false;
        var d = new uc.CookieInterface(), a, b, c, co = [];
        if(d.hasItem('positions')){
            a = (d.findItem('positions').value).split(';');
            for(var i=0,imax=a.length; i<imax; i+=1){
                b = a[i].split(':');
                if(b.length === 2 && !isNaN(Number(b[0])) && !isNaN(Number(b[1])) && b[0] >= 0 && b[1] >= 0){
                    c = new uc.Coordinates(b[0], b[1]);
                    co.push(c); } else { co.push(new uc.Coordinates(0,0)); }}
            for(var n=0,nmax=co.length; n<nmax; n+=1){ this.setPosition(n, co[n], boo); }}
        return false; };
    adr.ElementPositions.prototype.recallWithSet = function(){ this.recall(true); };
    adr.ElementPositions.prototype.remember = function(){
        var uc = __imns('util.classes');
        var str = '', d = new uc.CookieInterface();
        for(var i=0, imax=this.coords.length; i<imax; i+=1){
            str += this.coords[i].x + ':' + this.coords[i].y + ';'; }
        str = (imax > 0) ? str.substr(0, str.length - 1) : str;
        d.setItem(new uc.CookieObject({
            'name' : 'positions', 
            'value' : str, 
            'expires' : new Date().getTime() + (60 * 60 * 24 * 28)})); };


}
