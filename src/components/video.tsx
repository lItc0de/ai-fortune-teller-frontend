import { useContext, useEffect, useRef } from "react";
import styles from "./video.module.css";
import { StateContext } from "../stateProvider";
import { NEXT_STATE_ID_MAP, StateId } from "../constants";

type Props = {
  src: string;
  videoStateId: StateId;
};

const Video: React.FC<Props> = ({ src, videoStateId }) => {
  const { stateId, setStateId } = useContext(StateContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoStateId === undefined || stateId === undefined) return;
    if (videoStateId !== stateId) return;
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      const nextStateId = NEXT_STATE_ID_MAP.get(stateId);
      if (nextStateId !== undefined) setStateId(nextStateId);
    };
    video.addEventListener("ended", handleEnded);
    video.play();

    () => {
      video.removeEventListener("ended", handleEnded);
      video.pause();
      video.currentTime = 0;
    };
  }, [videoStateId, stateId, setStateId]);

  return (
    <video
      id={`video${videoStateId}`}
      src={src}
      ref={videoRef}
      className={styles.video}
    ></video>
  );
};

export default Video;
