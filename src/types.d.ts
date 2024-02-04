declare global {
  const cheetahEnabled: boolean;
  const speechSynthesisEnabled: boolean;
  const fastText: boolean;
}

export type Dimensions = {
  width: number;
  height: number;
  ratio: number;
};

export type Message = {
  user: string;
  timestamp: number;
  text: string;
};

export type GeneratorState = {
  done: boolean;
  state?: string;
};
