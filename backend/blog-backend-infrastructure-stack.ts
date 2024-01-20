import { App, Stack, StackProps, Tags } from 'aws-cdk-lib';
import {
  addContactResource,
  addSubscriptionResource,
  createPublicApiGateway,
} from './api/infrastructure/apigateway';
import {
  createDashboardOfLambdas,
  createLambdaAlarm,
} from './monitoring/cloudwatch';
import { createLambdaContact } from './api/infrastructure/contact/lambda';
import { createPolicyToSesSendEmail } from './api/infrastructure/contact/policy';
import { createRoleToLambdaContact } from './api/infrastructure/contact/role';
import {
  createTableContact,
  createTableSubscriptions,
} from './database/dynamodb';
import { createLambdaSubscription } from './api/infrastructure/subscription/lambda';
import { createRoleToLambdaSubscription } from './api/infrastructure/subscription/role';
import { loadCertificateResource } from './api/infrastructure/acm';
import { retrieveTopicMyNotification } from './monitoring/sns';

export class BlogInfrastructureStack extends Stack {
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set custom tags
    if (props?.tags) {
      for (const [key, value] of Object.entries(props.tags))
        Tags.of(this).add(key, value);
    }

    // const accountRegion = this.region;
    // const accountNumber = this.account;

    // DynamoDB tables
    const tableSubscriptions = createTableSubscriptions(this);
    const tableContact = createTableContact(this);

    // Create SNS topic to notify myself
    const topicMyNotification = retrieveTopicMyNotification(this);

    // Lambda contact
    const policyToSesSendEmail = createPolicyToSesSendEmail(this);
    const roleToLambdaContact = createRoleToLambdaContact(
      this,
      policyToSesSendEmail,
    );
    const lambdaContact = createLambdaContact(
      this,
      roleToLambdaContact,
      tableContact,
    );
    tableContact.grantReadWriteData(lambdaContact);
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

    // List of lambdas
    const lambdas = [];
    lambdas.push(lambdaContact);
    lambdas.push(lambdaSubscription);

    // Create dashboard
    createDashboardOfLambdas(this, lambdas);

    // Create certificate
    const certificate = loadCertificateResource(this);

    // API Gateway
    const apiRestPublicNetwork = createPublicApiGateway(this, certificate);
    apiRestPublicNetwork.domainName?.addBasePathMapping(apiRestPublicNetwork);
    addContactResource(apiRestPublicNetwork, lambdaContact);
    addSubscriptionResource(apiRestPublicNetwork, lambdaSubscription);
  }
}
