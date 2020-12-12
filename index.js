import Vow from "./Vow.js";

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

// ######################################################################################################

var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
    // reject(2222);
  }, 1000);
});

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
