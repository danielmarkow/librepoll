import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

import PreRenderField from "./PreRenderField";

export default function PreRenderForm() {
  const { currentFormId, setCurrentFormId } = formHook()!;

  const { data, isSuccess } = api.form.getForm.useQuery(
    { formId: currentFormId },
    {
      enabled: currentFormId !== null,
    }
  );

  return (
    <>
      <p>form previews</p>
      <p>currently working on: {currentFormId}</p>
      {isSuccess && (
        <>
          <h1 className="text-xl">{data!.name}</h1>
          {data?.fields.map((field) => (
            <PreRenderField field={field} />
          ))}
        </>
      )}
      {isSuccess && JSON.stringify(data)}
    </>
  );
}
