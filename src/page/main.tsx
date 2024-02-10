import ReactDOM from "react-dom/client";
import App from "../App";
import User from "../user";
import "../style.css";
import Provider from "../providers/provider";

const createReactApp = (
  userSubscribe: (onStoreChange: () => void) => () => void,
  getCurrentUser: () => User | undefined,
  updateUsername: (name: string) => void,
  handleStartCallback: () => void
) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
      <Provider
        userSubscribe={userSubscribe}
        getCurrentUser={getCurrentUser}
        updateUsername={updateUsername}
      >
        <App handleStartCallback={handleStartCallback} />
      </Provider>
    </>
  );
};

export default createReactApp;
