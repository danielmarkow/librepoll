import type {
  UseFormHandleSubmit,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import Button from "./Button";

type FormValues = {
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "number" | "radio" | "select";
  fieldRequired: "no" | "yes";
};

export default function CreateFieldForm({
  handleSubmit,
  onSubmit,
  register,
  watch,
}: {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FieldValues) => void;
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
}) {
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="fieldType"
          className="mt-1 block text-sm font-medium leading-6 text-gray-900"
        >
          select type
        </label>
        <div>
          <select
            id="fieldType"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("fieldType")}
          >
            <option value="text">text</option>
            <option value="number">number</option>
            <option value="radio">radio</option>
            <option value="select">select</option>
          </select>
        </div>
        <label
          htmlFor="fieldName"
          className="mt-1 block text-sm font-medium leading-6 text-gray-900"
        >
          name
        </label>
        <p className="mt-0 text-sm text-gray-500">
          this will be the column name in the results. should be unique
        </p>
        <div>
          <input
            type="text"
            id="fieldName"
            className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("fieldName")}
          />
        </div>

        <label
          htmlFor="fieldLabel"
          className="mt-1 block text-sm font-medium leading-6 text-gray-900"
        >
          label
        </label>
        <p className="mt-0 text-sm text-gray-500">
          this will be displayed in the form
        </p>
        <div>
          <input
            type="text"
            id="fieldName"
            className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("fieldLabel")}
          />
        </div>
        {watch("fieldType") !== "radio" && (
          <>
            <label
              htmlFor="fieldRequired"
              className="mt-1 block text-sm font-medium leading-6 text-gray-900"
            >
              field required?
            </label>
            <div>
              <select
                id="fieldRequired"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("fieldRequired")}
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
          </>
        )}

        <Button type="submit">save field</Button>
      </form>
    </>
  );
}
