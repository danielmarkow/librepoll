type Option = {
  id: string;
  value: string;
  fieldId: string;
  userId: string;
};

type Field = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  formId: string;
  userId: string;
  options: Array<Option>;
};

export default function PreRenderField({ field }: { field: Field }) {
  switch (field.type) {
    case "text":
      return (
        <>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {field.name}
          </label>
          <div>
            <input
              id={field.id}
              type="text"
              className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </>
      );
    case "number":
      return (
        <>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {field.name}
          </label>
          <div>
            <input
              type="number"
              className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </>
      );
    case "select":
      return (
        <>
          <label>{field.name}</label>
          <div>
            <select className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {field.options.map((opt) => (
                <option value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>
        </>
      );
  }

  return <></>;
}
