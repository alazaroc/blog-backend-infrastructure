import { App, Tags } from 'aws-cdk-lib';
import { BlogInfrastructureStack } from './backend/blog-infrastructure-stack';
import { BlogPipelineStack } from './cicd/blog-pipeline-stack';
import config from 'config';

// Crate the app
const app = new App();

// Create blog-infrastructure stack
new BlogInfrastructureStack(app, 'blog-infrastructure', {
  description: 'Infrastructure created for web blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-south-2',
  },
  tags: {
    project: `${config.get('name')}`,
    type: 'backend',
    iac: 'cdk',
  },
});

// Create blog-pipeline stack
new BlogPipelineStack(app, 'blog-infrastructure-pipeline', {
  description: 'Infrastructure created for web blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    project: `${config.get('name')}`,
    type: 'pipeline',
    iac: 'cdk',
  },
});

// Create tags for all resources supported
Tags.of(app).add('project', 'blog-infrastructure');
Tags.of(app).add('type', 'blog-web');
Tags.of(app).add('iac', 'cdk');
