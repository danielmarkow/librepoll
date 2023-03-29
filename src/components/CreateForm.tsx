import { z } from "zod";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import CreateField from "./CreateField";
import formHook from "~/hooks/formHook";
import EditField from "./EditField";
import EditForm from "./EditForm";
import CreateFormForm from "./common/CreateFormForm";

const formSchema = z.object({
  formName: z.string().min(5),
  formDescription: z.string().max(191).optional(),
});

export default function CreateForm() {
  const { currentFormId, setCurrentFormId, currentFieldId, editFormFlag } =
    formHook();

  setCurrentFormId("");

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      toast.success("form created");
      resetForm();
      setCurrentFormId(data.id);
    },
  });

  type FormValues = {
    formName: string;
    formDescription: string;
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
    createFormMutation.mutate({ name: data.formName as string });
  };

  return (
    <>
      {currentFormId === "" && (
        <>
          <p className="mt-1 text-lg">create new form</p>
          <CreateFormForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
          />
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
