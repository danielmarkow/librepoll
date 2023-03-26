import type { Dispatch, SetStateAction } from "react";

import type { FieldValues, UseFormReset } from "react-hook-form";

import { useForm, useFieldArray } from "react-hook-form";

import Button from "./common/Button";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

type FormValuesField = {
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "number" | "radio" | "select";
  fieldRequired: "no" | "yes";
};

export default function CreateOption({
  fieldId,
  fieldFormReset,
  setFieldId,
}: {
  fieldId: string;
  fieldFormReset: UseFormReset<FormValuesField>;
  setFieldId: Dispatch<SetStateAction<string>>;
}) {
  const {
    register,
    reset: optionFormReset,
    handleSubmit,
    // formState: { errors },
    control,
  } = useForm();

  const { fields, append, remove /*, prepend, swap, move, insert*/ } =
    useFieldArray({
      control,
      name: "option",
    });

  const client = api.useContext();

  const optionStateMut = api.option.updateOptionState.useMutation({
    onSuccess: () => {
      optionFormReset();
      fieldFormReset();
      setFieldId("");
      void client.form.getForm.invalidate();
    },
    onError: () => {
      toast.error("technical error updating options");
    },
  });

  type Option = {
    value: string;
  };
  type MutationData = {
    fieldId: string;
    options: Array<Option>;
  };

  const onSubmit = (data: FieldValues) => {
    optionStateMut.mutate({
      fieldId,
      options: data.option as Array<Option>,
    } as MutationData);
  };

  return (
    <>
      <p>create option</p>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                {`option ${index + 1}`}
              </label>
              <div>
                <input
                  key={field.id} // important to include key with field's id
                  className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register(`option.${index}.value`)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Button
                onClick={() => {
                  remove(index);
                }}
              >
                -
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-1">
          <Button type="button" onClick={() => void append({})}>
            +
          </Button>
          <Button type="submit">save options</Button>
        </div>
      </form>
    </>
  );
}
