import { Construct } from 'constructs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import config from 'config';

// Get personal email in a secure way from SSM Parameter Store
export function getSsmPersonalEmail(scope: Construct): string {
  const personalEmailParam = `${config.get('resources.ssm.personalEmail')}`;
  const personalEmailValue = ssm.StringParameter.valueForStringParameter(
    scope,
    personalEmailParam,
  );
  return personalEmailValue;
}

// Get GitHub connection in a secure way from SSM Parameter Store
export function getMyGitHubConnectionFromSsmParameterStore(
  scope: Construct,
): string {
  return ssm.StringParameter.valueForStringParameter(
    scope,
    'github-connection-alazaroc-infrastructure',
  );
}
