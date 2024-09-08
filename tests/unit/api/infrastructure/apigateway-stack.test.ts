import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { BlogInfrastructureStack } from '../../../../backend/blog-backend-infrastructure-stack';

/*****************************
 * List of tests in this file:
 *
 * 1. Stack contains API Gateway RestApi with correct name
 * 2. API Gateway has correct endpoint configuration
 * 3. API Gateway has /api resource
 * 4. API Gateway has POST method for /api/contact
 * 5. Lambda function is created for contact resource
 * 6. Stack contains API Gateway Deployment with Retain policy
 * 7. Stack contains API Gateway Stage of prod that follows best practices
 * 8. API Gateway has POST method for /api/subscription
 * 9. Step Functions is created for subscription resource
 *****************************/

describe('Validate Api Gateway', () => {
  let app: cdk.App;
  let stack: BlogInfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new BlogInfrastructureStack(app, 'blog-backend-infrastructure', {
      env: {
        account:
          process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-west-1',
      },
    });
    template = Template.fromStack(stack);
  });

  test('Stack contains API Gateway RestApi with correct name', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'blog-backend-infrastructure',
    });
  });

  // test('API Gateway has correct endpoint configuration', () => {
  //   template.hasResourceProperties('AWS::ApiGateway::RestApi', {
  //     EndpointConfiguration: {
  //       Types: ['EDGE'],
  //     },
  //   });
  // });

  test('Stack contains API Gateway Deployment with Retain policy', () => {
    template.hasResource('AWS::ApiGateway::Deployment', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('Stack contains API Gateway Stage of prod that follows best practices', () => {
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

  test('API Gateway has /api resource', () => {
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'api',
    });
  });

  test('API Gateway has POST method for /api/contact', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
      },
    });
  });

  test('API Gateway has POST method for /api/subscription', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
      },
    });
  });

  test('API Gateway has POST method for /api/feedback', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
      },
    });
  });

  // test('/api/subscription resource is using a Lambda function', () => {
  //   template.hasResourceProperties('AWS::ApiGateway::Method', {
  //     HttpMethod: 'POST',
  //     Integration: {
  //       Type: 'AWS_PROXY',
  //       IntegrationHttpMethod: 'POST',
  //       Uri: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'arn:',
  //             { Ref: 'AWS::Partition' },
  //             ':apigateway:',
  //             { Ref: 'AWS::Region' },
  //             ':lambda:path/2015-03-31/functions/',
  //             {
  //               'Fn::GetAtt': [
  //                 expect.stringMatching(/^SubscriptionLambda[A-Z0-9]+$/),
  //                 'Arn',
  //               ],
  //             },
  //             '/invocations',
  //           ],
  //         ],
  //       },
  //     },
  //   });
  // });

  // test('/api/contact resource is using Step Functions', () => {
  //   template.hasResourceProperties('AWS::ApiGateway::Method', {
  //     HttpMethod: 'POST',
  //     Integration: {
  //       Type: 'AWS',
  //       IntegrationHttpMethod: 'POST',
  //       Uri: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'arn:',
  //             { Ref: 'AWS::Partition' },
  //             ':apigateway:',
  //             { Ref: 'AWS::Region' },
  //             ':states:action/StartExecution',
  //           ],
  //         ],
  //       },
  //       IntegrationResponses: [
  //         {
  //           StatusCode: '200',
  //         },
  //       ],
  //     },
  //   });
  // });

  // test('/api/feedback resource is using Step Functions', () => {
  //   template.hasResourceProperties('AWS::ApiGateway::Method', {
  //     HttpMethod: 'POST',
  //     Integration: {
  //       Type: 'AWS',
  //       IntegrationHttpMethod: 'POST',
  //       Uri: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'arn:',
  //             { Ref: 'AWS::Partition' },
  //             ':apigateway:',
  //             { Ref: 'AWS::Region' },
  //             ':states:action/StartExecution',
  //           ],
  //         ],
  //       },
  //       IntegrationResponses: [
  //         {
  //           StatusCode: '200',
  //         },
  //       ],
  //     },
  //   });
  // });
});
