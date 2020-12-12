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

  fn(resolve.bind(this), reject.bind(this));

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

var v = new Vow((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
    // reject(2222);
  }, 1001);
});

v.then((res) => {
  console.log("v then >", res);
  return "vaaaaa";
})
  .then((res) => {
    console.log("v chain then >", res);
    new Promise((resolve) => {
      resolve("v in resolve");
    })
      .then((res) => {
        console.log("v in resolve then", res);
        return "vvvv in";
      })
      .then((res) => {
        console.log("v in resolve then22", res);
      });
  })
  .then((res) => {
    console.log("v chain2 then >", res);
  })
  .then((res) => {
    console.log("v chain3 then >", res);
  });

v.then((res) => {
  console.log("v then2 >", res);
});

var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
    // reject(2222);
  }, 1000);
});

// ######################################################################################################

p.then((res) => {
  console.warn("p then >", res);
  return "aaaa";
})
  .then((res) => {
    console.warn("p chain then >", res);
    new Promise((resolve) => {
      resolve("p in resolve");
    })
      .then((res) => {
        console.warn("p in resolve then", res);
        return "ppp in";
      })
      .then((res) => {
        console.warn("p in resolve then22", res);
      });
  })
  .then((res) => {
    console.warn("p chain2 then >", res);
  })
  .then((res) => {
    console.warn("p chain3 then >", res);
  });

p.then((res) => {
  console.warn("p then2 >", res);
});
