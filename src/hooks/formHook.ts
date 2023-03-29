import type { Dispatch, SetStateAction } from "react";
import { useContext } from "react";

import { FormContext } from "~/context/FormContext";

type FormContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
  currentFieldId: string;
  setCurrentFieldId: Dispatch<SetStateAction<string>>;
  editFormFlag: boolean;
  setEditFormFlag: Dispatch<SetStateAction<boolean>>;
};

export default function formHook() {
  // eslint-disable-next-line
  return useContext<FormContextType>(FormContext);
}
