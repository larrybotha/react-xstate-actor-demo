import { Machine, assign, spawn } from "xstate";

import { alertMachine } from "./alert-machine";

const config = {
  id: "alerts-machine",

  context: {
    alerts: [],
    nextId: 0
  },

  initial: "initial",

  states: {
    initial: {}
  },

  on: {
    ADD_ALERT: {
      actions: [
        assign({
          nextId: ctx => ctx.nextId + 1,
          alerts: (ctx, { type, ...rest }) => {
            return ctx.alerts.concat({
              id: ctx.nextId,
              ref: spawn(
                alertMachine.withContext({ ...rest, id: ctx.nextId }),
                `alert-${ctx.nextId}`
              )
            });
          }
        })
      ]
    },

    REMOVE_ALERT: {
      actions: [
        assign({
          alerts: (ctx, event) => ctx.alerts.filter(({ id }) => id !== event.id)
        })
      ]
    }
  }
};

const alertsMachine = Machine(config);

export { alertsMachine };
