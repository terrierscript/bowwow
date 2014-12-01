// Generated by CoffeeScript 1.7.1
(function() {
  var WEB_VIEW_EVENTS, dispatchEvent, ipc, requestId,
    __slice = [].slice;

  ipc = require('ipc');

  requestId = 0;

  WEB_VIEW_EVENTS = {
    'did-finish-load': [],
    'did-fail-load': ['errorCode', 'errorDescription'],
    'did-frame-finish-load': ['isMainFrame'],
    'did-start-loading': [],
    'did-stop-loading': [],
    'did-get-redirect-request': ['oldUrl', 'newUrl', 'isMainFrame'],
    'console-message': ['level', 'message', 'line', 'sourceId'],
    'new-window': ['url', 'frameName', 'disposition'],
    'close': [],
    'crashed': [],
    'destroyed': []
  };

  dispatchEvent = function() {
    var args, domEvent, event, f, i, webView, _i, _len, _ref;
    webView = arguments[0], event = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (WEB_VIEW_EVENTS[event] == null) {
      throw new Error("Unkown event " + event);
    }
    domEvent = new Event(event);
    _ref = WEB_VIEW_EVENTS[event];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      f = _ref[i];
      domEvent[f] = args[i];
    }
    return webView.dispatchEvent(domEvent);
  };

  module.exports = {
    registerEvents: function(webView, viewInstanceId) {
      ipc.on("ATOM_SHELL_GUEST_VIEW_INTERNAL_DISPATCH_EVENT-" + viewInstanceId, function() {
        var args, event;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return dispatchEvent.apply(null, [webView, event].concat(__slice.call(args)));
      });
      return ipc.on('ATOM_SHELL_GUEST_VIEW_INTERNAL_SIZE_CHANGED', function() {
        var args, domEvent, f, i, _i, _len, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        domEvent = new Event('size-changed');
        _ref = ['oldWidth', 'oldHeight', 'newWidth', 'newHeight'];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          f = _ref[i];
          domEvent[f] = args[i];
        }
        return webView.onSizeChanged(domEvent);
      });
    },
    createGuest: function(type, params, callback) {
      requestId++;
      ipc.send('ATOM_SHELL_GUEST_VIEW_MANAGER_CREATE_GUEST', type, params, requestId);
      return ipc.on("ATOM_SHELL_RESPONSE_" + requestId, callback);
    },
    destroyGuest: function(guestInstanceId) {
      return ipc.send('ATOM_SHELL_GUEST_VIEW_MANAGER_DESTROY_GUEST', guestInstanceId);
    },
    setAutoSize: function(guestInstanceId, params) {
      return ipc.send('ATOM_SHELL_GUEST_VIEW_MANAGER_SET_AUTO_SIZE', guestInstanceId, params);
    },
    setAllowTransparency: function(guestInstanceId, allowtransparency) {
      return ipc.send('ATOM_SHELL_GUEST_VIEW_MANAGER_SET_ALLOW_TRANSPARENCY', guestInstanceId, allowtransparency);
    }
  };

}).call(this);
