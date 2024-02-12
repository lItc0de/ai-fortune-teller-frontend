import ReactDOM from "react-dom/client";
import App from "../App";
import "../style.css";
import Provider from "../providers/provider";
import User from "../utils/user";
import { DBUser } from "../store";

const createReactApp = (
  detectionIdSubscribe: (onStoreChange: () => void) => () => void,
  getDetectionId: () => string | undefined,
  handleStartCallback: () => void,
  initialUsers: User[],
  updateUserInStore: (dbUser: Partial<DBUser> & { id: string }) => Promise<void>
) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
      <Provider
        detectionIdSubscribe={detectionIdSubscribe}
        getDetectionId={getDetectionId}
        initialUsers={initialUsers}
        updateUserInStore={updateUserInStore}
      >
        <App handleStartCallback={handleStartCallback} />
      </Provider>
    </>
  );
};

export default createReactApp;
