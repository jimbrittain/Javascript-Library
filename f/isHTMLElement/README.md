# Javascript isHTMLElement function
isHTMLElement attempts to determine if a supplied parameter is a HTMLElement.
## Usage
```
var o = [];
    isHTMLElement(o) === false;
    o = document.createElement('div');
    isHTMLElement(o) === true
```

## Methodology

1. `o instanceof HTMLElement`
2. `o.nodeType === 1`
3. `o.tagName !== null`
4. `'canHaveHTML' in o`

## Issues

* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
