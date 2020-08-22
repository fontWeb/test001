; (function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'
  /**
   * excutor 回调函数
   */
  function Promise(excutor) {

    const self = this;
    this.status = PENDING;
    this.data = undefined; // 用来存储结果数据的属性
    this.callbacks = [];

    function resolve(value) {
      if (self.status === PENDING) {
        self.status = RESOLVED;
        self.data = value;
        if (self.callbacks.length) {
          setTimeout(() => {
            self.callbacks.forEach(callback => {
              callback['onResolved'](value)
            });
          }, 0);
        }
      }
    }

    function reject(reason) {
      if (self.status === PENDING) {
        self.status = REJECTED;
        self.data = reason;
        if (self.callbacks.length) {
          setTimeout(() => {
            self.callbacks.forEach(callback => {
              callback['onRejected'](reason)
            });
          }, 0);
        }
      }
    }

    try {
      excutor(resolve, reject)
    } catch (error) {
      console.log(error);
      reject(error)
    }
  }

  Promise.prototype.then = function (onResolved, onRejected) {

    const self = this; // promise对象

    // then()方法执行的结果是返回一个新的promise实例
    return new Promise((resolve, reject) => {
      // 这里分为2种情况
      // ① 此时promise的状态已经改变
      // ② 此时promise的状态没有改变
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved, onRejected
        })
      } else if (self.status === RESOLVED) {
        setTimeout(() => {
          try {
            const result = onResolved(self.data);
            if (result instanceof Promise) {
              // result.then(
              //   value => resolve(value),
              //   reason => reject(reason),
              // )
              result.then(resolve,reject);
            } else {
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        }, 0);
      } else {
        setTimeout(() => {
          onRejected(self.data)
        }, 0);
      }
    })

  }


  Promise.prototype.catch = function (onRejected) {


  }






  window.Promise = Promise;
})(window)