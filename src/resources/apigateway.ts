import { Construct } from 'constructs';
import {
  aws_apigateway as apigateway,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import config from 'config';

export function createPublicApiGateway(scope: Construct): apigateway.RestApi {
  const apiName = `blog-api`;
  const apiRest = new apigateway.RestApi(scope, apiName, {
    restApiName: apiName,
    description: 'API REST of blog',
    defaultCorsPreflightOptions: {
      allowOrigins: ['https://www.playingaws.com'],
      allowMethods: ['POST'],
    },
    retainDeployments: true,
    deployOptions: {
      stageName: `${config.get('infrastructure.environment')}`, // default "prod"
      loggingLevel: apigateway.MethodLoggingLevel.ERROR, // Default OFF
      dataTraceEnabled: false,
      metricsEnabled: false,
      tracingEnabled: false,
    },
  });
  return apiRest;
}

export function addContactResource(
  apiRest: apigateway.IRestApi,
  lambdaContact: lambda.Function,
): void {
  const contact = apiRest.root.addResource('contact');
  const lambdaIntegration = new apigateway.LambdaIntegration(lambdaContact, {
    proxy: true,
  });
  contact.addMethod('POST', lambdaIntegration, {
    methodResponses: [
      {
        statusCode: '200',
      },
    ],
  });
}

export function addSubscriptionResource(
  apiRest: apigateway.IRestApi,
  lambdaSubscription: lambda.Function,
): void {
  const subscriptionForm = apiRest.root.addResource('subscription');
  const lambdaIntegration = new apigateway.LambdaIntegration(
    lambdaSubscription,
    {
      proxy: true,
    },
  );
  subscriptionForm.addMethod('POST', lambdaIntegration, {
    methodResponses: [
      {
        statusCode: '200',
      },
    ],
  });
}

export function addCommentResource(
  apiRest: apigateway.IRestApi,
  lambdaComment: lambda.Function,
): void {
  const commentForm = apiRest.root.addResource('comment');
  const lambdaIntegration = new apigateway.LambdaIntegration(lambdaComment, {
    proxy: true,
  });
  commentForm.addMethod('POST', lambdaIntegration, {
    methodResponses: [
      {
        statusCode: '200',
      },
    ],
  });
}
