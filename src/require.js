(function() {
  const INSTALLED_MODULES = {};

  function load(src, func) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = func;
    document.body.appendChild(script);
  }

  window.require = function(moduleNames, func) {
    let modules = [];
    for (const name of moduleNames) {
      if (INSTALLED_MODULES[name]) {
        modules.push(INSTALLED_MODULES[name]);
      } else {
        load(require.config.path[name], function() {
          modules.push(INSTALLED_MODULES[name]);
          if (modules.length === moduleNames.length) {
            typeof func === 'function' && func.apply(null, modules);
          }
        });
      }
    }
    if (modules.length === moduleNames.length) {
      typeof func === 'function' && func.apply(null, modules);
    }
  };

  window.define = function(name, depends, factory) {
    require(depends, function(...args) {
      let module = factory(...args);
      INSTALLED_MODULES[name] = module;
    });
  };

  load(document.querySelector('script[data-main]').dataset.main);
})();
