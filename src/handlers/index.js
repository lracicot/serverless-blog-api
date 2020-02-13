/* eslint-disable global-require */
exports.post = {
  archivePostByUuid: require('./post/archive-post-by-uuid.js'),
  createPost: require('./post/create-post.js'),
  deletePostByUuid: require('./post/delete-post-by-uuid.js'),
  getAllPosts: require('./post/get-all-posts.js'),
  getPostBySlug: require('./post/get-post-by-slug.js'),
  getPostByUuid: require('./post/get-post-by-uuid.js'),
  getPublishedPosts: require('./post/get-published-posts.js'),
  publishPostByUuid: require('./post/publish-post-by-uuid.js'),
  updatePostByUuid: require('./post/update-post-by-uuid.js'),
};

exports.asset = {
  createAsset: require('./asset/create-asset.js'),
  uploadAssetByUuid: require('./asset/upload-asset-by-uuid.js'),
  deleteAssetByUuid: require('./asset/delete-asset-by-uuid.js'),
  getAllAssets: require('./asset/get-all-assets.js'),
  getAssetByUuid: require('./asset/get-asset-by-uuid.js'),
  updateAssetByUuid: require('./asset/update-asset-by-uuid.js'),
};
