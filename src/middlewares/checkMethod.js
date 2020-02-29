const HttpMethodError = require('../errors/HttpMethodError');

module.exports = (method, next) => (event, context) => {
  if (event.httpMethod !== method) {
    throw new HttpMethodError(`${event.path} only accepts ${method} method, you tried: ${event.httpMethod} method.`);
  }

  return next(event, context);
};
