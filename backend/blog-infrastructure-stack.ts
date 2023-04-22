import {
  App,
  Stack,
  StackProps,
  aws_certificatemanager as acm,
} from 'aws-cdk-lib';
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
import { createTopicMyNotification } from './monitoring/sns';
import { createLambdaSubscription } from './api/infrastructure/subscription/lambda';
import { createRoleToLambdaSubscription } from './api/infrastructure/subscription/role';
import config from 'config';

export class BlogInfrastructureStack extends Stack {
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // const accountRegion = this.region;
    // const accountNumber = this.account;

    // DynamoDB tables
    const tableSubscriptions = createTableSubscriptions(this);
    const tableContact = createTableContact(this);

    // Create SNS topic to notify myself
    const topicMyNotification = createTopicMyNotification(this);

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

    // Load certificate
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      `${config.get('resources.acm.webArn')}`,
    );

    // API Gateway
    const apiRestPublicNetwork = createPublicApiGateway(this, certificate);
    apiRestPublicNetwork.domainName?.addBasePathMapping(apiRestPublicNetwork);
    addContactResource(apiRestPublicNetwork, lambdaContact);
    addSubscriptionResource(apiRestPublicNetwork, lambdaSubscription);
  }
}
