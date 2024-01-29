import { Construct } from 'constructs';
import {
  aws_apigateway as apigateway,
  aws_lambda as lambda,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_iam as iam,
} from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import config from 'config';
import { setSsmParameter } from '../../config/ssm';

export function createPublicApiGateway(
  scope: Construct,
  cert: acm.ICertificate,
  region: string,
): apigateway.RestApi {
  const apiName = `${config.get('name')}`;
  const apiRest = new apigateway.RestApi(scope, apiName + '-api', {
    restApiName: apiName,
    description: 'API REST of blog',
    // defaultCorsPreflightOptions: {
    //   allowOrigins: apigateway.Cors.ALL_ORIGINS,
    //   allowMethods: apigateway.Cors.ALL_METHODS,
    //   // allowMethods: ['POST'],
    // },
    retainDeployments: true,
    deployOptions: {
      stageName: `${config.get('environment')}`, // default "prod"
      loggingLevel: apigateway.MethodLoggingLevel.ERROR, // Default OFF
      dataTraceEnabled: false,
      metricsEnabled: true,
      tracingEnabled: true,
      cacheClusterEnabled: false,
      cachingEnabled: false, // 14.88 $ per month
      cacheDataEncrypted: false,
    },
    domainName: {
      domainName: 'api.playingaws.com',
      certificate: cert,
      endpointType: apigateway.EndpointType.EDGE, // default is REGIONAL
      securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
      basePath: '*',
    },
    policy: createResourcePolicy(),
  });
  // Create Route53 record for API Custom Domain
  createRoute53Record(scope, apiRest);

  // setSsmParameter
  setSsmParameter(
    scope,
    '/blog/apigateway/url',
    `${apiRest.restApiId}.execute-api.${region}.amazonaws.com`,
    'API Gateway endpoint',
  );

  return apiRest;
}

export function addApiResource(
  apiRest: apigateway.IRestApi,
): apigateway.Resource {
  return apiRest.root.addResource('api');
}

export function addContactResource(
  apiResource: apigateway.Resource,
  lambdaContact: lambda.Function,
): void {
  const contact = apiResource.addResource('contact');
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
  apiResource: apigateway.Resource,
  lambdaSubscription: lambda.Function,
): void {
  const subscriptionForm = apiResource.addResource('subscription');
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

export function createRoute53Record(
  scope: Construct,
  api: apigateway.RestApi,
): void {
  const myHostedZone = route53.HostedZone.fromLookup(scope, 'MyZone', {
    domainName: 'playingaws.com',
  });
  const name = `${config.get('environment')}-api`;
  new route53.ARecord(scope, name, {
    zone: myHostedZone,
    recordName: 'api',
    target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
  });
}

// add resource policy for the api gateway
export function createResourcePolicy(): iam.PolicyDocument {
  return new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        actions: ['execute-api:Invoke'],
        principals: [new iam.AnyPrincipal()],
        resources: ['execute-api:/*/*/*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['execute-api:Invoke'],
        resources: ['execute-api:/*/*/*'],
        conditions: {
          StringNotLike: {
            'aws:Referer': [
              'https://www.playingaws.com',
              'https://www.playingaws.com/*',
            ],
          },
        },
      }),
    ],
  });
}
