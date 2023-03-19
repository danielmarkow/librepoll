import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/utils/api";

export default function FormSelector() {
  const getAllFormsQuery = api.form.getAllForms.useQuery();

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold">form selector</h1>
      <p className="mt-1 text-lg">not public</p>
      <div>
        {getAllFormsQuery.isSuccess &&
          getAllFormsQuery.data.length > 0 &&
          getAllFormsQuery.data.map((f) => (
            <div className="mt-1 flex">
              <div className="w-1/3 border-2 border-dashed border-gray-300 px-1 hover:bg-gray-50">
                <Link
                  key={f.id}
                  href={`/forms/${f.id}`}
                  className="text-gray-600"
                >
                  {f.name}
                </Link>
              </div>
              <div>
                <TrashIcon className="h-5 w-5 cursor-pointer" />
                <EyeIcon className="mt-1 mb-1 h-5 w-5 cursor-pointer" />
              </div>
            </div>
          ))}

        <Link href={`/forms/create-form`}>
          <div className="mt-2 w-1/3 border-2 border-dashed border-gray-500 px-1 text-center hover:bg-gray-50 md:mt-1">
            <span className="inline-flex items-center">create new form</span>
          </div>
        </Link>
        <p className="mt-1 text-lg">public</p>
        <div className="mt-2 w-1/3 border-2 border-dashed border-gray-300 px-1 text-center md:mt-1">
          <span className="inline-flex items-center text-gray-300">
            none public - click on <EyeIcon className="ml-1 h-5 w-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
