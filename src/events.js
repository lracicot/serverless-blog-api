/* eslint-disable global-require */
const logger = require('./middlewares/logger');
const DynamoDbClient = require('./dynamodb');
const exporterFunctions = require('./exporter');

const eventHandlerStack = handler => (event, context) => logger(handler)(event, context);

const postTable = new DynamoDbClient(process.env.POST_TABLE);
const exportTable = new DynamoDbClient(process.env.EXPORT_TABLE);
const assetTable = new DynamoDbClient(process.env.ASSET_TABLE);

const exporter = {
  triggerExport: eventHandlerStack(require('./events/exporter/trigger-export.js')(
    exporterFunctions,
    exportTable,
    postTable,
    assetTable,
  )),
};

exports.exporter = exporter;
