import { Dispatch, SetStateAction, createContext } from "react";

const FormContext = createContext<{
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
} | null>(null);

export { FormContext };
