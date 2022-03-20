import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  Duration,
  aws_iam as iam,
  aws_dynamodb as dynamodb,
} from 'aws-cdk-lib';
import config from 'config';

export function createLambdaComment(
  scope: Construct,
  customRole: iam.Role,
  commentsTable: dynamodb.Table,
): lambda.Function {
  const lambdaName = `comment`;
  const memorySize = parseInt(
    `${config.get('resources.lambda.comment.memorySize')}`,
  );

  const handler = new lambda.Function(scope, lambdaName, {
    functionName: lambdaName,
    description:
      'Comment process (Storage data in Comments table on DDB resource)',
    runtime: lambda.Runtime.NODEJS_14_X,
    memorySize: memorySize,
    timeout: Duration.seconds(30),
    role: customRole,
    code: lambda.Code.fromAsset(`${process.cwd()}/src/serverless/comment`, {}),
    handler: 'index.handler',
    environment: {
      TABLE_COMMENTS: commentsTable.tableName,
    },
    logRetention: 7,
    retryAttempts: 0, // No async exec
  });
  return handler;
}
