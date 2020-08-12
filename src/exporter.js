
const tar = require('tar-stream');
const url = require('url');
const stream = require('stream');

class FileToExport {
  constructor(filePath, data) {
    this.filePath = filePath;
    this.data = data;
  }
}

/**
 * Returns a stream uploader for a given s3 bucket
 * @param  {S3}          s3     S3 client
 * @param  {string}      bucket name of the bucket
 * @return {PassThrough} data stream to pipe the data to.
 */
const createStreamUploader = (s3, bucket) => (filePath) => {
  const pass = new stream.PassThrough();
  s3.upload({ Bucket: bucket, Key: filePath, Body: pass }, (err) => {
    if (err) pass.emit('error', err);
  });
  return pass;
};

/**
 * Returns a function to get an object from a given s3 bucket
 * @param {S3}     s3     S3 client
 * @param {string} bucket name of the bucket
 */
const createAssetFileGetter = (s3, bucket) => imagePath => s3.getObject({
  Bucket: bucket,
  Key: imagePath,
}).promise().then(data => data.Body);


/**
 * Returns a promise that would give an array of FileToExport
 * @param  {function} assetGetter     function to get asset list
 * @param  {function} assetFileGetter function to get asset file
 * @return {Promise}
 */
const getAssets = (assetGetter, assetFileGetter) => assetGetter().then(
  assets => Promise.all(assets.map((asset) => {
    if (asset.public_url) {
      const fileKey = url.parse(asset.public_url).pathname;
      return assetFileGetter(fileKey).then(
        data => new FileToExport(`assets/${fileKey}`, data),
      ).catch((err) => {console.log(err); return null;}); //eslint-disable-line
    }
    return null;
  }))
    .then(files => files.filter(file => file !== null))
    .then(files => [
      ...files,
      new FileToExport('assets.json', JSON.stringify(assets)),
    ]),
);

const getPosts = postGetter => postGetter().then(posts => [new FileToExport('posts.json', JSON.stringify(posts))]);

const uploadExport = (uploader, archive, exportFileName) => new Promise((resolve, reject) => {
  const uploadStream = uploader(exportFileName);

  uploadStream.on('finish', resolve);
  uploadStream.on('error', reject);

  archive.pipe(uploadStream);
});

const launchExport = (dataGetter, exportFileName, uploader) => {
  const pack = tar.pack();

  return dataGetter.then((files) => {
    for (const file of files.flat()) {
      console.log(file) // eslint-disable-line
      pack.entry({ name: file.filePath }, file.data);
    }
    pack.finalize();
    return uploadExport(uploader, pack, exportFileName);
  });
};

module.exports = {
  createStreamUploader,
  createAssetFileGetter,
  getAssets,
  getPosts,
  uploadExport,
  launchExport,
};
