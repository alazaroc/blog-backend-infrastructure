import { Construct } from 'constructs';
import { aws_iam } from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import {
  getMyGitHubConnectionFromSsmParameterStore,
  getSnsTopicFormatPipelineFromSsmParameterStore,
} from '../config/ssm';
import config from 'config';
import * as codestar_notifications from 'aws-cdk-lib/aws-codestarnotifications';
import { Topic } from 'aws-cdk-lib/aws-sns';

export function createCodePipeline(
  scope: Construct,
  account: string,
  region: string,
): void {
  const name = `${config.get('name')}`;

  // Create an S3 bucket to store pipeline artifacts
  const artifactBucket = s3.Bucket.fromBucketName(
    scope,
    'cicdBucket',
    `${config.get('resources.s3.cicd')}-${account}-${region}`,
  );

  // Create the source action
  const sourceOutput = new codepipeline.Artifact();
  const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction(
    {
      actionName: 'Source',
      connectionArn: getMyGitHubConnectionFromSsmParameterStore(scope),
      owner: 'alazaroc',
      repo: 'blog-backend-infrastructure',
      branch: 'main',
      output: sourceOutput,
    },
  );

  // Create the build action
  // const buildOutput = new codepipeline.Artifact();
  const buildProject = new codebuild.PipelineProject(scope, name, {
    projectName: name + '-build',
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        build: {
          commands: [
            'npm ci',
            'npx cdk deploy blog-backend-infrastructure --require-approval never',
          ],
        },
      },
      artifacts: {
        files: ['**/*'],
      },
    }),
    description: 'Build phase for blog-backend-infrastructure resources',
    environment: {
      computeType: codebuild.ComputeType.SMALL,
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4,
    },
  });
  buildProject.addToRolePolicy(
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
  );
  const buildAction = new codepipeline_actions.CodeBuildAction({
    actionName: 'Build',
    input: sourceOutput,
    // outputs: [buildOutput],
    project: buildProject,
  });

  // Create the pipeline
  const pipeline = new codepipeline.Pipeline(scope, name + '-pipeline', {
    pipelineName: name,
    stages: [
      {
        stageName: 'Source',
        actions: [sourceAction],
      },
      {
        stageName: 'Build',
        actions: [buildAction],
      },
    ],
    artifactBucket,
    restartExecutionOnUpdate: true,
  });

  // Notifications
  new codestar_notifications.NotificationRule(scope, 'MyNotificationRule', {
    source: pipeline,
    events: [
      'codepipeline-pipeline-pipeline-execution-succeeded',
      'codepipeline-pipeline-pipeline-execution-failed',
      'codepipeline-pipeline-pipeline-execution-canceled',
      'codepipeline-pipeline-pipeline-execution-superseded',
      'codepipeline-pipeline-pipeline-execution-resumed',
    ],
    targets: [
      Topic.fromTopicArn(
        scope,
        'mySnsTopic',
        getSnsTopicFormatPipelineFromSsmParameterStore(scope),
      ),
    ],
  });
}
