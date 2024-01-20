import { Construct } from 'constructs';
import { aws_sns as sns } from 'aws-cdk-lib';
import { getSnsTopicFinalNotificationsFromSsmParameterStore } from '../../cicd/config/ssm';

// export function createTopicMyNotification(scope: Construct): sns.Topic {
//   const topicName = `${config.get('name')}` + `-alarms`;
//   const myKeyAlias = kms.Alias.fromAliasName(
//     scope,
//     'defaultKey',
//     'alias/aws/sns',
//   );
//   const topic = new sns.Topic(scope, topicName + '-topic', {
//     topicName: topicName,
//     displayName: 'Topic to deliver notifications to myself',
//     masterKey: myKeyAlias,
//   });
//   const personalEmail = getSsmPersonalEmail(scope);
//   topic.addSubscription(new EmailSubscription(personalEmail));
//   return topic;
// }

export function retrieveTopicMyNotification(scope: Construct): sns.ITopic {
  const topicArn = getSnsTopicFinalNotificationsFromSsmParameterStore(scope);
  const itopic = sns.Topic.fromTopicArn(
    scope, // assuming `this` is your Deployment Stack object.
    'myTopicId',
    topicArn,
  );
  return itopic;
}
