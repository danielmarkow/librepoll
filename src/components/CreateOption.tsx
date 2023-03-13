import {
  useForm,
  useFieldArray,
  FieldValues,
  UseFormReset,
} from "react-hook-form";

import Button from "./common/Button";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

export default function CreateOption({
  fieldId,
  fieldFormReset,
}: {
  fieldId: string;
  fieldFormReset: UseFormReset<FieldValues>;
}) {
  const {
    register,
    reset: optionFormReset,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { fields, append /*, prepend, remove, swap, move, insert*/ } =
    useFieldArray({
      control,
      name: "option",
    });

  const createOptionMutation = api.option.createOption.useMutation({
    onSuccess: () => {
      toast.success("options saved");
      optionFormReset();
      fieldFormReset();
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
    createOptionMutation.mutate({
      fieldId,
      options: data.option,
    } as MutationData);
  };

  return (
    <>
      <p>create option</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id}>
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
        ))}
        <Button type="button" onClick={() => void append({})}>
          +
        </Button>
        <Button type="submit">Create Options</Button>
      </form>
    </>
  );
}
