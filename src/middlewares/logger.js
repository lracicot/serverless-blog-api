const logger = require('../logger');

module.exports = next => async (event, context) => {
  logger.info(`${event.path} received: ${JSON.stringify(event)}`);
  const response = await next(event, context);
  if (response && response.statusCode) {
    logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  } else {
    logger.info(`response from: ${event.path} : ${JSON.stringify(response)}`);
  }

  return response;
};
