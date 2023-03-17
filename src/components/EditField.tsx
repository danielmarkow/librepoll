import Button from "./common/Button";

import formHook from "~/hooks/formHook";

export default function EditField() {
  const { currentFieldId, setCurrentFieldId } = formHook()!;

  return (
    <>
      <p>edit field</p>

      <Button onClick={() => setCurrentFieldId("")}>Done</Button>
    </>
  );
}
