import { Context } from '@temporalio/activity';

export async function greet(name: string, time?: number): Promise<string> {
  if(time) {
    console.log("running activity with sleep time");
    await Context.current().sleep(time);
  }
  return `Hello, ${name}!`;
}
