const winston = require('winston');

const { createLogger, transports } = winston;

module.exports = createLogger({
  level: 'info',
  silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.Console(),
  ],
});
