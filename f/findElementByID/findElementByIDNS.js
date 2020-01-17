"use strict";
/* global __imns, document */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findElementByID' in adr)){
    /**
     * @module findElementByID
     * @author Immature Dawn
     * @copyright JDB 2015-2016
     * @version 0.3
     * @update, adds findElementById as alias;
     * @date 20151213
     * @param {String} _id
     * @return {HTMLElement}
     */
    adr.findElementByID = function(_id){
        var ud = __imns('util.dom'),
            udb = __imns('util.debug');
        if(typeof _id === 'string'){
            if(ud.findElementByID.prototype.choice !== undefined){
                return ud.findElementByID.prototype.choice(_id);
            } else {
                ud.findElementByID.prototype.doChoice();
                return ud.findElementByID.prototype.choice(_id);
            }
        } else {
            (new udb.IMDebugger()).pass("findElementByID must be supplied a string");
            return undefined; }};
    adr.findElementByID.prototype.doChoice = function(){
        var ud = __imns('util.dom');
        if('getElementById' in document){
            ud.findElementByID.prototype.choice = ud.findElementByID.prototype.ge_fun;
        } else if(document.all){
            ud.findElementByID.prototype.choice = ud.findElementByID.prototype.da_fun;
        } else if(document.layers){
            ud.findElementByID.prototype.choice = ud.findElementByID.prototype.dl_fun;
        } else {
            ud.findElementByID.prototype.choice = function(){ return undefined; }; 
        }};
    adr.findElementByID.prototype.ge_fun = function(_id){ return document.getElementById(_id);};
    adr.findElementByID.prototype.da_fun = function(_id){ return document.all[_id]; };
    adr.findElementByID.prototype.dl_fun = function(_id){ return document.layers[_id]; };
    adr.findElementById = adr.findElementByID;


}
