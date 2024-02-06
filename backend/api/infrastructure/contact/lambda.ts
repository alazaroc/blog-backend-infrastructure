import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  Duration,
  aws_iam as iam,
  aws_dynamodb as dynamodb,
  aws_logs as logs,
} from 'aws-cdk-lib';
import config from 'config';
import { getSsmParameter } from '../../../../backend/config/ssm';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

export function createLambdaContact(
  scope: Construct,
  customRole: iam.Role,
  contactTable: dynamodb.Table,
): lambda.Function {
  const lambdaName = `${config.get('name')}` + `-contact`;
  const memorySize = parseInt(
    `${config.get('resources.lambda.contact.memorySize')}`,
  );

  const handler = new lambda.Function(scope, lambdaName + '-lbd', {
    functionName: lambdaName,
    description: 'Blog contact process',
    runtime: lambda.Runtime.NODEJS_18_X,
    memorySize: memorySize,
    timeout: Duration.seconds(30),
    role: customRole,
    code: lambda.Code.fromAsset(
      `${process.cwd()}/backend/api/runtime/contact`,
      {},
    ),
    handler: 'index.handler',
    environment: {
      EMAIL: getSsmParameter(scope, 'resources.ssm.personalEmail'),
      TABLE_CONTACT: contactTable.tableName,
    },
    logRetention: logs.RetentionDays.INFINITE,
    retryAttempts: 0, // No async exec
    tracing: Tracing.ACTIVE,
  });
  return handler;
}
