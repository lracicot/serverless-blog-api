const checkMethod = require('./middlewares/checkMethod');

module.exports = middlewares => ({
  post: handler => (event, context) => checkMethod('POST', middlewares(handler))(event, context),
  delete: handler => (event, context) => checkMethod('DELETE', middlewares(handler))(event, context),
  get: handler => (event, context) => checkMethod('GET', middlewares(handler))(event, context),
  put: handler => (event, context) => checkMethod('PUT', middlewares(handler))(event, context),
});
