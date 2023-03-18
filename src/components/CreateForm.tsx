import { z } from "zod";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import CreateField from "./CreateField";
import Divider from "./common/Divider";
import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import EditField from "./EditField";
import EditForm from "./EditForm";
import CreateFormForm from "./common/CreateFormForm";

const formSchema = z.object({ formName: z.string().min(5) });

export default function CreateForm() {
  // TODO figure out a way so that typescript does not want the "!"
  const { currentFormId, setCurrentFormId, currentFieldId, editFormFlag } =
    formHook()!;

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      toast.success("form created");
      resetForm();
      setCurrentFormId(data.id);
    },
  });

  type FormValues = {
    formName: string;
  };

  const {
    register,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    createFormMutation.mutate({ name: data.formName });
  };

  return (
    <>
      <Button onClick={() => void signOut()}>sign out</Button>
      <p>currently working on: {currentFormId}</p>
      {currentFormId === "" && (
        <>
          <p>create new form</p>
          <CreateFormForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
          />
          <br />
          <Divider />
        </>
      )}

      {currentFormId !== "" &&
        currentFieldId === "" &&
        editFormFlag === false && <CreateField />}
      {currentFormId !== "" && currentFieldId !== "" && <EditField />}
      {currentFormId !== "" && currentFieldId === "" && editFormFlag && (
        <EditForm />
      )}
    </>
  );
}
