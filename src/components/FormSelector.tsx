import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/utils/api";

export default function FormSelector() {
  const getAllPrivateFormsQuery = api.form.getAllForms.useQuery({});
  const getAllPublicFormsQuery = api.form.getAllForms.useQuery({
    public: true,
  });

  const updateFormVisibilityMutation =
    api.form.updateFormVisibility.useMutation();

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold">form selector</h1>
      <p className="mt-1 text-lg">not public</p>
      <div>
        {getAllPrivateFormsQuery.isSuccess &&
          getAllPrivateFormsQuery.data.length > 0 &&
          getAllPrivateFormsQuery.data.map((f) => (
            <div key={f.id} className="mt-1 flex">
              <div className="w-1/3 border-2 border-dashed border-gray-300 px-1 hover:bg-gray-50">
                <Link href={`/forms/${f.id}`} className="text-gray-600">
                  {f.name}
                </Link>
              </div>
              <div>
                <TrashIcon className="h-5 w-5 cursor-pointer" />
                <EyeIcon
                  className="mt-1 mb-1 h-5 w-5 cursor-pointer"
                  onClick={() =>
                    void updateFormVisibilityMutation.mutate({
                      formId: f.id,
                      public: true,
                    })
                  }
                />
              </div>
            </div>
          ))}
        {getAllPrivateFormsQuery.isSuccess &&
          getAllPrivateFormsQuery.data.length === 0 && (
            <div className="mt-2 w-1/3 border-2 border-dashed border-gray-300 px-1 text-center md:mt-1">
              <span className="inline-flex items-center text-gray-300">
                no forms yet
              </span>
            </div>
          )}

        <Link href={`/forms/create-form`}>
          <div className="mt-2 w-1/3 border-2 border-dashed border-gray-500 px-1 text-center hover:bg-gray-50 md:mt-1">
            <span className="inline-flex items-center">create new form</span>
          </div>
        </Link>
        <p className="mt-1 text-lg">public</p>
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length > 0 &&
          getAllPublicFormsQuery.data.map((f) => (
            <div key={f.id} className="mt-1 flex">
              <div className="w-1/3 border-2 border-dashed border-gray-300 px-1 hover:bg-gray-50">
                <Link href={`/public/forms/${f.id}`} className="text-gray-600">
                  {f.name}
                </Link>
              </div>
              <div>
                <EyeIcon className="mt-1 mb-1 h-5 w-5 cursor-pointer" />
              </div>
            </div>
          ))}
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length === 0 && (
            <div className="mt-2 w-1/3 border-2 border-dashed border-gray-300 px-1 text-center md:mt-1">
              <span className="inline-flex items-center text-gray-300">
                none public - click on <EyeIcon className="ml-1 h-5 w-5" />
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
