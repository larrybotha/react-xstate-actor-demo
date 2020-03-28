import { Machine, sendParent, assign } from "xstate";

const config = {
  id: "alert-machine",

  context: {
    id: undefined,
    text: undefined,
    duration: undefined,
    created: undefined
  },

  initial: "active",

  states: {
    active: {
      entry: ["setCreatedDate"],

      after: {
        DEACTIVATE_DELAY: "inactive"
      },

      on: {
        DEACTIVATE: {
          target: "inactive"
        }
      }
    },

    inactive: {
      entry: ["notifyParent"]
    }
  }
};

const options = {
  actions: {
    setCreatedDate: assign({ created: new Date() }),
    notifyParent: sendParent(ctx => ({ type: "REMOVE_ALERT", id: ctx.id }))
  },
  delays: {
    DEACTIVATE_DELAY: ctx => ctx.duration || 3000
  }
};

const alertMachine = Machine(config, options);

export { alertMachine };
