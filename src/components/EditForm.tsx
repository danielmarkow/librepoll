import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import CreateFormForm from "./common/CreateFormForm";
import { api } from "~/utils/api";

const formSchema = z.object({ formName: z.string().min(5) });

export default function EditForm() {
  const { currentFormId, setEditFormFlag } = formHook()!;

  const getOnlyFormQuery = api.form.getOnlyForm.useQuery(
    {
      formId: currentFormId,
    },
    {
      onSuccess: (data) => {
        setValue("formName", data!.name);
      },
    }
  );

  type FormValues = {
    formName: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      <p>edit form</p>
      <CreateFormForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
      <Button onClick={() => void setEditFormFlag(false)}>Done</Button>
    </>
  );
}
