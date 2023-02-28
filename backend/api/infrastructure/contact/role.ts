import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';
import config from 'config';

export function createRoleToLambdaContact(
  scope: Construct,
  policy: iam.ManagedPolicy,
): iam.Role {
  const roleName = `${config.get('name')}` + `-contact-lbd`;
  const role = new iam.Role(scope, roleName + '-role', {
    roleName: roleName,
    description: 'Lambda role used in contact function',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  // Basic execution role
  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    ),
  );
  role.addManagedPolicy(policy);

  // add managed policy with custom permission
  const sendEmailPermission = new iam.PolicyStatement({
    actions: ['ses:SendEmail'],
    resources: ['*'],
  });
  role.addToPolicy(sendEmailPermission);

  return role;
}
