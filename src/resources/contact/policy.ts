import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';

export function createPolicyToSesSendMail(scope: Construct): iam.ManagedPolicy {
  const policyName = `sesSendMail`;
  const policyToGenerateDocumentation = new iam.ManagedPolicy(
    scope,
    policyName,
    {
      managedPolicyName: policyName,
      description: 'Create policy to set SES SendMail permission',
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
