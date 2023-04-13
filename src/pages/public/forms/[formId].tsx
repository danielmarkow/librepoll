import { useRouter } from "next/router";
import Link from "next/link";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/utils/api";
import RenderField from "~/components/RenderField";
import Button from "~/components/common/Button";
import { toast } from "react-hot-toast";
import Loading from "~/components/common/Loading";

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

  const schemaObj = {};

  const publicFormQuery = api.form.getPublicForm.useQuery(
    { formId: formId as string },
    {
      enabled: formId !== undefined,
      staleTime: Infinity,
      refetchOnMount: "always",
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

  const createEntryMutation = api.formData.createEntry.useMutation({
    onSuccess: () => {
      void router.push("/public/forms/thankyou");
    },
    onError: () => {
      toast.error("technical error submitting data");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = (data: FieldValues) => {
    createEntryMutation.mutate({
      formId: formId as string,
      updatedAt: publicFormQuery.data?.updatedAt as Date,
      submission: JSON.stringify(data),
    });
  };

  if (publicFormQuery.isLoading) return <Loading />;
  if (publicFormQuery.isError) return <p>an error occured</p>;

  if (publicFormQuery.isSuccess && publicFormQuery.data)
    return (
      <>
        {publicFormQuery.isSuccess && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl">{publicFormQuery.data.name}</h1>
              <p className="text-gray-500">
                {publicFormQuery.data.description}
              </p>
            </div>
            <div className="rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
              {/* eslint-disable-next-line */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {publicFormQuery.data.fields.map((f) => (
                  <div key={f.id}>
                    <RenderField
                      field={f}
                      register={register}
                      errors={errors}
                    />
                    <div className="border-b border-gray-900/10 pb-3"></div>
                  </div>
                ))}
                <Button className="mt-3" large={true} type="submit">
                  Submit
                </Button>
              </form>
            </div>
            <Link href="/">
              <p className="mt-5 text-sm text-gray-300">powered by librepoll</p>
            </Link>
          </div>
        )}
      </>
    );

  return <></>;
}
