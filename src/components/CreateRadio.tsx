import {
  useForm,
  useFieldArray,
  FieldValues,
  UseFormReset,
} from "react-hook-form";

import Button from "./common/Button";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

type FormValuesField = {
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "number" | "radio" | "select";
  fieldRequired: "no" | "yes";
};

export default function CreateRadio({
  formId,
  fieldName,
  fieldFormReset,
}: {
  formId: string;
  fieldName: string;
  fieldFormReset: UseFormReset<FormValuesField>;
}) {
  const utils = api.useContext();

  const createMultipleFieldsMut = api.field.createMultipleFields.useMutation({
    onSuccess: () => {
      toast.success("created radios");
      labelFormReset();
      fieldFormReset();
      utils.form.getForm.invalidate();
    },
    onError: () => {
      toast.error("failed to create radios");
    },
  });

  const {
    register,
    reset: labelFormReset,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { fields, append /*, prepend, remove, swap, move, insert*/ } =
    useFieldArray({
      control,
      name: "label",
    });

  const onSubmit = (data: FieldValues) => {
    let submitData = data.label.map((l: FieldValues) => {
      return {
        fieldLabel: l.value,
        formId,
        fieldName,
        fieldType: "radio",
        fieldRequired: "no",
      };
    });
    console.log(submitData);
    createMultipleFieldsMut.mutate(submitData);
  };

  return (
    <>
      <p>create radios</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {`label ${index + 1}`}
            </label>
            <div>
              <input
                key={field.id} // important to include key with field's id
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`label.${index}.value`)}
              />
            </div>
          </div>
        ))}
        <Button type="button" onClick={() => void append({})}>
          +
        </Button>
        <Button type="submit">Create Radio</Button>
      </form>
    </>
  );
}
