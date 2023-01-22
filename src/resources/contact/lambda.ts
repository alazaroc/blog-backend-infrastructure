import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  Duration,
  aws_iam as iam,
  aws_logs as logs,
} from 'aws-cdk-lib';
import config from 'config';
import { getSsmPersonalEmail } from '../ssm';

export function createLambdaContact(
  scope: Construct,
  customRole: iam.Role,
): lambda.Function {
  const lambdaName = `contact`;
  const memorySize = parseInt(
    `${config.get('resources.lambda.contact.memorySize')}`,
  );

  const handler = new lambda.Function(scope, lambdaName, {
    functionName: lambdaName,
    description: 'Contact process (Send message to me with SES resource)',
    runtime: lambda.Runtime.NODEJS_14_X,
    memorySize: memorySize,
    timeout: Duration.seconds(30),
    role: customRole,
    code: lambda.Code.fromAsset(`${process.cwd()}/src/serverless/contact`, {}),
    handler: 'index.handler',
    environment: {
      EMAIL: getSsmPersonalEmail(scope),
    },
    logRetention: logs.RetentionDays.INFINITE,
    retryAttempts: 0, // No async exec
  });
  return handler;
}
