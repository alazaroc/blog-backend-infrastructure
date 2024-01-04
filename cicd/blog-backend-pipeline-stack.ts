import { App, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { createCodePipeline } from './infrastructure/codepipeline';

export class BlogPipelineStack extends Stack {
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set custom tags
    if (props?.tags) {
      for (const [key, value] of Object.entries(props.tags))
        Tags.of(this).add(key, value);
    }

    createCodePipeline(this, this.account, this.region);
  }
}
