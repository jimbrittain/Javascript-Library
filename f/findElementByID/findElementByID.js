"use strict";
/*global document, console, IMDebugger */
/**
 * @module findElementByID
 * @author Immature Dawn
 * @copyright JDB 2015
 * @version 0.3
 * @date 20151213
 * @param {String} _id
 * @return {HTMLElement}
 */
function findElementByID(_id){
    if(typeof _id === 'string'){
        if(findElementByID.prototype.choice !== undefined){
            return findElementByID.prototype.choice(_id);
        } else {
            findElementByID.prototype.doChoice();
            return findElementByID.prototype.choice(_id);
        }
    } else {
        (new IMDebugger()).pass("findElementByID must be supplied a string");
        return undefined; }}
findElementByID.prototype.doChoice = function(){
    if('getElementById' in document){
        findElementByID.prototype.choice = findElementByID.prototype.ge_fun;
    } else if(document.all){
        findElementByID.prototype.choice = findElementByID.prototype.da_fun;
    } else if(document.layers){
        findElementByID.prototype.choice = findElementByID.prototype.dl_fun;
    } else {
        findElementByID.prototype.choice = function(){ return undefined; }; 
    }};
findElementByID.prototype.ge_fun = function(_id){ return document.getElementById(_id);};
findElementByID.prototype.da_fun = function(_id){ return document.all[_id]; };
findElementByID.prototype.dl_fun = function(_id){ return document.layers[_id]; };
