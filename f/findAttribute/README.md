# findAttribute
Javascript cross-browser functionality for finding, setting, removing and attribute discovery.

## Requires

* isHTMLElement

## Methods

### __imns('util.dom').hasAttribute

```
    __imns('util.dom').hasAttribute(elem, 'style');
```

Returns Boolean. Works on finding null or undefined

### __imns('util.dom').setAttribute

```
    __imns('util.dom').setAttribute(elem, attr, 'value');
```

Returns Boolean

### __imns('util.dom').getAttribute

```
    __imns('util.dom').getAttribute(elem, attr);
```

### __imns('util.dom').removeAttribute

```
    __imns('util.dom').removeAttribute(elem, attr);
```

## Issues

* Needs proper cross-browser testing documentation
* Concern over hasAttribute returning null === false, cross-browser implications?
