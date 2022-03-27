import { App, Tags } from 'aws-cdk-lib';
import { BlogInfrastructureStack } from './blog-infrastructure-stack';
import { BlogPipelineStack } from './blog-pipeline-stack';

// Crate the app
const app = new App();

// Create blog-infrastructure stack
new BlogInfrastructureStack(app, 'blog-infrastructure', {
  description: 'Infrastructure created for web blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

// Create blog-pipeline stack
new BlogPipelineStack(app, 'blog-infrastructure-pipeline', {
  description: 'Infrastructure created for web blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

// Create tags for all resources supported
Tags.of(app).add('app', 'blog-infrastructure');
