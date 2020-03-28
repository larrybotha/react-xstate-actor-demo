import { Machine, sendParent } from "xstate";

const createTask = (duration = 4000) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
};

const config = {
  id: "task-machine",

  initial: "pending",

  context: {
    id: undefined,
    task: undefined
  },

  states: {
    pending: {
      entry: ["notifyParentStarted"],

      invoke: {
        src: "taskService",

        onDone: "success",

        onError: "failure"
      }
    },

    success: {
      entry: ["notifyParentSuccess", "notifyParentRemoveTask"]
    },

    failure: {
      type: "final",
      entry: ["notifyParentFailure", "notifyParentRemoveTask"]
    }
  }
};

const options = {
  actions: {
    notifyParentSuccess: sendParent(ctx => ({
      type: "CHILD_TASK.COMPLETED",
      ...ctx
    })),
    notifyParentFailure: sendParent(ctx => ({
      type: "CHILD_TASK.FAILED",
      ...ctx
    })),
    notifyParentStarted: sendParent(ctx => ({
      type: "CHILD_TASK.STARTED",
      ...ctx
    })),
    notifyParentRemoveTask: sendParent(ctx => ({
      type: "CHILD_TASK.REMOVE",
      id: ctx.id
    }))
  },

  services: {
    taskService: () => {
      const duration = Math.random() * 1000 + 4000;

      return createTask(duration);
    }
  }
};

const taskMachine = Machine(config, options);

export { taskMachine };
