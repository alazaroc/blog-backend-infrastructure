import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';

export function createRoleToLambdaSubscription(scope: Construct): iam.Role {
  const roleName = `lbd-subscription`;
  const role = new iam.Role(scope, roleName, {
    roleName: roleName,
    description: 'Lambda role used in subscription function',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    ),
  );

  return role;
}
