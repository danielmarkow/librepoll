import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

export default function PreRenderForm() {
  const { currentFormId, setCurrentFormId } = formHook()!;

  const getFormQuery = api.form.getForm.useQuery(
    { formId: currentFormId },
    {
      enabled: currentFormId !== null,
    }
  );

  return (
    <>
      <p>form previews</p>
      <p>currently working on: {currentFormId}</p>
      {getFormQuery.isSuccess && JSON.stringify(getFormQuery.data)}
    </>
  );
}
