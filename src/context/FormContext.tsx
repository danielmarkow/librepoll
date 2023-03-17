import { Dispatch, SetStateAction, createContext } from "react";

type ContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
  currentFieldId: string;
  setCurrentFieldId: Dispatch<SetStateAction<string>>;
} | null;

const FormContext = createContext<ContextType>(null);

export { FormContext };
