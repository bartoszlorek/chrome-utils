# chrome-utils

## message
Sends a single message to event listeners. Method `toBack` operates on background page, options, popup or other extension. Moreover, `toTab` communicates with content scripts injected in tabs.

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
