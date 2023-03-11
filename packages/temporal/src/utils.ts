import { WorkflowClient } from '@temporalio/client';
import { temporal } from '@temporalio/proto';

export async function terminateRunningTestWorkflow(client: WorkflowClient, workflowId: string) {
    const handle = client.getHandle(workflowId);
    try {
        if (
            (await handle.describe()).status.code ===
            temporal.api.enums.v1.WorkflowExecutionStatus.WORKFLOW_EXECUTION_STATUS_RUNNING
        ) {
            await handle.terminate('Starting new test');
        }
    } catch (err) {
        console.log("Workflow does not need to be terminated");
    } // When workflow not found, WorkflowNotFoundError will be thrown.
}