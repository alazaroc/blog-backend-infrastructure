import { Construct } from 'constructs';
import {
  aws_apigateway as apigateway,
  aws_lambda as lambda,
  aws_certificatemanager as acm,
  aws_route53 as route53,
} from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import config from 'config';

export function createPublicApiGateway(
  scope: Construct,
  cert: acm.ICertificate,
): apigateway.RestApi {
  const apiName = `${config.get('name')}`;
  const apiRest = new apigateway.RestApi(scope, apiName + '-api', {
    restApiName: apiName,
    description: 'API REST of blog',
    defaultCorsPreflightOptions: {
      allowOrigins: ['https://www.playingaws.com'],
      allowMethods: ['POST'],
    },
    retainDeployments: true,
    deployOptions: {
      stageName: `${config.get('environment')}`, // default "prod"
      loggingLevel: apigateway.MethodLoggingLevel.ERROR, // Default OFF
      dataTraceEnabled: false,
      metricsEnabled: true,
      tracingEnabled: false, // TODO: not enabled in Spain region yet
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
  });
  // Create Route53 record for API Custom Domain
  createRoute53Record(scope, apiRest);
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
