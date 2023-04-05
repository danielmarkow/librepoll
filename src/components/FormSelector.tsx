import { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import csvDownload from "json-to-csv-export";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
import Button from "./common/Button";

export default function FormSelector() {
  const [formIdToFetch, setFormIdToFetch] = useState<string>("");
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
  // eslint-disable-next-line
  const getPublicFormDataQuery = api.formData.getFormData.useQuery(
    { formId: formIdToFetch },
    {
      enabled: formIdToFetch !== "",
      onSuccess: (data) => {
        const dataToConvert = {
          data: data.map((d) => JSON.parse(d.submission) as string),
          filename: "public_form_result",
          delimiter: ",",
          // eslint-disable-next-line
          headers: Object.keys(JSON.parse(data[0]?.submission!)),
        };
        csvDownload(dataToConvert);
        setFormIdToFetch("");
      },
      staleTime: Infinity,
    }
  );

  const createDownloadLinkMut = api.formData.createDownloadLink.useMutation({
    onSuccess: (data) => {
      console.log(data.downloadLink);
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
