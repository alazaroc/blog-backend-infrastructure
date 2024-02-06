import { Construct } from 'constructs';
import {
  aws_apigateway as apigateway,
  aws_lambda as lambda,
  // aws_certificatemanager as acm,
  aws_iam as iam,
} from 'aws-cdk-lib';
// import * as targets from 'aws-cdk-lib/aws-route53-targets';
import config from 'config';
import { getSsmParameter, setSsmParameter } from '../../config/ssm';

export function createPublicApiGateway(
  scope: Construct,
  // cert: acm.ICertificate,
  region: string,
): apigateway.RestApi {
  const apiName = `${config.get('name')}`;
  const apiRest = new apigateway.RestApi(scope, apiName + '-api', {
    restApiName: apiName,
    description: 'API REST of blog',
    // Remove CORS because now the API Gateway will be exposed through CloudFront
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
    // Removed because now the API Gateway will be exposed through CloudFront
    // domainName: {
    //   domainName: 'api.playingaws.com',
    //   certificate: cert,
    //   endpointType: apigateway.EndpointType.EDGE, // default is REGIONAL
    //   securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
    //   basePath: '*',
    // },
    policy: createResourcePolicy(),
  });
  // Create Route53 record for API Custom Domain
  // createRoute53Record(scope, apiRest);

  // setSsmParameter
  const parameterName = '/blog/apigateway/url';
  const value = `${apiRest.restApiId}.execute-api.${region}.amazonaws.com`;
  const description = 'API Gateway endpoint';
  setSsmParameter(scope, parameterName, value, description);

  // Add generic errors
  const genericErrorMessage = 'An error occurred. Please review your request.';
  addGatewayResponse(
    apiRest,
    'default4xxResponse',
    apigateway.ResponseType.DEFAULT_4XX,
    '400',
    genericErrorMessage,
  );
  addGatewayResponse(
    apiRest,
    'default5xxResponse',
    apigateway.ResponseType.DEFAULT_5XX,
    '400', // Server error will send also a 400 code error to obfuscate information to anyone
    genericErrorMessage,
  );

  return apiRest;
}

export function addApiResource(
  apiRest: apigateway.IRestApi,
): apigateway.Resource {
  return apiRest.root.addResource('api');
}

export function addLambdaContactResource(
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

export function addLambdaSubscriptionResource(
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

export function addStepFunctionsContactResource(
  scope: Construct,
  apiResource: apigateway.Resource,
): void {
  const stepFunctionsArn = getSsmParameter(
    scope,
    'resources.ssm.stepFunctionsArn',
  );
  // IAM role that API Gateway will assume to invoke Step Functions
  const stepFunctionsRole = new iam.Role(scope, 'StepFunctionsExecutionRole', {
    assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
  });
  stepFunctionsRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ['states:StartExecution'],
      resources: [stepFunctionsArn], // Replace with your actual Step Functions ARN
    }),
  );

  // Define the HTTP integration
  const stepFunctionsIntegration = new apigateway.AwsIntegration({
    service: 'states',
    action: 'StartExecution', // Action to start execution of the state machine
    integrationHttpMethod: 'POST', // The integration HTTP method must be POST for actions
    options: {
      credentialsRole: stepFunctionsRole,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '{"message": "Success"}',
          },
        },
      ],
      requestTemplates: {
        'application/json': JSON.stringify({
          stateMachineArn: stepFunctionsArn, // Use the actual ARN of your state machine
          input: "$util.escapeJavaScript($input.json('$'))", // Pass the entire request body as input to the state machine
          // Add any additional parameters required by the StartExecution API
        }),
      },
    },
  });

  // Add a method to the resource that uses the integration
  const contactForm = apiResource.addResource('contact');
  contactForm.addMethod('POST', stepFunctionsIntegration, {
    methodResponses: [{ statusCode: '200' }],
  });
}

// Removed because now the API Gateway will be exposed through CloudFront
// export function createRoute53Record(
//   scope: Construct,
//   api: apigateway.RestApi,
// ): void {
//   const myHostedZone = route53.HostedZone.fromLookup(scope, 'MyZone', {
//     domainName: 'playingaws.com',
//   });
//   const name = `${config.get('environment')}-api`;
//   new route53.ARecord(scope, name, {
//     zone: myHostedZone,
//     recordName: 'api',
//     target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
//   });
// }

// add resource policy for the api gateway
function createResourcePolicy(): iam.PolicyDocument {
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
              'https://playingaws.com',
              'https://playingaws.com/*',
            ],
          },
        },
      }),
    ],
  });
}

function addGatewayResponse(
  apiRest: apigateway.RestApi,
  name: string,
  type: apigateway.ResponseType,
  statusCode: string,
  message: string,
) {
  apiRest.addGatewayResponse(name, {
    type,
    statusCode: statusCode,
    // responseHeaders: {
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*', // Adjust CORS if needed
    // },
    templates: {
      'application/json': `{"message":"${message}"}`,
    },
  });
}
