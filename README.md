# React, Xstate, Actors demo

An example of a simple React app built with Xstate using the actor model to communicate between machines.

[View in codesandbox.io](https://codesandbox.io/s/github/larrybotha/react-xstate-actor-demo)

There are 5 machines that are interacting to simulate a real-world use-case:

- app machine:
  - spawns a single alertsRef and tasksRef actor
  - accepts ALERT.ADD events, sending the event to the alertsRef actor
- alerts machine
  - maintains a list of alerts, each spawned from an alert machine
  - alert machines are spawned in response to ADD_ALERT events that the app machine sends
- single alert machine
  - contains the state for a single alert
  - automatically removes itself after a configurable duration
- tasks machine
  - maintains a list of spawned task actors
  - allows for new tasks to be created
  - responds to events emitted from each task by sending ALERT.ADD events to the parent app machine based on whether the task has started, resolved, or failed
- single task machine
  - invokes a Promise to simulate a request
  - sends the tasks machine an event based on the status of the request
