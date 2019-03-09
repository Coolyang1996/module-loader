(function() {
  require.config = {
    path: {
      modA: './modA.js',
      modB: './modB.js',
      modC: './modc.js'
    }
  };
  console.log('hello main');

  require(['modA']);
})();
