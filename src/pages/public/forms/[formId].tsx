import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import RenderField from "~/components/RenderField";

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;

  const publicFormQuery = api.form.getPublicForm.useQuery(
    { formId: formId as string },
    {
      enabled: formId !== undefined,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  return (
    <>
      <div>
        {publicFormQuery.isSuccess && JSON.stringify(publicFormQuery.data)}
        <br />
        {publicFormQuery.isSuccess &&
          JSON.stringify(publicFormQuery.data?.fields.map((f) => f.type))}
        {publicFormQuery.isSuccess &&
          JSON.stringify(publicFormQuery.data?.fields.map((f) => f.name))}

        <h1 className="text-xl">
          {publicFormQuery.isSuccess && publicFormQuery.data!.name}
        </h1>
        <form>
          {publicFormQuery.isSuccess &&
            publicFormQuery.data!.fields.map((f) => (
              <RenderField field={f} register={register} />
            ))}
        </form>
      </div>
    </>
  );
}
