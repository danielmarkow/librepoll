import { useRouter } from "next/router";
import Link from "next/link";

import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
// import Button from "./common/Button";
import FormDropDownPrivate from "./FormDropDownPrivate";
import FormDropDownPublic from "./FormDropDownPublic";
import DividerWithTitle from "./common/DividerWithTitle";

export default function FormSelector() {
  const router = useRouter();
  // const client = api.useContext();

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

  // const createDownloadLinkMut = api.formData.createDownloadLink.useMutation({
  //   onSuccess: (data) => {
  //     toast.custom(
  //       (t) => (
  //         <div
  //           className={`${
  //             t.visible ? "animate-enter" : "animate-leave"
  //           } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
  //         >
  //           <div className="w-0 flex-1 p-4">
  //             <div className="flex items-start">
  //               <div className="ml-3 flex-1">
  //                 {data.downloadLink === "" ? (
  //                   <p className="text-sm font-medium text-gray-400">
  //                     wait a minute ...
  //                   </p>
  //                 ) : (
  //                   <p className="text-sm font-medium text-gray-900">
  //                     <a
  //                       href={`${data.downloadLink}`}
  //                       onClick={() => toast.dismiss(t.id)}
  //                     >
  //                       Download
  //                     </a>
  //                   </p>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex border-l border-gray-200">
  //             <button
  //               onClick={() => toast.dismiss(t.id)}
  //               className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
  //             >
  //               Close
  //             </button>
  //           </div>
  //         </div>
  //       ),
  //       {
  //         duration: Infinity,
  //       }
  //     );
  //   },
  //   onError: () => {
  //     toast.error("technical error generating the download link");
  //   },
  // });

  // const updateFormVisibilityMutation =
  //   api.form.updateFormVisibility.useMutation({
  //     onSuccess: () => {
  //       void client.form.getAllForms.invalidate();
  //     },
  //     onError: () => {
  //       toast.error("technical error setting form public");
  //     },
  //   });

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      void router.push({
        pathname: `/forms/${data.id}`,
      });
    },
  });

  // const deleteFormMutation = api.form.deleteForm.useMutation({
  //   onSuccess: () => {
  //     void client.form.getAllForms.invalidate();
  //   },
  //   onError: () => {
  //     toast.error("technical error deleting the form");
  //   },
  // });

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <DividerWithTitle>public</DividerWithTitle>
      {/* <p className="mt-1 mb-1 text-lg">public</p> */}
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
                    no public forms yet
                  </p>
                </div>
              </div>
            </>
          )}
      </div>
      <DividerWithTitle>not public</DividerWithTitle>
      {/* <p className="mt-1 mb-1 text-lg">not public</p> */}
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
      </div>
      {/* <div>
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
              <div className="mr-2 ml-1 md:mr-0 md:ml-0">
                <TrashIcon
                  className="h-7 w-7 cursor-pointer md:h-5 md:w-5"
                  onMouseEnter={() => setHoverItem("delete")}
                  onMouseLeave={() => setHoverItem("")}
                  onClick={() =>
                    void deleteFormMutation.mutate({ formId: f.id })
                  }
                />
                <EyeIcon
                  className="mt-1 mb-1 h-7 w-7 cursor-pointer md:h-5 md:w-5"
                  onMouseEnter={() => setHoverItem("change visibility")}
                  onMouseLeave={() => setHoverItem("")}
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
              void createFormMutation.mutate({
                name: "my new poll",
                description: "fill in all the fields",
              })
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
              <div className="mr-2 ml-1 md:mr-0 md:ml-0">
                <EyeIcon
                  className="h-7 w-7 cursor-pointer md:h-5 md:w-5"
                  onMouseEnter={() => setHoverItem("change visibility")}
                  onMouseLeave={() => setHoverItem("")}
                  onClick={() =>
                    void updateFormVisibilityMutation.mutate({
                      formId: f.id,
                      public: false,
                    })
                  }
                />
                <ShareIcon
                  className="mt-1 mr-1 h-7 w-7 cursor-pointer md:h-5 md:w-5"
                  onMouseEnter={() => setHoverItem("share form")}
                  onMouseLeave={() => setHoverItem("")}
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(`${window.location.href}public/forms/${f.id}`)
                      .then(() => toast.success("form url copied to clipboard"))
                      .catch(() => toast.error("error copying to clipboard"))
                  }
                />
                <ArrowDownTrayIcon
                  className="mt-1 mr-1 h-7 w-7 cursor-pointer md:h-5 md:w-5"
                  onMouseEnter={() => setHoverItem("download results")}
                  onMouseLeave={() => setHoverItem("")}
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
      </div> */}
    </div>
  );
}
