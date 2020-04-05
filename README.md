# Serverless Blog API
[![BCH compliance](https://bettercodehub.com/edge/badge/lracicot/serverless-blog-api?branch=master)](https://bettercodehub.com/) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lracicot_serverless-blog-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=lracicot_serverless-blog-api)

## Setup repository

```
aws cloudformation deploy --capabilities CAPABILITY_IAM \
  --template-file repository.yml \
  --region ca-central-1 \
  --stack-name blog-api-repository \
  --parameter-overrides \
    RepositoryName=blog-api
```

## Deploy CI/CD pipeline DEV

```
aws cloudformation deploy --capabilities CAPABILITY_IAM \
  --template-file pipeline.yml \
  --region ca-central-1 \
  --stack-name blog-api-pipeline-dev \
  --parameter-overrides \
    RepositoryStack=blog-api-repository \
    RepositoryName=blog-api \
    StackName=blog-api-dev \
    BranchName=develop \
    DomainName=api-dev.blog.louisracicot.net \
    ConsoleUrl=console-dev.blog.louisracicot.net \
    CertificateArn=arn:aws:acm:us-east-1:281217159305:certificate/834042a2-c706-4c3c-8e6b-04bcd698804a
```


## Deploy CI/CD pipeline PROD

```
aws cloudformation deploy --capabilities CAPABILITY_IAM \
  --template-file pipeline.yml \
  --region ca-central-1 \
  --stack-name blog-api-pipeline-prod \
  --parameter-overrides \
    RepositoryStack=blog-api-repository \
    RepositoryName=blog-api \
    StackName=blog-api-prod \
    BranchName=master \
    DomainName=api.blog.louisracicot.net \
    ConsoleUrl=console.blog.louisracicot.net \
    CertificateArn=arn:aws:acm:us-east-1:281217159305:certificate/834042a2-c706-4c3c-8e6b-04bcd698804a
```
