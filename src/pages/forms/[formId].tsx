import { HomeIcon } from "@heroicons/react/24/outline";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";
import Button from "~/components/common/Button";

import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

export default function FormEdit() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { formId } = router.query;

  const { currentFormId, setCurrentFormId } = formHook()!;

  const checkIfPublic = api.form.checkIfPublic.useQuery(
    { formId: formId as string },
    {
      enabled: currentFormId !== undefined && currentFormId !== null,
      staleTime: Infinity,
      // onSuccess: (data) => {
      //   if (data?.public === true) {
      //     setCurrentFormId("");
      //   } else {
      //     setCurrentFormId(formId as string);
      //   }
      // },
    }
  );

  useEffect(() => {
    setCurrentFormId(formId as string);
  });

  return (
    <>
      {/* {checkIfPublic.isSuccess && JSON.stringify(checkIfPublic.data)} */}
      <Link href={"/"}>
        <Button>
          <HomeIcon className="h-5 w-5" />
        </Button>
      </Link>

      {sessionData &&
        checkIfPublic.isSuccess &&
        checkIfPublic.data?.public === false && (
          <>
            <div className="mt-1 grid grid-cols-2 gap-1">
              <div className="h-screen border-2 border-dashed border-gray-300 p-1">
                <CreateForm />
              </div>
              <div className="h-screen border-2 border-dashed border-gray-300 p-1">
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
