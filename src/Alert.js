import React from "react";
import { useService } from "@xstate/react";

const Alert = ({ service }) => {
  const [state, send] = useService(service);
  const handleClick = () => send("DEACTIVATE");

  return (
    <div class="alert">
      <div>{state.context.text}</div>
      <br />
      <br />
      <button onClick={handleClick}>close notification</button>
    </div>
  );
};

export { Alert };
