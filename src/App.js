import React from "react";
import { useMachine, useService } from "@xstate/react";
import "./styles.css";

import { appMachine } from "./machines/app-machine";

import { Task } from "./Task";
import { Alert } from "./Alert";

export default function App() {
  const [state] = useMachine(appMachine);
  const [alertsState] = useService(state.context.alertsRef);
  const [tasksState, sendToTasks] = useService(state.context.tasksRef);
  const handleSubmit = ev => {
    ev.preventDefault();
    const task = [...ev.currentTarget.elements].find(el => el.name === "task")
      .value;

    sendToTasks("ADD_TASK", { task });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input name="task" type="text" value="A long-running task" />
        <button type="submit">create new task</button>
      </form>

      <div class="content">
        <div>
          <h2>tasks</h2>

          {tasksState.context.tasks.map(task => (
            <Task service={task.ref} key={task.id} />
          ))}
        </div>

        <div>
          <h2>notifications</h2>

          {alertsState.context.alerts.map(alert => (
            <Alert service={alert.ref} key={alert.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
