var arr = [0, "string", [], new Object(), false, true, undefined, -1], aHTML = false;
var __imns = function(){ return window; };
try {
	aHTML = document.createElement("div");
} catch(e) { throw new Error("Unable to run test"); }

describe("isHTMLElement", function(){
	for(var i = 0, max=arr.length; i < max; i += 1){
		var a = arr[i];
		it("Expect " + arr[i] + " to be false === ", function(){
			//var a = arr[i];
			expect(isHTMLElement(a)).toBe(false); }); }
	it("Expect a HTMLElement to be true ===", function(){ expect(isHTMLElement(aHTML)).toBe(true); }); });
