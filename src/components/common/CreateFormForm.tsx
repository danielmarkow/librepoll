import type {
  UseFormHandleSubmit,
  FieldValues,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import Button from "./Button";

type FormValues = {
  formName: string;
  formDescription: string;
};

export default function CreateFormForm({
  handleSubmit,
  onSubmit,
  register,
  errors,
}: {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FieldValues) => void;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FieldValues>;
}) {
  return (
    <>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* TODO add form description */}
        <div>
          <label
            htmlFor="formName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            form name
          </label>
          <div className="mt-1">
            <input
              type="input"
              id="formName"
              className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("formName")}
            />
            {errors && (
              <p className="mt-2 text-sm text-red-600" id="formName-error">
                {errors.formName?.message as string}
              </p>
            )}
          </div>
          <label
            htmlFor="formDescription"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            form description
          </label>
          <div>
            <textarea
              id="formDescription"
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:py-1.5 sm:text-sm sm:leading-6"
              rows={4}
              {...register("formDescription")}
            />
            {errors && (
              <p
                className="mt-2 text-sm text-red-600"
                id="formDescription-error"
              >
                {errors.formDescription?.message as string}
              </p>
            )}
          </div>
          <Button type="submit">Save Form</Button>
        </div>
      </form>
    </>
  );
}
