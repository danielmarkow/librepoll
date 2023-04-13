import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";

import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function FormDropDownPublic({ id }: { id: string }) {
  const client = api.useContext();

  // mutations
  const updateFormVisibilityMutation =
    api.form.updateFormVisibility.useMutation({
      onSuccess: () => {
        void client.form.getAllForms.invalidate();
      },
      onError: () => {
        toast.error("technical error setting form public");
      },
    });

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
  // ---

  return (
    <Menu as="div" className="relative mt-1 mr-1 inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={() =>
                    void updateFormVisibilityMutation.mutate({
                      public: false,
                      formId: id,
                    })
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block cursor-pointer px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex justify-start">
                    <div>
                      <EyeIcon className="h-5 w-5" />{" "}
                    </div>
                    <div className="ml-1">Unpublish</div>
                  </div>
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={() =>
                    void createDownloadLinkMut.mutate({
                      formId: id,
                    })
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block cursor-pointer px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex justify-start">
                    <div>
                      <ArrowDownTrayIcon className="h-5 w-5" />{" "}
                    </div>
                    <div className="ml-1">Download</div>
                  </div>
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(`${window.location.href}public/forms/${id}`)
                      .then(() => toast.success("form url copied to clipboard"))
                      .catch(() => toast.error("error copying to clipboard"))
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block cursor-pointer px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex justify-start">
                    <div>
                      <ShareIcon className="h-5 w-5" />{" "}
                    </div>
                    <div className="ml-1">Share</div>
                  </div>
                </span>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
