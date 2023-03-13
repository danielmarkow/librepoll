import { useContext, Dispatch, SetStateAction } from "react";

import { FormContext } from "~/context/FormContext";

type FormContextType = {
  currentFormId: string;
  setCurrentFormId: Dispatch<SetStateAction<string>>;
} | null;

export default function formHook() {
  return useContext<FormContextType>(FormContext);
}
