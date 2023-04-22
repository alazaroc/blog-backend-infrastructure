import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';
import config from 'config';

export function createPolicyToSesSendEmail(
  scope: Construct,
): iam.ManagedPolicy {
  const policyName = `${config.get('name')}` + `-ses-send-email`;
  const policyToGenerateDocumentation = new iam.ManagedPolicy(
    scope,
    policyName + '-policy',
    {
      managedPolicyName: policyName,
      description: 'Create policy to set SES SendEmail permission',
    },
  );
  policyToGenerateDocumentation.addStatements(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['ses:SendEmail'],
    }),
  );
  return policyToGenerateDocumentation;
}
