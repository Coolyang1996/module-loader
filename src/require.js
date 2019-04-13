/**
 * load模块加载完,会调用define,
 * define模块定义完通过事件通知
 * require 监听module length到了, 就执行回调
 */

(function() {
  let config = {};
  const INSTALLED_MODULES = {};

  function load(src, func) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = func;
    document.body.appendChild(script);
  }

  const require = function(moduleIds = [], func) {
    const modules = [];
    const len = moduleIds.length;

    for (const id of moduleIds) {
      if (INSTALLED_MODULES[id]) {
        if (INSTALLED_MODULES[id].export) {
          modules.push(INSTALLED_MODULES[id].export);
          continue;
        }
      }

      INSTALLED_MODULES[id] = {
        export: {},
        loaded: false
      };
      const path = config.paths[id];

      load(path, () => {
        modules.push(INSTALLED_MODULES[id].export);
        if (modules.length === len) {
          typeof func === 'function' && func(...modules);
        }
      });
    }

    if (modules.length === len) {
      typeof func === 'function' && func(...modules);
    }
  };

  require.config = function(obj) {
    config = Object.assign({}, config, obj);
  };

  const define = function(id, depends, factory) {
    require(depends, function(...args) {
      INSTALLED_MODULES[id].export = factory(...args);
    });
  };

  window.require = require;
  window.define = define;

  load(document.querySelector('script[data-main]').dataset.main);
})();
