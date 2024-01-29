import { App, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { createCodePipeline } from './infrastructure/codepipeline';

export class BlogPipelineStack extends Stack {
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.addTags(props?.tags);

    createCodePipeline(this, this.account, this.region);
  }

  private addTags(tags?: { [key: string]: string }) {
    if (tags) {
      for (const [key, value] of Object.entries(tags)) {
        Tags.of(this).add(key, value);
      }
    }
  }
}
