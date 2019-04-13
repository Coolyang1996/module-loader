define('modA', ['modB', 'modC'], function(modB, modC) {
  console.log('A');

  modB.greet('modA');
  modC.greet('modA');
});
