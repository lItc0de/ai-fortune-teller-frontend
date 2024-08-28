import Video from "./video";
import { AnimationStateId } from "../constants";

const VIDEO1 = `${import.meta.env.VITE_VIDEO_LINK}newSession1.webm`;
const VIDEO2 = `${import.meta.env.VITE_VIDEO_LINK}newSession2.webm`;
const VIDEO3 = `${import.meta.env.VITE_VIDEO_LINK}newSession3.webm`;
const VIDEO4 = `${import.meta.env.VITE_VIDEO_LINK}newSession4.webm`;

const Player: React.FC = () => {
  return (
    <>
      <Video src={VIDEO1} videoStateId={AnimationStateId.NEW_SESSION_1} />
      <Video src={VIDEO2} videoStateId={AnimationStateId.NEW_SESSION_2} />
      <Video src={VIDEO3} videoStateId={AnimationStateId.NEW_SESSION_3} />
      <Video src={VIDEO4} videoStateId={AnimationStateId.NEW_SESSION_4} />
    </>
  );
};

export default Player;
