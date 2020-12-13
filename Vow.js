/**
 * @typedef Q
 * @property {'resolve' | 'reject'} type
 * @property {Function}  callback
 * @property {Function}  nextResolve
 */

/**
 * @typedef StateTypes
 * @property {'<pending>' | '<fullfield>' | '<rejected>'} state
 */

var PENDING = "<pending>";
var FULLFIELD = "<fullfield>";
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

  fn(
    Vow.publish.bind(this, FULLFIELD, Vow.executeQueue.bind(this, queue)),
    Vow.publish.bind(this, REJECTED, Vow.executeQueue.bind(this, queue))
  );

  this.state = PENDING;
  this.result = undefined;

  // then
  this.then = function (callback) {
    var state = this.state;
    var nextVow = Vow.next(queue, "resolve", callback, FULLFIELD, function () {
      return state !== REJECTED;
    });

    return nextVow;
  };

  // catch
  this.catch = function (callback) {
    var state = this.state;
    var nextVow = Vow.next(queue, "reject", callback, REJECTED, function () {
      return state === REJECTED;
    });

    return nextVow;
  };
}

/**
 * 큐 추가, 다음 프라미스 생성
 * @param {Q} queue
 * @param {Q['type']} type
 * @param {Function} callback
 * @param {StateTypes} nextVowState
 * @param {Function} pushCallback
 */
Vow.next = function (queue, type, callback, nextVowState, pushCallback) {
  const q = {
    type: type,
    callback: callback,
    nextResolve: undefined,
  };

  var nextVow = new Vow(function (resolve) {
    q.nextResolve = resolve;
  });

  nextVow.state = nextVowState;

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
  queueMicrotask(function () {
    executeFn.apply(null, args);
    thiz.result = args[0];
  });
  this.state = state;
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
    (function (nextQ, nextResult) {
      nextQ.nextResolve(nextResult);
    })(q, userReturnValue);
  }
};

export default Vow;
