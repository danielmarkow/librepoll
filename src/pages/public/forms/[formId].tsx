import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import RenderField from "~/components/RenderField";
import Button from "~/components/common/Button";

const mapFieldTypeToZod = (fieldType: string, required: boolean) => {
  // TODO possibly expand to more validation options configured by the form creator
  switch (fieldType) {
    case "text":
      if (required) {
        return z.string();
      } else {
        return z.string().optional();
      }
    case "number":
      if (required) {
        return z.number();
      } else {
        return z.number().optional();
      }
    case "select":
      if (required) {
        return z.string();
      } else {
        return z.string().optional();
      }
    case "radio":
      if (required) {
        return z.string();
      } else {
        return z.string().optional();
      }
  }
};

let formSchema = z.object({});

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;

  let schemaObj = {};

  const publicFormQuery = api.form.getPublicForm.useQuery(
    { formId: formId as string },
    {
      enabled: formId !== undefined,
      staleTime: Infinity,
      onSuccess: (data) => {
        data?.fields.forEach((f) =>
          Object.assign(schemaObj, {
            [f.name]: mapFieldTypeToZod(f.type, f.required),
          })
        );
        formSchema = z.object(schemaObj);
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      <div>
        <h1 className="text-xl">
          {publicFormQuery.isSuccess && publicFormQuery.data!.name}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {publicFormQuery.isSuccess &&
            publicFormQuery.data!.fields.map((f) => (
              <RenderField
                key={f.id}
                field={f}
                register={register}
                errors={errors}
              />
            ))}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
}
