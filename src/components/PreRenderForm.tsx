import { PencilSquareIcon } from "@heroicons/react/24/outline";

import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

import PreRenderField from "./PreRenderField";

export default function PreRenderForm() {
  const { currentFormId, setEditFormFlag } = formHook()!;

  const { data, isSuccess } = api.form.getForm.useQuery(
    { formId: currentFormId },
    {
      enabled: currentFormId !== null && currentFormId !== "",
    }
  );

  return (
    <>
      <p className="mt-1 text-lg">form preview</p>
      {/* <p>currently working on: {currentFormId}</p> */}
      {isSuccess && (
        <>
          <div className="flex gap-2">
            <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
              <h1 className="ml-1 text-xl">{data!.name}</h1>
            </div>
            <div>
              <PencilSquareIcon
                className="mt-2 h-5 w-5 cursor-pointer"
                onClick={() => void setEditFormFlag(true)}
              />
            </div>
          </div>
          {data?.fields.map((field) => {
            return <PreRenderField key={field.id} field={field} />;
          })}
        </>
      )}
    </>
  );
}
