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

  function load(src, callback) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = callback;
    document.body.appendChild(script);
  }

  const require = function(moduleIds = [], callback) {
    const modules = [];
    const len = moduleIds.length;
    let count = 0;

    const handleLoaded = function(id, index) {
      // 保存模块并记录数量
      modules[index] = INSTALLED_MODULES[id].exports;
      count++;

      if (count === len) {
        // 已加载完所有模块,执行回调
        typeof callback === 'function' && callback(...modules);
      }
    };

    for (let i = 0; i < len; i++) {
      const moduleId = moduleIds[i];
      const module = INSTALLED_MODULES[moduleId];

      if (module) {
        if (module.loaded) {
          handleLoaded(moduleId, i);
          continue;
        }
      } else {
        // 初始化模块并请求
        INSTALLED_MODULES[moduleId] = {
          exports: {},
          loaded: false
        };

        load(config.paths[moduleId]);
      }

      // 订阅模块加载完毕事件
      channel.subscripe(moduleId, () => {
        handleLoaded(moduleId, i);
      });
    }
  };

  require.config = function(conf) {
    Object.assign(config, conf);
  };

  const define = function(moduleId, depends, factory) {
    if (typeof depends === 'function') {
      INSTALLED_MODULES[moduleId].exports = depends();
      INSTALLED_MODULES[moduleId].loaded = true;
      channel.publish(moduleId);
    } else {
      require(depends, function(...modules) {
        INSTALLED_MODULES[moduleId].exports = factory(...modules);
        INSTALLED_MODULES[moduleId].loaded = true;
        channel.publish(moduleId);
      });
    }
  };

  window.require = require;
  window.define = define;

  load(document.querySelector('script[data-main]').dataset.main);
})();
