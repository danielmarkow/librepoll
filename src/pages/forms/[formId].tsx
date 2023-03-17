import { useRouter } from "next/router";
import { useEffect } from "react";

import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";

import formHook from "~/hooks/formHook";

export default function FormEdit() {
  const router = useRouter();
  const { formId } = router.query;

  const { currentFormId, setCurrentFormId } = formHook()!;

  useEffect(() => {
    setCurrentFormId(formId as string);
  });

  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="h-screen border border-dashed border-gray-500">
        <CreateForm />
      </div>
      <div className="h-screen border border-dashed border-gray-500">
        <PreRenderForm />
      </div>
    </div>
  );
}
