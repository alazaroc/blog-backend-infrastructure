import { App } from 'aws-cdk-lib';
import { BlogInfrastructureStack } from './backend/blog-backend-infrastructure-stack';
import { BlogPipelineStack } from './cicd/blog-backend-pipeline-stack';
import config from 'config';

// Crate the app
const app = new App();

// Create blog-backend-infrastructure stack
new BlogInfrastructureStack(app, 'blog-backend-infrastructure', {
  description: 'Backend infrastructure for the blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    // region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    region: 'eu-west-1',
  },
  tags: {
    project: `${config.get('name')}`,
    type: 'backend',
    iac: 'cdk',
    repository: `${config.get('gitRepository')}`,
  },
});

// Create blog-backend-pipeline stack
new BlogPipelineStack(app, 'blog-backend-infrastructure-cicd', {
  description: 'CICD of the backend infrastructure',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    // region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    region: 'eu-west-1',
  },
  tags: {
    project: `${config.get('name')}-cicd`,
    type: 'pipeline',
    iac: 'cdk',
    repository: `${config.get('gitRepository')}`,
  },
});

// Create tags for all resources supported (both stacks)
// Tags.of(app).add('project', 'blog-backend-infrastructure');
// Tags.of(app).add('type', 'blog-web');
// Tags.of(app).add('iac', 'cdk');
// Tags.of(app).add('repository', 'blog-frontend-infrastructure-pipeline');
