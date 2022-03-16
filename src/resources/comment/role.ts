import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';

export function createRoleToLambdaComment(scope: Construct): iam.Role {
  const roleName = `lbd-comment`;
  const role = new iam.Role(scope, roleName, {
    roleName: roleName,
    description: 'Lambda role used in comment function',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    ),
  );

  return role;
}
