import { App, Stack, StackProps } from 'aws-cdk-lib';

import {
  addCommentResource,
  addContactResource,
  addSubscriptionResource,
  createPublicApiGateway,
} from './resources/apigateway';
import {
  createDashboardOfLambdas,
  createLambdaAlarm,
} from './resources/cloudwatch';
import { createLambdaComment } from './resources/comment/lambda';
import { createRoleToLambdaComment } from './resources/comment/role';
import { createLambdaContact } from './resources/contact/lambda';
import { createPolicyToSesSendMail } from './resources/contact/policy';
import { createRoleToLambdaContact } from './resources/contact/role';
import {
  createTableComments,
  createTableSubscriptions,
} from './resources/dynamodb';
import { createTopicMyNotification } from './resources/sns';
import { createLambdaSubscription } from './resources/subscription/lambda';
import { createRoleToLambdaSubscription } from './resources/subscription/role';

export class BlogInfrastructureStack extends Stack {
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // const accountRegion = this.region;
    // const accountNumber = this.account;

    // DynamoDB tables
    const tableSubscriptions = createTableSubscriptions(this);
    const tableComments = createTableComments(this);

    // Create SNS topic to notify myself
    const topicMyNotification = createTopicMyNotification(this);

    // Lambda contact
    const policyToSesSendMail = createPolicyToSesSendMail(this);
    const roleToLambdaContact = createRoleToLambdaContact(
      this,
      policyToSesSendMail,
    );
    const lambdaContact = createLambdaContact(this, roleToLambdaContact);
    createLambdaAlarm(this, 'Contact', lambdaContact, topicMyNotification);

    // Save Subscription data Lambda
    const roleToLambdaSubscription = createRoleToLambdaSubscription(this);
    const lambdaSubscription = createLambdaSubscription(
      this,
      roleToLambdaSubscription,
      tableSubscriptions,
    );
    tableSubscriptions.grantReadWriteData(lambdaSubscription);
    createLambdaAlarm(
      this,
      'Subscription',
      lambdaSubscription,
      topicMyNotification,
    );

    // Save Comment data Lambda
    const roleToLambdaComment = createRoleToLambdaComment(this);
    const lambdaComment = createLambdaComment(
      this,
      roleToLambdaComment,
      tableComments,
    );
    tableComments.grantReadWriteData(lambdaComment);
    createLambdaAlarm(this, 'Comment', lambdaComment, topicMyNotification);

    // List of lambdas
    const lambdas = [];
    lambdas.push(lambdaContact);
    lambdas.push(lambdaSubscription);

    // Create dashboard
    createDashboardOfLambdas(this, lambdas);

    // API Gateway
    const apiRestPublicNetwork = createPublicApiGateway(this);
    addContactResource(apiRestPublicNetwork, lambdaContact);
    addSubscriptionResource(apiRestPublicNetwork, lambdaSubscription);
    addCommentResource(apiRestPublicNetwork, lambdaComment);
  }
}

// Create app
const app = new App();
const stackName = `blog-infrastructure`;
new BlogInfrastructureStack(app, stackName, {
  description: 'Infrastructure created for web blog',
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

// Create tags for all resources supported
// CdkTags.create(app);
