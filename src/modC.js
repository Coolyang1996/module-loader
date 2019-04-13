define('modC', ['modB'], function(modB) {
  /**
   * TODO:
   * modB可能在modA那边先加载,
   * 此时require里会直接把modB.export传入回调
   * 但是script标签可能还没加载完, 因此mobB是undefined
   * 于是会报错
   */

  console.log('C');

  modB.greet('modC');

  return {
    greet(name) {
      console.log(`${name} call modC`);
    }
  };
});
