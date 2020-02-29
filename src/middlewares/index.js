const logger = require('../logger');
const HttpMethodError = require('../errors/HttpMethodError');

const checkMethodMiddleware = (method, next) => (event, context) => {
  if (event.httpMethod !== method) {
    throw new HttpMethodError(`${event.path} only accepts ${method} method, you tried: ${event.httpMethod} method.`);
  }

  return next(event, context);
};

const loggerMiddleware = next => (event, context) => {
  logger.info(`${event.path} received: ${JSON.stringify(event)}`);
  const response = next(event, context);
  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);

  return response;
};

const corsMiddleware = next => (event, context) => {
  const response = next(event, context);
  return {
    ...response,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

module.exports = {
  corsMiddleware, loggerMiddleware, checkMethodMiddleware,
};
