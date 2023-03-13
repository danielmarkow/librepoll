import { useForm, useFieldArray } from "react-hook-form";

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
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "options", // unique name for your Field Array
    }
  );

  return (
    <>
      <p>create option</p>
      <form>
        {fields.map((field, index) => (
          <input
            key={field.id} // important to include key with field's id
            {...register(`test.${index}.value`)}
          />
        ))}
        <button
          type="submit"
          className="mt-2 rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Create Option
        </button>
      </form>
    </>
  );
}
