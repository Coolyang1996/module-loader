define('modB', function() {
  console.log('B');

  return {
    greet(name) {
      console.log(`${name} call modB`);
    }
  };
});
