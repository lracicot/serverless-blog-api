/* eslint-disable global-require */

const logger = require('../logger');

const checkMethod = (method, next) => (event, context) => {
  if (event.httpMethod !== method) {
    throw new Error(`${event.path} only accepts ${method} method, you tried: ${event.httpMethod} method.`);
  }

  return next(event, context);
};

const app = {
  post: (handler, next) => (event, context) => checkMethod('POST', next(handler))(event, context),
  delete: (handler, next) => (event, context) => checkMethod('DELETE', next(handler))(event, context),
  get: (handler, next) => (event, context) => checkMethod('GET', next(handler))(event, context),
  put: (handler, next) => (event, context) => checkMethod('PUT', next(handler))(event, context),
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

const middlewares = corsMiddleware(loggerMiddleware);


const posts = {
  archivePostByUuid: app.post(require('./post/archive-post-by-uuid.js'), middlewares),
  createPost: app.post(require('./post/create-post.js'), middlewares),
  deletePostByUuid: app.delete(require('./post/delete-post-by-uuid.js'), middlewares),
  getAllPosts: app.get(require('./post/get-all-posts.js'), middlewares),
  getPostBySlug: app.get(require('./post/get-post-by-slug.js'), middlewares),
  getPostByUuid: app.get(require('./post/get-post-by-uuid.js'), middlewares),
  getPublishedPosts: app.get(require('./post/get-published-posts.js'), middlewares),
  publishPostByUuid: app.post(require('./post/publish-post-by-uuid.js'), middlewares),
  updatePostByUuid: app.put(require('./post/update-post-by-uuid.js'), middlewares),
};

const assets = {
  createAsset: app.post(require('./asset/create-asset.js'), middlewares),
  uploadAssetByUuid: app.post(require('./asset/upload-asset-by-uuid.js'), middlewares),
  deleteAssetByUuid: app.delete(require('./asset/delete-asset-by-uuid.js'), middlewares),
  getAllAssets: app.get(require('./asset/get-all-assets.js'), middlewares),
  getAssetByUuid: app.get(require('./asset/get-asset-by-uuid.js'), middlewares),
  updateAssetByUuid: app.put(require('./asset/update-asset-by-uuid.js'), middlewares),
};


exports.post = posts;
exports.asset = assets;
