import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

type ContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
  currentFieldId: string;
  setCurrentFieldId: Dispatch<SetStateAction<string>>;
  editFormFlag: boolean;
  setEditFormFlag: Dispatch<SetStateAction<boolean>>;
} | null;

const FormContext = createContext<ContextType>(null);

export { FormContext };
