import { Construct } from 'constructs';
import { aws_sns as sns } from 'aws-cdk-lib';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { getSsmPersonalEmail } from './ssm';

export function createTopicMyNotification(scope: Construct): sns.Topic {
  const topicName = `myTopicNotification`;
  const topic = new sns.Topic(scope, topicName, {
    topicName: topicName,
    displayName: 'Topic to deliver notifications to myself',
  });
  const personalEmail = getSsmPersonalEmail(scope);
  topic.addSubscription(new EmailSubscription(personalEmail));
  return topic;
}
