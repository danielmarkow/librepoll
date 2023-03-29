import type { FieldValues } from "react-hook-form";
import { useForm, useFieldArray } from "react-hook-form";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import Button from "./common/Button";
import formHook from "~/hooks/formHook";
import { toast } from "react-hot-toast";

export default function EditOption() {
  const { currentFieldId, currentFormId } = formHook();

  const {
    register,
    handleSubmit,
    // formState: { errors },
    control,
  } = useForm();

  const { fields, append, remove /*, prepend, swap, move, insert*/ } =
    useFieldArray({
      control,
      name: "option",
    });

  // eslint-disable-next-line
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

  const client = api.useContext();

  type FormData = RouterOutputs["form"]["getForm"];

  const optionStateMut = api.option.updateOptionState.useMutation({
    onSuccess: (data) => {
      client.form.getForm.setData({ formId: currentFormId }, (oldData) => {
        const newData = {
          ...oldData,
          // eslint-disable-next-line
          fields: oldData!.fields.map((field) => {
            if (field.id === currentFieldId) {
              return {
                ...field,
                options: data,
              };
            }
            return field;
          }),
        };

        return newData as FormData;
      });
    },
    onError: () => {
      toast.error("technical error updating options");
    },
  });

  type Option = {
    id?: string;
    value: string;
  };

  const onSubmit = (data: FieldValues) => {
    const dataToSubmit = {
      options: data.option as Option[],
      fieldId: currentFieldId,
    };

    optionStateMut.mutate(dataToSubmit);
  };

  return (
    <>
      <p>edit option</p>
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
          <div>
            <Button type="button" onClick={() => void append({})}>
              +
            </Button>
          </div>
          <div>
            <Button type="submit">save options</Button>
          </div>
        </div>
      </form>
    </>
  );
}
