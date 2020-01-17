# Javascript isChildOf function
isChildOf attempts to determine if element (1st param) is child of element (2nd param).
## Usage
```
    isChildOf(childElement, parentElement) = true || false
```

## Methodology

```
function isChildOf(child, parent){
    if(child !== undefined && isHTMLElement(child) && parent !== undefined && isHTMLElement(parent)){
        var p = findParent(child);
        while(p !== undefined){
            if(p === parent){
                return true;
            } else { p = findParent(p); }}}
    return false; }
```

## Issues

* Need to update Jasmine to include none-element testing, though should be unnecessary due to isHTMLElement inclusion, completeness/self-containing would be nice.
* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
