import { Machine, sendParent, assign, spawn } from "xstate";

import { taskMachine } from "./task-machine";

const config = {
  id: "tasks-machine",

  initial: "active",

  context: {
    nextId: 0,
    tasks: []
  },

  states: {
    active: {}
  },

  on: {
    ADD_TASK: {
      actions: ["createTask"]
    },
    "CHILD_TASK.REMOVE": {
      actions: ["removeTask"]
    },
    "CHILD_TASK.COMPLETED": {
      actions: ["notifyParentTaskCompleted"]
    },
    "CHILD_TASK.FAILED": {
      actions: ["notifyParentTaskTailed"]
    },
    "CHILD_TASK.STARTED": {
      actions: ["notifyParentTaskStarted"]
    }
  }
};

const options = {
  actions: {
    createTask: assign({
      nextId: ctx => ctx.nextId + 1,
      tasks: (ctx, { type, ...rest }) =>
        ctx.tasks.concat({
          id: ctx.nextId,
          ref: spawn(taskMachine.withContext({ id: ctx.nextId, ...rest }))
        })
    }),
    removeTask: assign({
      tasks: (ctx, { id }) => ctx.tasks.filter(task => task.id !== id)
    }),

    notifyParentTaskCompleted: sendParent((_, { task }) => ({
      type: "ALERT.ADD",
      text: `task completed: ${task}`
    })),

    notifyParentTaskFailed: sendParent((_, { task }) => ({
      type: "ALERT.ADD",
      text: `task failed: ${task}`
    })),

    notifyParentTaskStarted: sendParent((_, { task }) => ({
      type: "ALERT.ADD",
      text: `task started: ${task}`
    }))
  }
};

const tasksMachine = Machine(config, options);

export { tasksMachine };
