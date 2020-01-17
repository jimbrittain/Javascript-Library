# Javascript isElementAnOnlyChild function
isElementAnOnlyChild attempts to determine if a supplied HTMLElement is an only-child of its parent.
## Usage
```
    isElementAnOnlyChild(onlyChild) === true;
    isElementAnOnlyChild(secondChild) === false;
```

## Methods

1. Finds parent, 
2. Checks for number of children
3. If greater than 1, checks if the children are not empty/white-space text nodes, 
4. returns `true || false`

## Issues

* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
