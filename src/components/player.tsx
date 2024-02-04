import Video from "./video";

import newSession1Video from "../media/newSession1.webm";
import newSession2Video from "../media/newSession2.webm";
import newSession3Video from "../media/newSession3.webm";
import newSession4Video from "../media/newSession4.webm";
import { AnimationStateId } from "../constants";

const Player: React.FC = () => {
  return (
    <>
      <Video
        src={newSession1Video}
        videoStateId={AnimationStateId.NEW_SESSION_1}
      />
      <Video
        src={newSession2Video}
        videoStateId={AnimationStateId.NEW_SESSION_2}
      />
      <Video
        src={newSession3Video}
        videoStateId={AnimationStateId.NEW_SESSION_3}
      />
      <Video
        src={newSession4Video}
        videoStateId={AnimationStateId.NEW_SESSION_4}
      />
    </>
  );
};

export default Player;
