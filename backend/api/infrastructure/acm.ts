// import { Construct } from 'constructs';
// import { aws_certificatemanager as acm } from 'aws-cdk-lib';
// import { getSsmBlogCertificateArn } from '../../config/ssm';

// export function loadCertificateResource(scope: Construct): acm.ICertificate {
//   // Load certificate
//   const certificate = acm.Certificate.fromCertificateArn(
//     scope,
//     'Certificate',
//     getSsmBlogCertificateArn(scope),
//   );

//   return certificate;
// }
