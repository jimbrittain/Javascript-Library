# Javascript findForm function
Attempts to find the form element parent of an element.
## Usage
```
    findForm(HTMLElement) = HTMLFormElement || null;
```

## Methods

1. `elem.form`
2. `$.closest` if Jquery in window
3. Recursive parent is a form
## Issues

* Should use findParent rather than adhoc, less reliable method
* If supplied element is HTMLFormElement ignores as checks parents
* Needs proper testing log, e.g. browser checks
* NS version uses IMNS, not currently using ES6 namespacing
