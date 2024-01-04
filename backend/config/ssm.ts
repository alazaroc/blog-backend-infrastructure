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

// Get blogCertificateArn config value
export function getSsmBlogCertificateArn(scope: Construct): string {
  const blogCertificateArnParam = `${config.get(
    'resources.ssm.blogCertificateArn',
  )}`;
  const blogCertificateArnValue = ssm.StringParameter.valueForStringParameter(
    scope,
    blogCertificateArnParam,
  );
  return blogCertificateArnValue;
}
