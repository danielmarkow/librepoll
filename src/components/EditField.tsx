import { api } from "~/utils/api";
import Button from "./common/Button";

import formHook from "~/hooks/formHook";

export default function EditField() {
  const { currentFieldId, setCurrentFieldId } = formHook()!;

  const getFieldQuery = api.field.getField.useQuery(
    {
      fieldId: currentFieldId,
    },
    {
      enabled: currentFieldId !== "",
    }
  );

  return (
    <>
      <p>edit field</p>
      {getFieldQuery.isSuccess && JSON.stringify(getFieldQuery.data)}
      <Button onClick={() => setCurrentFieldId("")}>Done</Button>
    </>
  );
}
