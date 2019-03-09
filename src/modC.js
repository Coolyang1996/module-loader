define('modC', ['modB'], function(modB) {
  console.log('this is modC');

  modB.greet('modC');

  return {
    greet: function() {
      console.log('a greet from modC');
    }
  };
});
