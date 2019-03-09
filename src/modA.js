define('modA', ['modB', 'modC'], function(modB, modC) {
  console.log('this is modA');
  modB.greet('modA');

  modC.greet();
});
