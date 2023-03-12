import { z } from "zod";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import CreateField from "./CreateField";
import Divider from "./common/Divider";

const formSchema = z.object({ formName: z.string().min(5) });

export default function CreatePoll() {
  const [formId, setFormId] = useState<string>("");

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      toast.success("form created");
      resetForm();
      setFormId(data.id);
    },
  });

  type FormValues = {
    formName: string;
  };

  const {
    register,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    createFormMutation.mutate({ name: data.formName });
  };

  return (
    <>
      <p>currently working on: {formId}</p>
      <p>create form</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <button
            type="submit"
            className="mt-2 rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Create Form
          </button>
        </div>
      </form>
      <br />
      <Divider />
      <CreateField formId={formId} />
    </>
  );
}
