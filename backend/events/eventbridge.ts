// import { Construct } from 'constructs';
// import { aws_dynamodb, aws_sns as sns } from 'aws-cdk-lib';
// import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
// import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

// // export function createTopicMyNotification(scope: Construct): sns.Topic {
// //   const topicName = `${config.get('name')}` + `-alarms`;
// //   const myKeyAlias = kms.Alias.fromAliasName(
// //     scope,
// //     'defaultKey',
// //     'alias/aws/sns',
// //   );
// //   const topic = new sns.Topic(scope, topicName + '-topic', {
// //     topicName: topicName,
// //     displayName: 'Topic to deliver notifications to myself',
// //     masterKey: myKeyAlias,
// //   });
// //   const personalEmail = getSsmPersonalEmail(scope);
// //   topic.addSubscription(new EmailSubscription(personalEmail));
// //   return topic;
// // }

// export function createPipe(scope: Construct, table: aws_dynamodb.Table): void {
//   //TODO:  EventBridge Pipes L2 construct is not ready
//   const cdcPipeRole = new Role(scope, 'CDCPipeRole', {
//     assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
//   });
//   table.grantStreamRead(cdcPipeRole);
//   // Creation of the Pipe
//   new CfnPipe(scope, 'CDCStreamPipe', {
//     name: 'CDCStreamPipe',
//     roleArn: cdcPipeRole.roleArn,
//     source: table.tableStreamArn!,
//     sourceParameters: {
//       dynamoDbStreamParameters: { batchSize: 10, startingPosition: 'LATEST' },
//     },
//     target: bus.eventBusArn,
//     targetParameters: {
//       eventBridgeEventBusParameters: {
//         source: PROJECT_SOURCE,
//         detailType: CDC_EVENT,
//       },
//     },
//   });
//   const bus = EventBus.fromEventBusName(this, 'DefaultBus', 'default');
//   bus.grantPutEventsTo(cdcPipeRole);
// }
