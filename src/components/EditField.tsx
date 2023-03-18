import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import CreateFieldForm from "./common/CreateFieldForm";
import EditOption from "./EditOption";

const fieldSchema = z.object({
  fieldName: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(["text", "number", "radio", "select"]),
  fieldRequired: z.enum(["no", "yes"]),
});

type FormValues = {
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "number" | "radio" | "select";
  fieldRequired: "no" | "yes";
};

export default function EditField() {
  const { currentFieldId, setCurrentFieldId } = formHook()!;

  const {
    register,
    reset: fieldFormReset,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(fieldSchema),
  });

  const getFieldQuery = api.field.getField.useQuery(
    {
      fieldId: currentFieldId,
    },
    {
      enabled: currentFieldId !== "",
      onSuccess: (data) => {
        setValue("fieldName", data!.name);
        setValue("fieldLabel", data!.label);
        setValue(
          "fieldType",
          data!.type as "text" | "number" | "radio" | "select"
        );
        setValue("fieldRequired", data!.required === true ? "yes" : "no");
      },
    }
  );

  const client = api.useContext();

  const updateFieldMutation = api.field.updateField.useMutation({
    onSuccess: () => {
      client.form.getForm.invalidate();
    },
  });

  type FormMutationInput = FormValues & {
    fieldId: string;
  };

  const onSubmit = (data: FieldValues) => {
    // console.log({ fieldId: currentFieldId, ...data });
    updateFieldMutation.mutate({
      fieldId: currentFieldId,
      ...data,
    } as FormMutationInput);
  };

  return (
    <>
      <p>edit field</p>
      <CreateFieldForm
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        onSubmit={onSubmit}
      />
      {watch("fieldType") === "radio" && <EditOption />}
      {watch("fieldType") === "select" && <EditOption />}
      <Button onClick={() => setCurrentFieldId("")}>Done</Button>
    </>
  );
}