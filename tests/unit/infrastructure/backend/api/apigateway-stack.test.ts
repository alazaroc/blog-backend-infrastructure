import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { BlogInfrastructureStack } from '../../../../../backend/blog-backend-infrastructure-stack';

describe('Validate Api Gateway', () => {
  test('Stack contains API Gateway RestApi with name blog-backend-infrastructure', () => {
    const app = new cdk.App();
    // WHEN
    // const stack = new BlogInfrastructureStack(app, 'MyTestStack');
    const stack = new BlogInfrastructureStack(
      app,
      'blog-backend-infrastructure',
      {
        env: {
          account:
            process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
          region:
            process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
        },
      },
    );
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'blog-backend-infrastructure',
    });
  });

  test('Stack contains API Gateway Deployment with Retain policy', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BlogInfrastructureStack(
      app,
      'blog-backend-infrastructure',
      {
        env: {
          account:
            process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
          // region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
          region:
            process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
        },
      },
    );
    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('AWS::ApiGateway::Deployment', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('Stack contains API Gateway Stage of prod that follows best practices', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BlogInfrastructureStack(
      app,
      'blog-backend-infrastructure',
      {
        env: {
          account:
            process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
          // region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
          region:
            process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
        },
      },
    );
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'prd',
      TracingEnabled: true,
      CacheClusterEnabled: false, // TODO: DISABLED
      MethodSettings: Match.arrayWith([
        {
          CacheDataEncrypted: false, // TODO: DISABLED
          CachingEnabled: false, // TODO: DISABLED
          DataTraceEnabled: false,
          HttpMethod: '*',
          LoggingLevel: 'ERROR',
          MetricsEnabled: true,
          ResourcePath: '/*',
        },
      ]),
    });
  });
});
