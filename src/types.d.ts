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
  isFortuneTeller: boolean;
  timestamp: number;
  isInput: boolean;
  text?: string;
  onSubmit?: (value: string) => void;
};

export type GeneratorState = {
  done: boolean;
  value?: string;
};
