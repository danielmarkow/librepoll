import type {
  UseFormHandleSubmit,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import Button from "./Button";

type FormValues = {
  formName: string;
};

export default function CreateFormForm({
  handleSubmit,
  onSubmit,
  register,
}: {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FieldValues) => void;
  register: UseFormRegister<FormValues>;
}) {
  return (
    <>
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
          </div>
          <Button type="submit">Save Form</Button>
        </div>
      </form>
    </>
  );
}
