import { useState } from "react";
import { FormContext } from "./FormContext";

export default function FormProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [currentFormId, setCurrentFormId] = useState<string>("");

  const value = {
    currentFormId,
    setCurrentFormId,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
