import { Construct } from 'constructs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import config from 'config';

// Get GitHub connection in a secure way from SSM Parameter Store
export function getMyGitHubConnectionFromSsmParameterStore(
  scope: Construct,
): string {
  const gitHubRepository = `${config.get('resources.ssm.gitHubRepository')}`;
  return ssm.StringParameter.valueForStringParameter(scope, gitHubRepository);
}

export function getSnsTopicFinalNotificationsFromSsmParameterStore(
  scope: Construct,
): string {
  const snsFinalNotifications = `${config.get(
    'resources.ssm.snsFinalNotifications',
  )}`;
  return ssm.StringParameter.valueForStringParameter(
    scope,
    snsFinalNotifications,
  );
}

export function getSnsTopicFormatPipelineFromSsmParameterStore(
  scope: Construct,
): string {
  const snsFormatPipeline = `${config.get('resources.ssm.snsFormatPipeline')}`;
  return ssm.StringParameter.valueForStringParameter(scope, snsFormatPipeline);
}
