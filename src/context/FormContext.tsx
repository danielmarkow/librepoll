import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

type ContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
  currentFieldId: string;
  setCurrentFieldId: Dispatch<SetStateAction<string>>;
  editFormFlag: boolean;
  setEditFormFlag: Dispatch<SetStateAction<boolean>>;
};

const FormContext = createContext<ContextType>({
  currentFormId: "",
  setCurrentFormId: () => {
    ("");
  },
  currentFieldId: "",
  setCurrentFieldId: () => {
    ("");
  },
  editFormFlag: false,
  setEditFormFlag: () => {
    ("");
  },
});

export { FormContext };
