import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  Duration,
  aws_iam as iam,
  aws_dynamodb as dynamodb,
} from 'aws-cdk-lib';
import config from 'config';

export function createLambdaSubscription(
  scope: Construct,
  customRole: iam.Role,
  subscriptionsTable: dynamodb.Table,
): lambda.Function {
  const lambdaName = `subscription`;
  const memorySize = parseInt(
    `${config.get('resources.lambda.subscription.memorySize')}`,
  );

  const handler = new lambda.Function(scope, lambdaName, {
    functionName: lambdaName,
    description:
      'Subscription process (Storage data in Subscription table on DDB resource)',
    runtime: lambda.Runtime.NODEJS_14_X,
    memorySize: memorySize,
    timeout: Duration.seconds(30),
    role: customRole,
    code: lambda.Code.fromAsset(
      `${process.cwd()}/src/serverless/subscription`,
      {},
    ),
    handler: 'index.handler',
    environment: {
      TABLE_SUBSCRIPTIONS: subscriptionsTable.tableName,
    },
    logRetention: 7,
    retryAttempts: 0, // No async exec
  });
  return handler;
}
