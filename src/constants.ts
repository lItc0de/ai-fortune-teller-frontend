export enum AnimationStateId {
  IDLE,
  NEW_SESSION_1,
  NEW_SESSION_2,
  NEW_SESSION_3,
  NEW_SESSION_4,
  WELCOME_OLD_USER,
  FORTUNE_TELLER,
}

export enum SessionStateId {
  NO_SESSION,
  NEW_SESSION,
  WELCOME_OLD_USER,
  NAME_FINDING,
  PROFILE_QUESTIONS,
  PROFILE,
  FORTUNE_SELECTION,
  FORTUNE_TELLER,
  END_SESSION,
}

export const ANIMATION_MAP = new Map<AnimationStateId, AnimationStateId>();
ANIMATION_MAP.set(
  AnimationStateId.NEW_SESSION_1,
  AnimationStateId.NEW_SESSION_2
);
ANIMATION_MAP.set(
  AnimationStateId.NEW_SESSION_2,
  AnimationStateId.NEW_SESSION_3
);
ANIMATION_MAP.set(
  AnimationStateId.NEW_SESSION_3,
  AnimationStateId.NEW_SESSION_4
);

export const FORTUNE_TELLER_USER = "Fortune Teller";
