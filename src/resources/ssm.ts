import { Construct } from 'constructs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import config from 'config';

export function getSsmPersonalEmail(scope: Construct): string {
  const personalEmailParam = `${config.get(
    'infrastructure.services.ssm.personalEmail',
  )}`;
  const personalEmailValue = ssm.StringParameter.valueForStringParameter(
    scope,
    personalEmailParam,
  );
  return personalEmailValue;
}
