define('modB', [], function() {
  console.log('this is modB');

  return {
    greet(name) {
      console.log(`modB: hello ${name}`);
    }
  };
});
