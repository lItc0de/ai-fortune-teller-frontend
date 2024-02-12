import ReactDOM from "react-dom/client";
import App from "../App";
import "../style.css";
import Provider from "../providers/provider";

const createReactApp = (
  detectionIdSubscribe: (onStoreChange: () => void) => () => void,
  getDetectionId: () => string | undefined,
  handleStartCallback: () => void
) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
      <Provider
        detectionIdSubscribe={detectionIdSubscribe}
        getDetectionId={getDetectionId}
      >
        <App handleStartCallback={handleStartCallback} />
      </Provider>
    </>
  );
};

export default createReactApp;
