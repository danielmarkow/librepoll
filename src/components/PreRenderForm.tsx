import { PencilSquareIcon } from "@heroicons/react/24/outline";

import formHook from "~/hooks/formHook";
import { api } from "~/utils/api";

import PreRenderField from "./PreRenderField";
import Loading from "./common/Loading";

export default function PreRenderForm() {
  // eslint-disable-next-line
  const { currentFormId, setEditFormFlag } = formHook()!;

  const { data, isSuccess, isLoading, isError } = api.form.getForm.useQuery(
    { formId: currentFormId },
    {
      enabled: currentFormId !== null && currentFormId !== "",
    }
  );

  if (isLoading) return <Loading />;
  if (isError) return <p>an error occured</p>;

  if (isSuccess && data)
    return (
      <>
        <p className="mt-1 text-lg">form preview</p>
        {isSuccess && (
          <>
            <div className="flex gap-2">
              <div className="border-1 mt-2 w-2/3 border border-dotted border-gray-300 p-1">
                <h1 className="ml-1 text-xl">{data.name}</h1>
                <p className="ml-1 text-gray-500">{data.description}</p>
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

  return <></>;
}
