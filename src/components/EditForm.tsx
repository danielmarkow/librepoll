import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import CreateFormForm from "./common/CreateFormForm";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const formSchema = z.object({ formName: z.string().min(5) });

export default function EditForm() {
  // eslint-disable-next-line
  const { currentFormId, setEditFormFlag } = formHook()!;

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
  });

  type FormValues = {
    formName: string;
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
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
    } as FormValuesMutation);
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
