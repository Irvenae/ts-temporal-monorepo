import { Worker } from '@temporalio/worker';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { defaultWorkerOptions } from 'worker';
import { example } from 'workflows';

const taskQueue = 'hello';

describe('Test hello world workflow with test framework.', () => {
    let worker: Worker;
    let workerRunning: Promise<void>;
    let temporalTestEnv: TestWorkflowEnvironment;
    beforeAll(async () => {
        temporalTestEnv = await TestWorkflowEnvironment.createTimeSkipping();
        worker = await Worker.create({
        ...defaultWorkerOptions(temporalTestEnv.client.workflow),
        connection: temporalTestEnv.nativeConnection,
        taskQueue,
        });
        workerRunning = worker.run(); // Do not await, because we will shut it down after the test.
    }, 1000 * 60);
    afterAll(async () => {
        worker.shutdown();
        await workerRunning; // Wait for shutdown.
        await temporalTestEnv.teardown();
    });
    it(
        'Run test.',
        async () => {
            const workflowId = 'test-hello-test-framework';
            const client = temporalTestEnv.client.workflow;
            
            const res = await client.execute(example, {
                taskQueue,
                workflowId,
                args: ["test"]
            });

            expect(res).toBe("Hello, testconcat!");
        },
        1000 * 100
    );
});