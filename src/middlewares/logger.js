const logger = require('../logger');

module.exports = next => async (event, context) => {
  logger.info(`${event.path} received: ${JSON.stringify(event)}`);
  const response = await next(event, context);
  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);

  return response;
};
