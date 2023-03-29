import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import CreateFormForm from "./common/CreateFormForm";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  formName: z.string().min(5),
  formDescription: z.string().max(191).optional(),
});

export default function EditForm() {
  const { currentFormId, setEditFormFlag } = formHook();

  const client = api.useContext();

  // eslint-disable-next-line
  const getOnlyFormQuery = api.form.getOnlyForm.useQuery(
    {
      formId: currentFormId,
    },
    {
      onSuccess: (data) => {
        // eslint-disable-next-line
        setValue("formName", data!.name);
        // eslint-disable-next-line
        if (data!.description !== null) {
          // eslint-disable-next-line
          setValue("formDescription", data!.description);
        }
      },
      onError: () => {
        toast.error("error requesting form data");
      },
    }
  );

  const updateFormMut = api.form.updateForm.useMutation({
    onSuccess: () => {
      void client.form.getForm.invalidate();
    },
    onError: () => {
      toast.error("technical error updating form");
    },
  });

  type FormValues = {
    formName: string;
    formDescription: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  type FormValuesMutation = FormValues & {
    formId: string;
  };

  const onSubmit = (data: FieldValues) => {
    updateFormMut.mutate({
      formId: currentFormId,
      formName: data.formName as string,
      formDescription: data.formDescription as string,
    } as FormValuesMutation);
  };

  return (
    <>
      <p>edit form</p>
      <CreateFormForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
      />
      <Button onClick={() => void setEditFormFlag(false)}>Done</Button>
    </>
  );
}
