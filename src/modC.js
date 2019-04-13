define('modC', ['modB'], function(modB) {
  console.log('C');

  modB.greet('modC');

  return {
    greet(name) {
      console.log(`${name} call modC`);
    }
  };
});
