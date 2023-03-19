import { useRouter } from "next/router";

import { api } from "~/utils/api";

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;

  const publicFormQuery = api.form.getPublicForm.useQuery(
    { formId: formId as string },
    {
      enabled: formId !== undefined,
    }
  );

  return (
    <>
      <p>public form</p>
      {publicFormQuery.isSuccess && JSON.stringify(publicFormQuery.data)}
    </>
  );
}
