import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

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
  const [focusedFieldIdx, setFocusedFieldIdx] = useState<number>(0);

  useEffect(() => {
    console.log(focusedFieldIdx);
  }, [focusedFieldIdx]);

  const {
    register,
    reset: optionFormReset,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    // formState: { errors },
    control,
  } = useForm();

  const { fields, append, remove, insert /*prepend, swap, move, */ } =
    useFieldArray({
      control,
      name: "option",
    });

  useEffect(() => {
    append({});
    setFocus("option.0.value");
  }, [append, setFocus]);

  const client = api.useContext();

  const optionStateMut = api.option.updateOptionState.useMutation({
    onSuccess: () => {
      optionFormReset();
      fieldFormReset();
      setFieldId("");
      // leaving invalidation here because the field data
      // is not yet displayed
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
      <form
        // eslint-disable-next-line
        onSubmit={handleSubmit(onSubmit)}
        onPaste={(e) => {
          e.preventDefault();
          const pastedOptions = e.clipboardData.getData("text").split("\n");

          let startFieldIdx = focusedFieldIdx;

          for (let i = 0; i < pastedOptions.length; i++) {
            if (
              getValues(`option.${startFieldIdx}.value`) !== undefined &&
              getValues(`option.${startFieldIdx}.value`) === ""
            ) {
              setValue(`option.${startFieldIdx}.value`, pastedOptions[i]);
              startFieldIdx += 1;
            } else if (
              getValues(`option.${startFieldIdx}.value`) !== undefined &&
              getValues(`option.${startFieldIdx}.value`) !== ""
            ) {
              insert(startFieldIdx, { value: pastedOptions[i] });
              startFieldIdx += 1;
            } else {
              append({ value: pastedOptions[i] });
              startFieldIdx += 1;
            }
          }
        }}
      >
        {fields.length === 0 && (
          <p className="mt-0 text-sm text-gray-500">
            click here and paste your options
          </p>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                {`option ${index + 1}`}
              </label>
              <div>
                <input
                  onFocus={() => setFocusedFieldIdx(index)}
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
