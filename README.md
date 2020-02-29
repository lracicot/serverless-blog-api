# Serverless Blog API
[![BCH compliance](https://bettercodehub.com/edge/badge/lracicot/serverless-blog-api?branch=master)](https://bettercodehub.com/)

## Deploy CI/CD pipeline

```
aws cloudformation deploy --capabilities CAPABILITY_IAM \
  --template-file pipeline.yml \
  --region $REGION \
  --stack-name blog-console-pipeline \
  --parameter-overrides \
    RepositoryName=blog-console \
    ApiStack=serverless-blog-api
```
