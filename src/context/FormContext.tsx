import { Dispatch, SetStateAction, createContext } from "react";

type ContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
} | null;

const FormContext = createContext<ContextType>(null);

export { FormContext };
