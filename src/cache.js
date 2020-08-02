const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();

class CacheController {
  constructor(distributionId) {
    this.distributionId = distributionId;
  }

  invalidateUrl(urls) {
    return new Promise((resolve, reject) => {
      cloudfront.createInvalidation({
        DistributionId: this.distributionId,
        InvalidationBatch: {
          CallerReference: Date.now(),
          Paths: {
            Quantity: urls.length,
            Items: urls,
          },
        },
      }, (err, data) => (err ? reject(err) : resolve(data)));
    });
  }
}

module.exports = CacheController;
