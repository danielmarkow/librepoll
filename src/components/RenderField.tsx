import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Option = {
  id: string;
  value: string;
};

type Field = {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options: Array<Option>;
};
// TODO remove outer divs
export default function RenderField({
  field,
  register,
  errors,
}: {
  field: Field;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}) {
  switch (field.type) {
    case "text":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {field.label}
            </label>
            <div>
              <input
                id={field.id}
                type="text"
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`${field.name}`)}
              />
              {errors && (
                <p
                  className="mt-2 text-sm text-red-600"
                  id={`${field.name}-errors`}
                >
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    case "number":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {field.label}
            </label>
            <div>
              <input
                type="number"
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`${field.name}`)}
              />
            </div>
            {errors && (
              <p
                className="mt-2 text-sm text-red-600"
                id={`${field.name}-errors`}
              >
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        </div>
      );
    case "select":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label>{field.label}</label>
            <div>
              <select
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`${field.name}`)}
              >
                {field.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
              {errors && (
                <p
                  className="mt-2 text-sm text-red-600"
                  id={`${field.name}-errors`}
                >
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    case "radio":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {field.label}
            </label>
            <fieldset>
              <div className="space-y-4">
                {field.options.map((opt) => (
                  <div key={opt.id} className="flex items-center">
                    <input
                      type="radio"
                      id={opt.id}
                      // name={field.name}
                      className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                      {...register(`${field.name}`)}
                      value={opt.value}
                    />
                    <label
                      htmlFor={opt.id}
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      {opt.value}
                    </label>
                  </div>
                ))}
              </div>
              {errors && (
                <p
                  className="mt-2 text-sm text-red-600"
                  id={`${field.name}-errors`}
                >
                  {errors[field.name]?.message as string}
                </p>
              )}
            </fieldset>
          </div>
        </div>
      );
  }
  return <></>;
}
