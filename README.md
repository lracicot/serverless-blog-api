# Serverless Blog API
[![BCH compliance](https://bettercodehub.com/edge/badge/lracicot/serverless-blog-api?branch=master)](https://bettercodehub.com/) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lracicot_serverless-blog-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=lracicot_serverless-blog-api)

## Deploy CI/CD pipeline

```
aws cloudformation deploy --capabilities CAPABILITY_IAM \
  --template-file pipeline.yml \
  --region ca-central-1 \
  --stack-name serverless-blog-pipeline \
  --parameter-overrides \
    RepositoryName=serverless-blog \
    ApiStack=serverless-blog \
    StackName=serverless-blog \
    DomainName=blog.louisracicot.net \
    CertificateArn=
```
