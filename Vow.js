function Vow(fn) {
  var queue = [];

  var execute = function () {
    while (queue.length > 0) {
      var q = queue.shift();
      if (arguments[0] === "resolve") {
        var nextData = q.fullfield.apply(null, arguments[1]);
        (function (pNextQ, pNextData) {
          queueMicrotask(() => {
            pNextQ.nextResolve(pNextData);
          });
        })(q, nextData);
      } else {
        throw arguments[1];
      }
    }
  };

  var resolve = function () {
    execute("resolve", arguments);
  };

  var reject = function () {
    execute("reject", arguments[0]);
  };

  fn(resolve, reject);

  this.then = function (fullfield) {
    const data = {
      fullfield,
      nextResolve: undefined,
    };
    var nextVow = new Vow(function (resolve) {
      data.nextResolve = resolve;
    });

    queue.push(data);

    return nextVow;
  };

  this.catch = function (rejected) {
    queue.push(rejected);
    return this;
  };
}

export default Vow;
