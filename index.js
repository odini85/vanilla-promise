import Vow from "./Vow.js";

setTimeout(function () {
  console.log("Promise getData");
  var getData = function () {
    return new Promise(function (resolve, reject) {
      console.log("Promise START");

      setTimeout(function () {
        console.log("Promise setTimeout");

        let response = "data";

        if (response) {
          console.log("Promise resolve START");
          resolve(response);
          console.log("Promise resolve END");
        }

        reject(new Error("Request is failed"));
      });

      console.log("Promise END");
    });
  };

  console.log("Promise then OUT START");
  getData()
    .then(function (data) {
      console.log("Promise then START");
      console.log(data); // response 값 출력
      console.log("Promise then END");
    })
    .catch(function (err) {
      console.error(err); // Error 출력
    });
  console.log("Promise then OUT END");
}, 0);

setTimeout(function () {
  console.log("------------------------------------------");
}, 500);

setTimeout(function () {
  console.log("Vow getData");
  var getData = function () {
    return new Vow(function (resolve, reject) {
      console.log("Vow START");

      setTimeout(function () {
        console.log("Vow setTimeout");

        let response = "data";

        if (response) {
          console.log("Vow resolve START");
          resolve(response);
          console.log("Vow resolve END");
        }

        reject(new Error("Request is failed"));
      });

      console.log("Vow END");
    });
  };

  console.log("Vow then OUT START");
  getData()
    .then(function (data) {
      console.log("Vow then START");
      console.log(data); // response 값 출력
      console.log("Vow then END");
    })
    .catch(function (err) {
      console.error(err); // Error 출력
    });
  console.log("Vow then OUT END");
}, 1000);

setTimeout(function () {
  console.log("==========================================");
}, 1500);

var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
    // reject(2222);
  }, 2000);
});

p.then((res) => {
  console.log("p then >", res);
  return "aaaa";
})
  .then((res) => {
    console.log("p chain then >", res);
    window.p2 = new Promise((resolve) => {
      resolve("p in resolve");
    })
      .then((res) => {
        console.log("p in resolve then", res);
        return "ppp in";
      })
      .then((res) => {
        console.log("p in resolve then22", res);
        return "????";
      });

    return ">>>>>";
  })
  .then((res) => {
    console.log("p chain2 then >", res);
    return ">>>>> chain 222222";
  })
  .then((res) => {
    console.log("p chain3 then >", res);
  });

p.then((res) => {
  console.log("p then2 >", res);
});

setTimeout(function () {
  console.log("------------------------------------------");
}, 2500);

var v = new Vow((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
    // reject(2222);
  }, 3000);
});

v.then((res) => {
  console.log("v then >", res);
  return "vaaaaa";
})
  .then((res) => {
    console.log("v chain then >", res);
    window.v2 = new Vow((resolve) => {
      resolve("v in resolve");
    })
      .then((res) => {
        console.log("v in resolve then", res);
        return "vvvv in";
      })
      .then((res) => {
        console.log("v in resolve then22", res);
        return "????";
      });

    return ">>>>>";
  })
  .then((res) => {
    console.log("v chain2 then >", res);
    return ">>>>> chain 222222";
  })
  .then((res) => {
    console.log("v chain3 then >", res);
  });

v.then((res) => {
  console.log("v then2 >", res);
});

window.v = v;
window.p = p;
