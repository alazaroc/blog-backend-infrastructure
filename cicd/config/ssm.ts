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
