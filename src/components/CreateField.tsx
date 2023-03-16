import { useState } from "react";

import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

import CreateOption from "./CreateOption";
import Divider from "./common/Divider";
import CreateRadio from "./CreateRadio";

const fieldSchema = z.object({
  fieldName: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(["text", "number", "radio", "select"]),
  fieldRequired: z.enum(["no", "yes"]),
});

export default function CreateField({ formId }: { formId: string }) {
  const [fieldId, setFieldId] = useState<string>("");

  const client = api.useContext();

  const createFieldMutation = api.field.createField.useMutation({
    onSuccess: (data) => {
      toast.success("created field");
      setFieldId(data.id);

      if (data.type in ["text", "number"]) {
        fieldFormReset();
        client.form.getForm.invalidate();
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
    console.log({ ...data, formId: formId });
    createFieldMutation.mutate({ ...data, formId } as FormMutationInput);
  };

  return (
    <>
      <p>create field</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="fieldType"
          className="mt-1 block text-sm font-medium leading-6 text-gray-900"
        >
          select type
        </label>
        <div>
          <select
            id="fieldType"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("fieldType")}
          >
            <option value="text">text</option>
            <option value="number">number</option>
            <option value="radio">radio</option>
            <option value="select">select</option>
          </select>
        </div>
        <label
          htmlFor="fieldName"
          className="mt-1 block text-sm font-medium leading-6 text-gray-900"
        >
          name
        </label>
        <div>
          <input
            type="text"
            id="fieldName"
            className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("fieldName")}
          />
        </div>
        {watch("fieldType") !== "radio" && (
          <>
            <label
              htmlFor="fieldLabel"
              className="mt-1 block text-sm font-medium leading-6 text-gray-900"
            >
              label
            </label>
            <div>
              <input
                type="text"
                id="fieldName"
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("fieldLabel")}
              />
            </div>
            <label
              htmlFor="fieldRequired"
              className="mt-1 block text-sm font-medium leading-6 text-gray-900"
            >
              field required?
            </label>
            <div>
              <select
                id="fieldRequired"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("fieldRequired")}
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-2 rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Create Field
        </button>
      </form>
      <br />
      <Divider />
      {/* {watch("fieldType") === "radio" && (
        <CreateRadio
          formId={formId}
          fieldFormReset={fieldFormReset}
          fieldName={watch("fieldName")}
        />
      )} */}
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
