import { Machine, assign, spawn, send } from "xstate";

import { alertsMachine } from "./alerts-machine";
import { tasksMachine } from "./tasks-machine";

const config = {
  id: "app-machine",

  context: {
    alertsRef: undefined,
    tasksRef: undefined
  },

  initial: "initializing",

  states: {
    initializing: {
      entry: ["initializeAlerts", "initializeTasks"]
    }
  },

  on: {
    "ALERT.ADD": {
      actions: ["addAlert"]
    }
  }
};

const options = {
  actions: {
    addAlert: send((_, { type, ...rest }) => ({ type: "ADD_ALERT", ...rest }), {
      to: ctx => ctx.alertsRef
    }),

    initializeAlerts: assign(context => ({
      ...context,
      alertsRef: spawn(alertsMachine, "alerts")
    })),
    initializeTasks: assign(context => ({
      ...context,
      tasksRef: spawn(tasksMachine, "tasks")
    }))
  }
};

const appMachine = Machine(config, options);

export { appMachine };
