import Link from "next/link";

import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
import FormDropDownPrivate from "./FormDropDownPrivate";
import FormDropDownPublic from "./FormDropDownPublic";
import DividerWithTitle from "./common/DividerWithTitle";

export default function FormSelector() {
  const getAllPrivateFormsQuery = api.form.getAllForms.useQuery(
    {},
    {
      onError: () => {
        toast.error("technical error retrieving private forms");
      },
    }
  );
  const getAllPublicFormsQuery = api.form.getAllForms.useQuery(
    {
      public: true,
    },
    {
      onError: () => {
        toast.error("technical error retrieving public forms");
      },
    }
  );

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <DividerWithTitle>public</DividerWithTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length > 0 &&
          getAllPublicFormsQuery.data.map((f) => (
            <>
              <div
                key={f.id}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/public/forms/${f.id}`}
                    className="focus:outline-none"
                  >
                    <span aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {f.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {f.description}
                    </p>
                  </Link>
                </div>
                <FormDropDownPublic id={f.id} />
              </div>
            </>
          ))}
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length === 0 && (
            <>
              <div className="relative flex items-center space-x-3 rounded-lg border border-dotted border-gray-300 bg-white px-6 py-5 shadow-sm">
                <div className="min-w-0 flex-1">
                  <span aria-hidden="true" />
                  <p className="truncate text-sm text-gray-500">
                    no public polls yet
                  </p>
                </div>
              </div>
            </>
          )}
      </div>
      <DividerWithTitle>not public</DividerWithTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {getAllPrivateFormsQuery.isSuccess &&
          getAllPrivateFormsQuery.data.length > 0 &&
          getAllPrivateFormsQuery.data.map((f) => (
            <>
              <div
                key={f.id}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <Link href={`/forms/${f.id}`} className="focus:outline-none">
                    <span aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {f.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {f.description}
                    </p>
                  </Link>
                </div>
                <FormDropDownPrivate id={f.id} />
              </div>
            </>
          ))}
        {getAllPrivateFormsQuery.isSuccess &&
          getAllPrivateFormsQuery.data.length === 0 && (
            <div className="relative flex items-center space-x-3 rounded-lg border border-dotted border-gray-300 bg-white px-6 py-5 shadow-sm">
              <div className="min-w-0 flex-1">
                <span aria-hidden="true" />

                <p className="truncate text-sm text-gray-500">no polls yet</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
