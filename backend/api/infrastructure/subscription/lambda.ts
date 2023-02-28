import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  Duration,
  aws_iam as iam,
  aws_dynamodb as dynamodb,
  aws_logs as logs,
} from 'aws-cdk-lib';
import config from 'config';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

export function createLambdaSubscription(
  scope: Construct,
  customRole: iam.Role,
  subscriptionsTable: dynamodb.Table,
): lambda.Function {
  const lambdaName = `${config.get('name')}` + `-subscription`;
  const memorySize = parseInt(
    `${config.get('resources.lambda.subscription.memorySize')}`,
  );
  const handler = new lambda.Function(scope, lambdaName + '-lbd', {
    functionName: lambdaName,
    description: 'Blog subscription process',
    runtime: lambda.Runtime.NODEJS_18_X,
    memorySize: memorySize,
    timeout: Duration.seconds(30),
    role: customRole,
    code: lambda.Code.fromAsset(
      `${process.cwd()}/backend/api/runtime/subscription`,
      {},
    ),
    handler: 'index.handler',
    environment: {
      TABLE_SUBSCRIPTIONS: subscriptionsTable.tableName,
    },
    logRetention: logs.RetentionDays.INFINITE,
    retryAttempts: 0, // No async exec
    tracing: Tracing.DISABLED, // TODO: not enabled in Spain region yet
  });
  return handler;
}
