import { Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";

import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function FormDropDownPrivate({
  id,
  setModalOpen,
  setModalFormId,
}: {
  id: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalFormId: Dispatch<SetStateAction<string>>;
}) {
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
                      public: true,
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
                    <div className="ml-1">Publish</div>
                  </div>
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={() => {
                    setModalOpen(true);
                    setModalFormId(id);
                  }}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block cursor-pointer px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex justify-start">
                    <div>
                      <TrashIcon className="h-5 w-5" />{" "}
                    </div>
                    <div className="ml-1">Delete Poll</div>
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
