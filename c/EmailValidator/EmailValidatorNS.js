"use strict";
/* global __imns */
/* Email Validation Code :: JDB 2008-2011, Owen Hildyard-Todd 2008. Requires isNumber */
var uv = __imns('util.validation');
// var uv = window; //for stand-alone delete above and uncomment this line
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('EmailValidator' in adr)){


    adr.EmailValidator = function(){
        var uc = __imns('util.classes');
        if(uc.EmailValidator.prototype.singleton !== undefined){ return uc.EmailValidator.prototype.singleton; }
        uc.EmailValidator.prototype.singleton = this; };
    adr.EmailValidator.prototype.localStringCheck = function(str){
        var good = false, re=/ /;
        if(typeof str === 'string'){ //checks local for allowed characters;
            if(str.charAt(0) !== '.' && str.charAt(str.length - 1) !== '.'){
                if(str.indexOf('..') !== true){ good = true; }}}
        if(good){
            re = /^[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~\.]?[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~\.]*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~\.]$/; //';
            if(re.test(str) === false){//reg expression check on str
                return false;
            } else { return true; }
        } else { return false; }};
    adr.EmailValidator.prototype.ipAddressFormatCheck = function(str){ //check if domian is IP Address
        var uv = __imns('util.validation');
        //Build in IPv6 check here, either 3 periods or 0; IPv6 colon check 0 or 2-6 or 2-7; IPv6 hexidecimal check and for null statements
        var addressRecords = str.split('.'), validIPPortion = 1, i=0, imax=0;
        if(addressRecords.length !== 4){
            return false;
        } else {
            validIPPortion = 1;
            for(i=0, imax = addressRecords.length; i < imax; i+=1){
                var onar = addressRecords[i];
                if(uv.isNumber(onar) && Math.round(onar) !== onar){
                    if(onar > -1 && onar < 256){ //check that numbers are in the correct range;
                        continue;
                    } else { return false; }
                } else { return false; }}}
        return true; };
    adr.EmailValidator.prototype.checkEmailLocalPart = function(str){
        // If periodSections play a part, and an email address can be greater than 64 characters, e.g. each label can be sixty-four characters then apply the period length check;
        var quoteNumber = [];
        if(typeof str === 'string'){
            if(str.length <= 64){
                if(str.indexOf('"') === -1){  //checks if any quotes
                    return this.localStringCheck(str);
                } else {
                    quoteNumber = str.split('"'); 
                    if(quoteNumber.length === 3){ //checks if exactly two quotes
                        if(str.charAt(0) === '"' && str.charAt(str.length - 1) === '"'){ // If string length <=64 check if exactly 2 quotes & starts with quotes
                            return true; }}}}}
        return false; };
    adr.EmailValidator.prototype.checkEmailDomainPart = function(str){
        var colonSections = [], periodSections = [];
        if(typeof str === 'string'){
            if(str.charAt(0) === '[' && str.charAt(str.length - 1) === ']'){ //check for initial and end IP Address Bracket
                colonSections = str.split(':');
                periodSections = str.split('.');
                var cl = colonSections.length, pl = periodSections.length;
                if(cl > 2 && pl === 2){ // has required colons or greater, and no periods
                    return (cl > 8) ? false : this.ipNewRegExp(str); //check for more than allowed number of colons, if allowed number of colon sections = true, pass to IPv6 reg expression
                } else if((cl > 2 && pl === 4) || (cl === 1 && pl === 4)){ // at least 2 colons, and 3 periods IPv4/IPv6 Crossover
                    var ipOldStr = colonSections[cl - 1], ipPeriodSections = [];
                    ipOldStr = ipOldStr.slice(0,-1); // separates string while checking periods after colons;
                    ipPeriodSections = ipOldStr.split('.'); // (section after colon minus last letter which should be end bracket;
                    return (ipPeriodSections.length === 4) ? this.ipAddressFormatCheck(ipOldStr.slice(1)) : false; // confirms all period sections are after colons, period section check;
                } else { return false; } // Incorrect number of periods or colons within brackets
            } else { return this.domainRegExp(str); }}
        return false; };
    adr.EmailValidator.prototype.ipNewRegExp = function(str){
        if(typeof str === 'string'){
            var re = /^\[((\d|[a-fA-F]){0,4}\:)+((\d|[a-fA-F]){0,4}\])$/;
            return (re.test(str) === true) ? true : false; // Non-allowed char found or section too long
        } else { return false; }};
    adr.EmailValidator.prototype.domainRegExp = function(str){
        if(typeof str === 'string'){
            var re = /^\w+([\.-]?\w+)*\.+(\w{2,63})+$/i;
            return (re.test(str) === true) ? true : false;
        } else { return false; }};
    adr.EmailValidator.prototype.validate = function(theEmail){
        var str = theEmail;
        if(typeof str === 'string'){
            var numOfAts = str.split('@'); // should form two strings from either side of @ side but not include it
            if(numOfAts.length === 2){ // checks that string is split into only two parts i.e. only one @
                var localPart = numOfAts[0], domainPart = numOfAts[1];
                return (this.checkEmailLocalPart(localPart)) ? this.checkEmailDomainPart(domainPart) : false;
            } else if(numOfAts.length > 2){
                var numOfQuotes = str.split('"'); //for checking number of quote marks = 2;
                if(numOfQuotes.length === 3 && str.charAt(0) === '"'){
                    var re = /(\"\@(\w|\.|\-)+)$/;
                    if(re.test(str) === false){
                        return false;
                    } else {
                        var domainPart2 = numOfAts[numOfAts.length - 1]; //assigns domain part to string
                        return this.checkEmailDomainPart(domainPart2); }
                } else { return false; }
            } else { return false; }
        } else { return false; }};

    uv.validatePassedEmail = function(theEmail){ 
        var uc = __imns('util.classes');
        return (new uc.EmailValidator()).validate(theEmail); };


}
