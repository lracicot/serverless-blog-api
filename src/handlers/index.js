/* eslint-disable global-require */
const { checkMethodMiddleware, loggerMiddleware, corsMiddleware } = require('../middlewares');

// const middlewares = loggerMiddleware(cors);
// const appStack = app(middlewares);

const applyMiddlewares = (method, handler) => checkMethodMiddleware(method,
  loggerMiddleware(
    corsMiddleware(handler),
  ));

const app = {
  post: handler => (event, context) => applyMiddlewares('POST', handler)(event, context),
  delete: handler => (event, context) => applyMiddlewares('DELETE', handler)(event, context),
  get: handler => (event, context) => applyMiddlewares('GET', handler)(event, context),
  put: handler => (event, context) => applyMiddlewares('PUT', handler)(event, context),
};

const posts = {
  archivePostByUuid: app.post(require('./post/archive-post-by-uuid.js')),
  createPost: app.post(require('./post/create-post.js')),
  deletePostByUuid: app.delete(require('./post/delete-post-by-uuid.js')),
  getAllPosts: app.get(require('./post/get-all-posts.js')),
  getPostBySlug: app.get(require('./post/get-post-by-slug.js')),
  getPostByUuid: app.get(require('./post/get-post-by-uuid.js')),
  getPublishedPosts: app.get(require('./post/get-published-posts.js')),
  publishPostByUuid: app.post(require('./post/publish-post-by-uuid.js')),
  updatePostByUuid: app.put(require('./post/update-post-by-uuid.js')),
};

const assets = {
  createAsset: app.post(require('./asset/create-asset.js')),
  uploadAssetByUuid: app.post(require('./asset/upload-asset-by-uuid.js')),
  deleteAssetByUuid: app.delete(require('./asset/delete-asset-by-uuid.js')),
  getAllAssets: app.get(require('./asset/get-all-assets.js')),
  getAssetByUuid: app.get(require('./asset/get-asset-by-uuid.js')),
  updateAssetByUuid: app.put(require('./asset/update-asset-by-uuid.js')),
};


exports.post = posts;
exports.asset = assets;
