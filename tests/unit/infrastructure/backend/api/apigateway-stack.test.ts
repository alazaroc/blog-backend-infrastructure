import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { BlogInfrastructureStack } from '../../../../../backend/blog-infrastructure-stack';

describe('Validate Api Gateway', () => {
  test('Stack contains API Gateway RestApi with name blog-infrastructure', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BlogInfrastructureStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'blog-infrastructure',
    });
  });

  test('Stack contains API Gateway Deployment with Retain policy', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BlogInfrastructureStack(app, 'MyTestStack');
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
    const stack = new BlogInfrastructureStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'prd',
      TracingEnabled: false, // TODO: not enabled in Spain region yet
      CacheClusterEnabled: true,
      MethodSettings: Match.arrayWith([
        {
          CacheDataEncrypted: true,
          CachingEnabled: true,
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
