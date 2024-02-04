import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import StateProvider from "../stateProvider";
import User from "../user";
import "../style.css";

const createReactApp = (
  userSubscribe: (onStoreChange: () => void) => () => void,
  getCurrentUser: () => User | undefined,
  updateUsername: (name: string) => void,
  handleStartCallback: () => void
) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <StateProvider
        userSubscribe={userSubscribe}
        getCurrentUser={getCurrentUser}
        updateUsername={updateUsername}
      >
        <App handleStartCallback={handleStartCallback} />
      </StateProvider>
    </React.StrictMode>
  );
};

export default createReactApp;
