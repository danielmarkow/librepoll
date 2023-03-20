import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import RenderField from "~/components/RenderField";
import Button from "~/components/common/Button";

const mapFieldTypeToZod = (fieldType: string) => {
  // TODO possibly expand to more validation options configured by the form creator
  switch (fieldType) {
    case "text":
      return z.string();
    case "number":
      return z.number();
    case "select":
      return z.string();
    case "radio":
      return z.string();
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
      onSuccess: (data) => {
        data?.fields.forEach((f) =>
          Object.assign(schemaObj, { [f.name]: mapFieldTypeToZod(f.type) })
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
        {/* {publicFormQuery.isSuccess && JSON.stringify(publicFormQuery.data)} */}
        <br />
        {/* {publicFormQuery.isSuccess &&
          JSON.stringify(publicFormQuery.data?.fields.map((f) => f.type))}
        {publicFormQuery.isSuccess &&
          JSON.stringify(publicFormQuery.data?.fields.map((f) => f.name))} */}

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
