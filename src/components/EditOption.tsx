import { useForm, useFieldArray, FieldValues } from "react-hook-form";

import { api } from "~/utils/api";
import Button from "./common/Button";
import formHook from "~/hooks/formHook";

export default function EditOption() {
  const { currentFieldId, setCurrentFieldId } = formHook()!;

  const {
    register,
    reset: optionFormReset,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const { fields, append /*, prepend, remove, swap, move, insert*/ } =
    useFieldArray({
      control,
      name: "option",
    });

  const getOptionsQuery = api.option.getOptions.useQuery(
    { fieldId: currentFieldId },
    {
      enabled: currentFieldId !== "" && fields.length === 0,
      onSuccess: (data) => {
        data.forEach((d) => {
          append({ id: d.id, value: d.value });
        });
      },
    }
  );

  const updateOptionsMut = api.option.updateOptions.useMutation();
  const createOptionsMut = api.option.createOption.useMutation();

  type Option = {
    id?: string;
    value: string;
  };

  const onSubmit = (data: FieldValues) => {
    const optionsToUpdate = data.option.filter((opt: Option) =>
      Object.keys(opt).includes("id")
    );

    const optionsToCreate = data.option.filter(
      (opt: Option) => !Object.keys(opt).includes("id")
    );

    updateOptionsMut.mutate({ options: optionsToUpdate });
    createOptionsMut.mutate({
      fieldId: currentFieldId,
      options: optionsToCreate,
    });
  };

  return (
    <>
      <p>edit option</p>
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
        <Button type="submit">save options</Button>
      </form>
    </>
  );
}
