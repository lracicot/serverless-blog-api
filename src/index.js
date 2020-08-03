/* eslint-disable global-require */
const logger = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const app = require('./app');
const DynamoDbClient = require('./dynamodb');
const exporterFunctions = require('./exporter');


const middlewares = handler => logger(cors(handler));

const appStack = app(middlewares);

const postTable = new DynamoDbClient(process.env.POST_TABLE);
const exportTable = new DynamoDbClient(process.env.EXPORT_TABLE);
const assetTable = new DynamoDbClient(process.env.ASSET_TABLE);

const posts = {
  archivePostByUuid: appStack.post(require('./handlers/post/archive-post-by-uuid.js')(postTable)),
  createPost: appStack.post(require('./handlers/post/create-post.js')(postTable)),
  deletePostByUuid: appStack.delete(require('./handlers/post/delete-post-by-uuid.js')(postTable)),
  getAllPosts: appStack.get(require('./handlers/post/get-all-posts.js')(postTable)),
  getPostBySlug: appStack.get(require('./handlers/post/get-post-by-slug.js')(postTable)),
  getPostByUuid: appStack.get(require('./handlers/post/get-post-by-uuid.js')(postTable)),
  getPublishedPosts: appStack.get(require('./handlers/post/get-published-posts.js')(postTable)),
  publishPostByUuid: appStack.post(require('./handlers/post/publish-post-by-uuid.js')(postTable)),
  updatePostByUuid: appStack.put(require('./handlers/post/update-post-by-uuid.js')(postTable)),
};

const assets = {
  createAsset: appStack.post(require('./handlers/asset/create-asset.js')(assetTable)),
  uploadAssetByUuid: appStack.post(require('./handlers/asset/upload-asset-by-uuid.js')(assetTable)),
  deleteAssetByUuid: appStack.delete(require('./handlers/asset/delete-asset-by-uuid.js')(assetTable)),
  getAllAssets: appStack.get(require('./handlers/asset/get-all-assets.js')(assetTable)),
  getAssetByUuid: appStack.get(require('./handlers/asset/get-asset-by-uuid.js')(assetTable)),
  updateAssetByUuid: appStack.put(require('./handlers/asset/update-asset-by-uuid.js')(assetTable)),
};

const exporter = {
  triggerExport: appStack.post(require('./handlers/exporter/trigger-export.js')(
    exporterFunctions,
    exportTable,
    postTable,
    assetTable,
  )),
  getAllExports: appStack.get(require('./handlers/exporter/get-all-exports.js')(exportTable)),
  downloadExport: appStack.get(require('./handlers/exporter/download-export.js')(exportTable)),
};


exports.post = posts;
exports.asset = assets;
exports.exporter = exporter;
