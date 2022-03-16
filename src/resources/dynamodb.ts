import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb, RemovalPolicy } from 'aws-cdk-lib';

export function createTableSubscriptions(scope: Construct): dynamodb.Table {
  const tableName = `subscriptions`;
  const table = new dynamodb.Table(scope, tableName, {
    tableName: tableName,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.RETAIN,
    partitionKey: {
      name: 'email',
      type: dynamodb.AttributeType.STRING,
    },
    pointInTimeRecovery: true,
  });
  return table;
}

export function createTableComments(scope: Construct): dynamodb.Table {
  const tableName = `comments`;
  const table = new dynamodb.Table(scope, tableName, {
    tableName: tableName,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.RETAIN,
    partitionKey: {
      name: 'title',
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: 'date',
      type: dynamodb.AttributeType.STRING,
    },
    pointInTimeRecovery: true,
  });
  return table;
}
