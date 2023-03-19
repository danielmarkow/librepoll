import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";
import Button from "~/components/common/Button";

import formHook from "~/hooks/formHook";

export default function FormEdit() {
  const router = useRouter();
  const { formId } = router.query;

  const { currentFormId, setCurrentFormId } = formHook()!;

  useEffect(() => {
    setCurrentFormId(formId as string);
  });

  return (
    <>
      <Link href={"/"}>
        <Button>
          <HomeIcon className="h-5 w-5" />
        </Button>
      </Link>
      <div className="mt-1 grid grid-cols-2 gap-1">
        <div className="h-screen border-2 border-dashed border-gray-300 p-1">
          <CreateForm />
        </div>
        <div className="h-screen border-2 border-dashed border-gray-300 p-1">
          <PreRenderForm />
        </div>
      </div>
    </>
  );
}
