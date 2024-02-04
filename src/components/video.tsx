import { useContext, useEffect, useRef } from "react";
import styles from "./video.module.css";
import { StateContext } from "../stateProvider";
import { ANIMATION_MAP, AnimationStateId } from "../constants";

type Props = {
  src: string;
  videoStateId: AnimationStateId;
};

const Video: React.FC<Props> = ({ src, videoStateId }) => {
  const { animationStateId, setAnimationStateId } = useContext(StateContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoStateId === undefined || animationStateId === undefined) return;
    if (videoStateId !== animationStateId) return;
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      const nextStateId = ANIMATION_MAP.get(animationStateId);
      if (nextStateId !== undefined) setAnimationStateId(nextStateId);
    };
    video.addEventListener("ended", handleEnded);
    video.play();

    () => {
      video.removeEventListener("ended", handleEnded);
      video.pause();
      video.currentTime = 0;
    };
  }, [videoStateId, animationStateId, setAnimationStateId]);

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
