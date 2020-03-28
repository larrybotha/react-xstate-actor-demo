import React from "react";
import { useService } from "@xstate/react";

const Task = ({ service }) => {
  const [state] = useService(service);

  return (
    <div class="task">
      {state.context.task}
      <br />
      <br />
      <small>status: {state.value}</small>
    </div>
  );
};

export { Task };
