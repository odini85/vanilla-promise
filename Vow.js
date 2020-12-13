/**
 * @typedef Q
 * @property {'resolve' | 'reject'} type
 * @property {Function}  callback
 * @property {Function}  nextResolve
 */

/**
 * @typedef StateTypes
 * @property {'<pending>' | '<fulfilled>' | '<rejected>'} state
 */

var PENDING = "<pending>";
var FULLFILLED = "<fulfilled>";
var REJECTED = "<rejected>";

/**
 * Promise Polyfill
 * @param {Function} fn
 * @property {StateTypes} state
 * @property {Function} then
 * @property {Function} catch
 */
function Vow(fn) {
  var queue = [];

  this.queue = queue;

  fn(
    Vow.publish.bind(this, FULLFILLED, Vow.executeQueue.bind(this, queue)),
    Vow.publish.bind(this, REJECTED, Vow.executeQueue.bind(this, queue))
  );

  this.state = PENDING;
  this.result = undefined;

  var nextVow = undefined;

  // then
  this.then = function (callback) {
    var state = this.state;

    if (state === FULLFILLED) {
      callback(this.result);
    }

    // if (!nextVow) {
    nextVow = Vow.next(queue, "resolve", callback, function () {
      return state !== REJECTED;
    });
    // }

    return nextVow;
  };

  // catch
  this.catch = function (callback) {
    var state = this.state;

    return Vow.next(queue, "reject", callback, function () {
      return state === REJECTED;
    });
  };
}

/**
 * 큐 추가, 다음 프라미스 생성
 * @param {Q} queue
 * @param {Q['type']} type
 * @param {Function} callback
 * @param {Function} pushCallback
 */
Vow.next = function (queue, type, callback, pushCallback) {
  const q = {
    type: type,
    callback: callback,
    nextResolve: undefined,
  };

  var nextVow = new Vow(function (resolve) {
    q.nextResolve = resolve;
  });

  if (pushCallback()) {
    queue.push(q);
  }

  return nextVow;
};

/**
 * 구독 실행
 * @param {StateTypes} state
 * @param {Function} executeFn
 */
Vow.publish = function (state, executeFn) {
  var args = [].slice.call(arguments, 2);
  var thiz = this;
  this.state = state;

  queueMicrotask(function () {
    executeFn.apply(null, args);
    thiz.result = args[0];
  });
};

/**
 * 큐 실행
 * @param {Q[]} queue
 */
Vow.executeQueue = function (queue) {
  while (queue.length > 0) {
    var q = queue.shift();
    var args = [].slice.call(arguments, 1);
    var userReturnValue = q.callback.apply(null, args);

    q.nextResolve(userReturnValue);
  }
};

export default Vow;
