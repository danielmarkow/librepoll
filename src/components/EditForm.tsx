import Button from "./common/Button";
import formHook from "~/hooks/formHook";

export default function EditForm() {
  const { setEditFormFlag } = formHook()!;

  return (
    <>
      <p>edit form</p>
      <Button onClick={() => void setEditFormFlag(false)}>Done</Button>
    </>
  );
}
