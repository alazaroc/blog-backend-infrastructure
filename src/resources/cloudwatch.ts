import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  aws_sns as sns,
  aws_cloudwatch_actions as actions,
  Duration,
} from 'aws-cdk-lib';
import {
  Alarm,
  ComparisonOperator,
  Dashboard,
  LogQueryVisualizationType,
  LogQueryWidget,
  TreatMissingData,
} from 'aws-cdk-lib/aws-cloudwatch';

// Create one alarm by each lambda
export function createLambdaAlarm(
  scope: Construct,
  lambdaName: string,
  lambdaResource: lambda.Function,
  snsTopic: sns.Topic,
): void {
  const alarmName = `${lambdaName}-alarm`;
  const alarm = new Alarm(scope, alarmName, {
    alarmName: alarmName,
    alarmDescription: `Alarm of the lambda ${lambdaName}`,
    metric: lambdaResource.metricErrors({
      statistic: 'sum',
      period: Duration.days(1),
      label: 'Lambda failure rate',
    }),
    datapointsToAlarm: 1,
    evaluationPeriods: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    threshold: 0,
    treatMissingData: TreatMissingData.NOT_BREACHING,
  });
  alarm.addAlarmAction(new actions.SnsAction(snsTopic));
}

// Create one dashboard with all the lambda logs included (with "ERROR" messages)
export function createDashboardOfLambdas(
  scope: Construct,
  lambdas: lambda.Function[],
): Dashboard {
  const dashboardName = `lambda-errors`;
  const dashboard = new Dashboard(scope, dashboardName, {
    dashboardName: dashboardName,
  });

  const lambdaLogGroupNames = [];
  for (const lambdaResource of lambdas) {
    lambdaLogGroupNames.push(lambdaResource.logGroup.logGroupName);
  }

  dashboard.addWidgets(
    new LogQueryWidget({
      logGroupNames: lambdaLogGroupNames,
      title: 'Get the error messages in all the lambdas',
      height: 14, // Full screen
      width: 24,
      view: LogQueryVisualizationType.TABLE,
      // The lines will be automatically combined using '\n|'.
      queryLines: [
        'fields @timestamp, @message, @log',
        'sort @timestamp desc',
        'filter @message like "ERROR"',
        'limit 50',
      ],
    }),
  );

  return dashboard;
}
