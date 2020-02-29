/* eslint-disable global-require */
const logger = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const app = require('./app');


const middlewares = handler => logger(cors(handler));

const appStack = app(middlewares);

const posts = {
  archivePostByUuid: appStack.post(require('./handlers/post/archive-post-by-uuid.js')),
  createPost: appStack.post(require('./handlers/post/create-post.js')),
  deletePostByUuid: appStack.delete(require('./handlers/post/delete-post-by-uuid.js')),
  getAllPosts: appStack.get(require('./handlers/post/get-all-posts.js')),
  getPostBySlug: appStack.get(require('./handlers/post/get-post-by-slug.js')),
  getPostByUuid: appStack.get(require('./handlers/post/get-post-by-uuid.js')),
  getPublishedPosts: appStack.get(require('./handlers/post/get-published-posts.js')),
  publishPostByUuid: appStack.post(require('./handlers/post/publish-post-by-uuid.js')),
  updatePostByUuid: appStack.put(require('./handlers/post/update-post-by-uuid.js')),
};

const assets = {
  createAsset: appStack.post(require('./handlers/asset/create-asset.js')),
  uploadAssetByUuid: appStack.post(require('./handlers/asset/upload-asset-by-uuid.js')),
  deleteAssetByUuid: appStack.delete(require('./handlers/asset/delete-asset-by-uuid.js')),
  getAllAssets: appStack.get(require('./handlers/asset/get-all-assets.js')),
  getAssetByUuid: appStack.get(require('./handlers/asset/get-asset-by-uuid.js')),
  updateAssetByUuid: appStack.put(require('./handlers/asset/update-asset-by-uuid.js')),
};


exports.post = posts;
exports.asset = assets;
