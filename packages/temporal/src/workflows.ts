import { CancellationScope, proxyActivities, sleep } from '@temporalio/workflow';
import { doSth } from '@project/core';
// Only import the activity types
import type * as activities from './activities';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string, time?: number): Promise<string> {
  await sleep('1m');
  const newName = doSth(name);
  return CancellationScope.nonCancellable( async() => {
    return await greet(newName, time);
  });
}
