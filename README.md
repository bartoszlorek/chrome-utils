# chrome-utils

## message
Method `toBack()` sends a single message to event listeners on background, options or popup page (also other extensions) and `toTab()` communicates with content scripts injected in tabs.

```javascript
.on(type, callback)
.toBack(request, callback)
.toTab(id, request, callback)
.toTab.current(request, callback)
.toTab.all(request, callback)
```

```javascript
request = {
  type: string,
  data: any
}
```

## get-current-tab
```javascript
getCurrentTab().then(tab => {})
```

Returns `Promise` with current [Tab](https://developer.chrome.com/extensions/tabs#type-Tab) object as an `argument`. This method can be called from any place of extension: background or options page, tabs, etc.
