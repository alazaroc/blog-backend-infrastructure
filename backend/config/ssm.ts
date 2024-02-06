import { Construct } from 'constructs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import config from 'config';

// Get SSM parameter
export function getSsmParameter(
  scope: Construct,
  parameterPath: string,
): string {
  const parameter = `${config.get(parameterPath)}`;
  const value = ssm.StringParameter.valueForStringParameter(scope, parameter);
  return value;
}

// Set SSM parameter
export function setSsmParameter(
  scope: Construct,
  parameterName: string,
  parameterValue: string,
  description: string,
): void {
  new ssm.StringParameter(scope, parameterName, {
    parameterName: parameterName,
    stringValue: parameterValue,
    description: description,
  });
}
