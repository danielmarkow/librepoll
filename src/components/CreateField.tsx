import { useState } from "react";

import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

import CreateOption from "./CreateOption";
import Divider from "./common/Divider";
import formHook from "~/hooks/formHook";
import CreateFieldForm from "./common/CreateFieldForm";

const fieldSchema = z.object({
  fieldName: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(["text", "number", "radio", "select"]),
  fieldRequired: z.enum(["no", "yes"]),
});

export default function CreateField() {
  const { currentFormId } = formHook()!;

  const [fieldId, setFieldId] = useState<string>("");

  const client = api.useContext();

  const createFieldMutation = api.field.createField.useMutation({
    onSuccess: (data) => {
      setFieldId(data.id);

      if (data.type === "text" || data.type === "number") {
        fieldFormReset();
        client.form.getForm.invalidate();
        setFieldId("");
      }
    },
    onError: () => {
      toast.error("error creating field");
    },
  });

  type FormValues = {
    fieldName: string;
    fieldLabel: string;
    fieldType: "text" | "number" | "radio" | "select";
    fieldRequired: "no" | "yes";
  };

  const {
    register,
    reset: fieldFormReset,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(fieldSchema),
  });

  type FormMutationInput = FormValues & {
    formId: string;
  };

  const onSubmit = (data: FieldValues) => {
    createFieldMutation.mutate({
      ...data,
      formId: currentFormId,
    } as FormMutationInput);
  };

  return (
    <>
      <p>create field</p>
      <CreateFieldForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        watch={watch}
      />
      <br />
      <Divider />
      {getValues("fieldType") === "select" && fieldId !== "" && (
        <CreateOption
          fieldId={fieldId}
          setFieldId={setFieldId}
          fieldFormReset={fieldFormReset}
        />
      )}
      {getValues("fieldType") === "radio" && fieldId !== "" && (
        <CreateOption
          fieldId={fieldId}
          setFieldId={setFieldId}
          fieldFormReset={fieldFormReset}
        />
      )}
    </>
  );
}
