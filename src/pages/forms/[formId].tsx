import { useEffect } from "react";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";
import Button from "~/components/common/Button";

import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

export default function FormEdit() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { formId } = router.query;

  const { currentFormId, setCurrentFormId, setCurrentFieldId } = formHook();

  useEffect(() => {
    setCurrentFieldId("");
  }, [setCurrentFieldId]);

  const checkIfPublic = api.form.checkIfPublic.useQuery(
    { formId: formId as string },
    {
      enabled: currentFormId !== undefined && currentFormId !== null,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    setCurrentFormId(formId as string);
  });

  return (
    <>
      {sessionData &&
        checkIfPublic.isSuccess &&
        checkIfPublic.data?.public === false && (
          <>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                <CreateForm />
              </div>
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                <PreRenderForm />
              </div>
            </div>
          </>
        )}
      {!sessionData && (
        <>
          <p>please login to edit forms</p>
          <Button onClick={() => void signIn()}>login</Button>
        </>
      )}
      {sessionData &&
        checkIfPublic.isSuccess &&
        checkIfPublic.data?.public === true && (
          <p>this form is public. please switch to private to edit.</p>
        )}
    </>
  );
}
