// Generated by CoffeeScript 1.7.1
(function() {
  var Module, arg, error, globalPaths, nodeIntegration, path, pathname, preloadScript, process, url, _i, _len, _ref, _ref1;

  process = global.process;

  path = require('path');

  url = require('url');

  Module = require('module');

  process.type = 'renderer';

  process.resourcesPath = path.resolve(process.argv[1], '..', '..', '..', '..');

  process.argv.splice(1, 1);

  globalPaths = Module.globalPaths;

  globalPaths.push(path.join(process.resourcesPath, 'atom', 'renderer', 'api', 'lib'));

  globalPaths.push(path.join(process.resourcesPath, 'app'));

  require(path.resolve(__dirname, '..', '..', 'common', 'lib', 'init.js'));

  nodeIntegration = 'false';

  _ref = process.argv;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    arg = _ref[_i];
    if (arg.indexOf('--guest-instance-id=') === 0) {
      process.guestInstanceId = parseInt(arg.substr(arg.indexOf('=') + 1));
      require('web-frame').setName('ATOM_SHELL_GUEST_WEB_VIEW');
    } else if (arg.indexOf('--node-integration=') === 0) {
      nodeIntegration = arg.substr(arg.indexOf('=') + 1);
    } else if (arg.indexOf('--preload=') === 0) {
      preloadScript = arg.substr(arg.indexOf('=') + 1);
    }
  }

  if (location.protocol === 'chrome-devtools:') {
    require(path.join(__dirname, 'inspector'));
    nodeIntegration = 'true';
  } else if (location.protocol === 'chrome-extension:') {
    require(path.join(__dirname, 'chrome-api'));
    nodeIntegration = 'true';
  } else {
    require(path.join(__dirname, 'override'));
    if (process.guestInstanceId == null) {
      require(path.join(__dirname, 'web-view'));
    }
  }

  if (nodeIntegration === 'true' || nodeIntegration === 'all' || nodeIntegration === 'except-iframe' || nodeIntegration === 'manual-enable-iframe') {
    global.require = require;
    global.module = module;
    if ((_ref1 = window.location.protocol) === 'file:' || _ref1 === 'asar:') {
      pathname = process.platform === 'win32' && window.location.pathname[0] === '/' ? window.location.pathname.substr(1) : window.location.pathname;
      global.__filename = path.normalize(decodeURIComponent(pathname));
      global.__dirname = path.dirname(global.__filename);
      module.filename = global.__filename;
      module.paths = module.paths.concat(Module._nodeModulePaths(global.__dirname));
    } else {
      global.__filename = __filename;
      global.__dirname = __dirname;
    }
    window.onerror = function(error) {
      if (global.process.listeners('uncaughtException').length > 0) {
        global.process.emit('uncaughtException', error);
        return true;
      } else {
        return false;
      }
    };
    window.addEventListener('unload', function() {
      return process.emit('exit');
    });
  } else {
    process.once('BIND_DONE', function() {
      delete global.process;
      delete global.setImmediate;
      return delete global.clearImmediate;
    });
  }

  if (preloadScript) {
    try {
      require(preloadScript);
    } catch (_error) {
      error = _error;
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
      }
      console.error("Unable to load preload script " + preloadScript);
    }
  }

}).call(this);
