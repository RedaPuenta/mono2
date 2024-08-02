import { Workflow } from 'yoonite-saga/dist/types/workflow.type';

export abstract class Flow {
  public abstract build<Context>(params: Context): Workflow;
}
