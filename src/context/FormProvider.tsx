import { useState } from "react";
import { FormContext } from "./FormContext";

export default function FormProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [currentFormId, setCurrentFormId] = useState<string>("");
  const [currentFieldId, setCurrentFieldId] = useState<string>("");

  const [editFormFlag, setEditFormFlag] = useState<boolean>(false);

  const value = {
    currentFormId,
    setCurrentFormId,
    currentFieldId,
    setCurrentFieldId,
    editFormFlag,
    setEditFormFlag,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
