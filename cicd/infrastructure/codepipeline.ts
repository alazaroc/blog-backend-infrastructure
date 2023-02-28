import { Construct } from 'constructs';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from 'aws-cdk-lib/pipelines';
import { aws_iam } from 'aws-cdk-lib';
import { getMyGitHubConnectionFromSsmParameterStore } from '../../cicd/config/ssm';
import config from 'config';

export function createCodePipeline(scope: Construct): void {
  const name = `${config.get('name')}`;
  new CodePipeline(scope, name + '-pipeline', {
    pipelineName: name,
    // synth: new ShellStep('Deploy', {
    synth: new CodeBuildStep('Deploy', {
      projectName: name,
      // input: CodePipelineSource.gitHub('alazaroc/aws-cdk-pipeline', 'main'),
      input: CodePipelineSource.connection(
        'alazaroc/blog-infrastructure',
        'main',
        {
          connectionArn: getMyGitHubConnectionFromSsmParameterStore(scope),
        },
      ),
      commands: [
        'npm ci',
        // 'npm run build',
        'npx cdk deploy blog-infrastructure',
      ],
      rolePolicyStatements: [
        new aws_iam.PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'iam:ResourceTag/aws-cdk:bootstrap-role': [
                'lookup',
                'image-publishing',
                'file-publishing',
                'deploy',
              ],
            },
          },
        }),
      ],
    }),
    selfMutation: false,
  });
}
