import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb, RemovalPolicy } from 'aws-cdk-lib';
import config from 'config';

export function createTableSubscriptions(scope: Construct): dynamodb.Table {
  const tableName = `${config.get('name')}` + `-subscription`;
  const table = new dynamodb.Table(scope, tableName + '-db', {
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

export function createTableContact(scope: Construct): dynamodb.Table {
  const tableName = `${config.get('name')}` + `-contact`;
  const table = new dynamodb.Table(scope, tableName + '-db', {
    tableName: tableName,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.RETAIN,
    partitionKey: {
      name: 'name',
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
