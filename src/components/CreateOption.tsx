import { useForm, useFieldArray, FieldValues } from "react-hook-form";

import Button from "./common/Button";

export default function CreateOption({ fieldId }: { fieldId: string }) {
  const {
    register,
    reset: formReset,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "option",
    }
  );

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      <p>create option</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <>
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
          </>
        ))}
        <Button type="button" onClick={() => void append({})}>
          +
        </Button>
        <Button type="submit">Create Options</Button>
      </form>
    </>
  );
}
