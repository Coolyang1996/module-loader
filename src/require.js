(function() {
  class Channel {
    constructor() {
      this.events = {};
    }

    subscripe(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }

      this.events[eventName].push(callback);
    }

    publish(eventName, message) {
      this.events[eventName].forEach(callback => {
        callback(message);
      });
    }
  }

  const INSTALLED_MODULES = {};
  const channel = new Channel();
  const config = {};

  function load(src, func) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = func;
    document.body.appendChild(script);
  }

  const require = function(moduleIds = [], func) {
    const modules = [];
    const len = moduleIds.length;

    for (const moduleId of moduleIds) {
      // 模块已初始化
      if (INSTALLED_MODULES[moduleId]) {
        // 模块已加载完毕
        if (INSTALLED_MODULES[moduleId].loaded) {
          modules.push(INSTALLED_MODULES[moduleId].exports);
          continue;
        }
      } else {
        // 模块初始化
        const path = config.paths[moduleId];
        INSTALLED_MODULES[moduleId] = {
          exports: {},
          loaded: false
        };
        load(path);
      }

      // 订阅模块加载完毕事件
      channel.subscripe(moduleId, exports => {
        modules.push(exports);
        if (modules.length === len) {
          typeof func === 'function' && func(...modules);
        }
      });
    }

    if (modules.length === len) {
      typeof func === 'function' && func(...modules);
    }
  };

  require.config = function(conf) {
    Object.assign(config, conf);
  };

  const define = function(moduleId, depends, factory) {
    if (typeof depends === 'function') {
      const exports = depends();
      INSTALLED_MODULES[moduleId].exports = exports;
      INSTALLED_MODULES[moduleId].loaded = true;
      channel.publish(moduleId, exports);
    } else {
      require(depends, function(...modules) {
        const exports = factory(...modules);
        INSTALLED_MODULES[moduleId].exports = exports;
        INSTALLED_MODULES[moduleId].loaded = true;
        channel.publish(moduleId, exports);
      });
    }
  };

  window.require = require;
  window.define = define;

  load(document.querySelector('script[data-main]').dataset.main);
})();
