import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

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

export default function PreRenderField({ field }: { field: Field }) {
  const { setCurrentFieldId } = formHook();

  const client = api.useContext();

  const deleteFieldMutation = api.field.deleteField.useMutation({
    onSuccess: () => {
      void client.form.getForm.invalidate();
    },
    onError: () => {
      toast.error("error deleting field");
    },
  });

  switch (field.type) {
    case "text":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {field.label}{" "}
              <span className="text-xs text-gray-500">
                {field.required ? "required" : "not required"}
              </span>
            </label>
            <div>
              <input
                id={field.id}
                type="text"
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <div>
            <PencilSquareIcon
              className="mt-2 h-5 w-5 cursor-pointer"
              onClick={() => void setCurrentFieldId(field.id)}
            />
            <TrashIcon
              className="mt-1 h-5 w-5 cursor-pointer"
              onClick={() =>
                void deleteFieldMutation.mutate({ fieldId: field.id })
              }
            />
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
              {field.label}{" "}
              <span className="text-xs text-gray-500">
                {field.required ? "required" : "not required"}
              </span>
            </label>
            <div>
              <input
                type="number"
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <div>
            <PencilSquareIcon
              className="mt-2 h-5 w-5 cursor-pointer"
              onClick={() => void setCurrentFieldId(field.id)}
            />
            <TrashIcon
              className="mt-1 h-5 w-5 cursor-pointer"
              onClick={() =>
                void deleteFieldMutation.mutate({ fieldId: field.id })
              }
            />
          </div>
        </div>
      );
    case "select":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {field.label}{" "}
              <span className="text-xs text-gray-500">
                {field.required ? "required" : "not required"}
              </span>
            </label>
            <div>
              <select className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                {field.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <PencilSquareIcon
              className="mt-2 h-5 w-5 cursor-pointer"
              onClick={() => void setCurrentFieldId(field.id)}
            />
            <TrashIcon
              className="mt-1 h-5 w-5 cursor-pointer"
              onClick={() =>
                void deleteFieldMutation.mutate({ fieldId: field.id })
              }
            />
          </div>
        </div>
      );
    case "radio":
      return (
        <div className="flex gap-2">
          <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {field.label}{" "}
              <span className="text-xs text-gray-500">
                {field.required ? "required" : "not required"}
              </span>
            </label>
            <fieldset>
              <div className="space-y-4">
                {field.options.map((opt) => (
                  <div key={opt.id} className="flex items-center">
                    <input
                      type="radio"
                      id={opt.id}
                      name={field.name}
                      className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
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
            </fieldset>
          </div>
          <div>
            <PencilSquareIcon
              className="mt-2 h-5 w-5 cursor-pointer"
              onClick={() => void setCurrentFieldId(field.id)}
            />
            <TrashIcon
              className="mt-1 h-5 w-5 cursor-pointer"
              onClick={() =>
                void deleteFieldMutation.mutate({ fieldId: field.id })
              }
            />
          </div>
        </div>
      );
  }

  return <></>;
}
