import { Construct } from 'constructs';
import { aws_sns as sns, aws_kms as kms } from 'aws-cdk-lib';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { getSsmPersonalEmail } from '../../backend/config/ssm';
import config from 'config';

export function createTopicMyNotification(scope: Construct): sns.Topic {
  const topicName = `${config.get('name')}` + `-alarms`;
  const myKeyAlias = kms.Alias.fromAliasName(
    scope,
    'defaultKey',
    'alias/aws/sns',
  );
  const topic = new sns.Topic(scope, topicName + '-topic', {
    topicName: topicName,
    displayName: 'Topic to deliver notifications to myself',
    masterKey: myKeyAlias,
  });
  const personalEmail = getSsmPersonalEmail(scope);
  topic.addSubscription(new EmailSubscription(personalEmail));
  return topic;
}
