import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';

export function createRoleToLambdaContact(
  scope: Construct,
  policy: iam.ManagedPolicy,
): iam.Role {
  const roleName = `lbd-contact`;
  const role = new iam.Role(scope, roleName, {
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

  return role;
}
