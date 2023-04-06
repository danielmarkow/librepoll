import { useRouter } from "next/router";
import Link from "next/link";

import {
  ArrowDownTrayIcon,
  EyeIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
import Button from "./common/Button";

export default function FormSelector() {
  const router = useRouter();
  const client = api.useContext();

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

  const createDownloadLinkMut = api.formData.createDownloadLink.useMutation({
    onSuccess: (data) => {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  {data.downloadLink === "" ? (
                    <p className="text-sm font-medium text-gray-400">
                      wait a minute ...
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">
                      <a
                        href={`${data.downloadLink}`}
                        onClick={() => toast.dismiss(t.id)}
                      >
                        Download
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    },
    onError: () => {
      toast.error("technical error generating the download link");
    },
  });

  const updateFormVisibilityMutation =
    api.form.updateFormVisibility.useMutation({
      onSuccess: () => {
        void client.form.getAllForms.invalidate();
      },
      onError: () => {
        toast.error("technical error setting form public");
      },
    });

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      void router.push({
        pathname: `/forms/${data.id}`,
        // query: { fromCreate: true },
      });
    },
  });

  const deleteFormMutation = api.form.deleteForm.useMutation({
    onSuccess: () => {
      void client.form.getAllForms.invalidate();
    },
    onError: () => {
      toast.error("technical error deleting the form");
    },
  });

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold">form selector</h1>
      <p className="mt-1 text-lg">not public</p>
      <div>
        {getAllPrivateFormsQuery.isSuccess &&
          getAllPrivateFormsQuery.data.length > 0 &&
          getAllPrivateFormsQuery.data.map((f) => (
            <div key={f.id} className="mt-1 flex">
              <div
                onClick={() => void router.push(`/forms/${f.id}`)}
                className="border-gray-300px-1 ml-2 w-full cursor-pointer border-2 border-dashed hover:bg-gray-50 md:ml-0 md:w-1/3"
              >
                <Link href={`/forms/${f.id}`} className="text-gray-600">
                  {f.name}
                </Link>
              </div>
              <div className="mr-2 md:mr-0">
                <TrashIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() =>
                    void deleteFormMutation.mutate({ formId: f.id })
                  }
                />
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
            <div className="mt-2 ml-2 mr-6 border-2 border-dashed border-gray-300 px-1 text-center md:ml-0 md:mr-0 md:w-1/3">
              <span className="inline-flex items-center text-gray-300">
                no forms yet
              </span>
            </div>
          )}
        <div>
          <Button
            onClick={() =>
              void createFormMutation.mutate({ name: "my new form" })
            }
            className="ml-2 md:ml-0"
          >
            create new form
          </Button>
        </div>
        <p className="mt-1 text-lg">public</p>
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length > 0 &&
          getAllPublicFormsQuery.data.map((f) => (
            <div key={f.id} className="mt-1 flex">
              <div
                onClick={() => void router.push(`/public/forms/${f.id}`)}
                className="border-gray-300px-1 ml-2 w-full cursor-pointer border-2 border-dashed hover:bg-gray-50 md:ml-0 md:w-1/3"
              >
                <Link href={`/public/forms/${f.id}`} className="text-gray-600">
                  {f.name}
                </Link>
              </div>
              <div className="mr-2 md:mr-0">
                <EyeIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() =>
                    void updateFormVisibilityMutation.mutate({
                      formId: f.id,
                      public: false,
                    })
                  }
                />
                <ShareIcon
                  className="mt-1 mr-1 h-5 w-5 cursor-pointer"
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(`${window.location.href}public/forms/${f.id}`)
                      .then(() => toast.success("form url copied to clipboard"))
                      .catch(() => toast.error("error copying to clipboard"))
                  }
                />
                <ArrowDownTrayIcon
                  className="mt-1 mr-1 h-5 w-5 cursor-pointer"
                  onClick={() => {
                    // setFormIdToFetch(f.id);
                    createDownloadLinkMut.mutate({ formId: f.id });
                  }}
                />
              </div>
            </div>
          ))}
        {getAllPublicFormsQuery.isSuccess &&
          getAllPublicFormsQuery.data.length === 0 && (
            <div className="mt-2 ml-2 mr-6 border-2 border-dashed border-gray-300 px-1 text-center md:ml-0 md:mr-0 md:w-1/3">
              <span className="inline-flex items-center text-gray-300">
                none public - click on <EyeIcon className="ml-1 h-5 w-5" />
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
