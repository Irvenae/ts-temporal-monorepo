import path from 'path';
import type { Configuration as WebpackConfiguration } from 'webpack';

import { Context } from '@temporalio/activity';
import { WorkflowClient } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import * as activities from 'activities';
import { ActivityInboundInterceptor } from 'activityInterceptor';

export function defaultWorkerOptions(client: WorkflowClient) {
    return {
      workflowsPath: require.resolve('./workflows'),
      activities,
      shutdownGraceTime: '10s',
      debugMode: true,
      bundlerOptions: {
        webpackConfigHook: (config: WebpackConfiguration) => {
          if (!config.resolve) config.resolve = {};
          if (config.resolve.modules && config.resolve.modules.length > 0) {
            config.resolve.modules.push(path.resolve(__dirname, '../'));
          } else {
            config.resolve.modules = [path.resolve(__dirname, '../')];
          }
          console.log(config);
          return config;
        }
      },
      interceptors: {
        activityInbound: [(ctx: Context) => new ActivityInboundInterceptor(ctx, client)]
      },
    };
  }

export async function createWorker(taskQueue: string, client: WorkflowClient) {
  return await Worker.create({
    ...defaultWorkerOptions(client),
    taskQueue
  });
}