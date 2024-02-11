import { createContext } from "react";
import User from "../user";

export const UserContext = createContext<{
  user: User | undefined;
  updateUsername: (name: string) => void;
  updateImage: (image: Blob) => void;
  updateProfileQuestionsSelection: (selection: string[]) => void;
}>({
  user: undefined,
  updateUsername: () => {},
  updateImage: () => {},
  updateProfileQuestionsSelection: () => {},
});
