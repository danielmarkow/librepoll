import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";

import { signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function Navbar() {
  const { status: sessionStatus, data: sessionData } = useSession();
  const router = useRouter();

  const createFormMutation = api.form.createForm.useMutation({
    onSuccess: (data) => {
      void router.push({
        pathname: `/forms/${data.id}`,
      });
    },
    onError: () => {
      toast.error("technical error creating a form");
    },
  });

  return (
    <>
      {sessionStatus === "authenticated" && (
        <Disclosure as="nav" className="bg-white shadow">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-12 justify-between">
                  <div className="flex">
                    <div className="-ml-2 mr-2 flex items-center md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-shrink-0 items-center">
                      {/* <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  /> */}
                    </div>
                    <div className="hidden md:ml-6 md:flex md:space-x-8">
                      {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                      <Link
                        href="/"
                        className="inline-flex items-center border-b-2 border-gray-500 px-1 pt-1 text-sm font-medium text-gray-900"
                      >
                        My Polls
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() =>
                            createFormMutation.mutate({
                              name: "my new poll",
                              description: "fill in all the fields",
                            })
                          }
                          type="button"
                          className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                          <PlusIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          New Poll
                        </button>
                      </div>
                      <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                        {/* <button
                        type="button"
                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                              <span className="sr-only">Open user menu</span>
                              {sessionData.user.image !== undefined &&
                              sessionData.user.image !== null ? (
                                <Image
                                  className="h-8 w-8 rounded-full"
                                  src={sessionData?.user.image}
                                  alt="user image"
                                  height={8}
                                  width={8}
                                />
                              ) : (
                                <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                                  <svg
                                    className="h-full w-full text-gray-300"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                </span>
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {/* <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item> */}
                              {/* <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Settings
                                </a>
                              )}
                            </Menu.Item> */}
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    onClick={() => void signOut()}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Sign out
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                  <Disclosure.Button
                    as="a"
                    href="/"
                    className="block border-l-4 border-gray-500 bg-gray-50 py-2 pl-3 pr-4 text-base font-medium text-gray-700 sm:pl-5 sm:pr-6"
                  >
                    My Polls
                  </Disclosure.Button>
                  {/* <Disclosure.Button
                    as="a"
                    href="#"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                  >
                    Personalized Polls
                  </Disclosure.Button> */}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      {sessionData.user.image !== undefined &&
                      sessionData.user.image !== null ? (
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={sessionData?.user.image}
                          alt=""
                          height={10}
                          width={10}
                        />
                      ) : (
                        <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {sessionData?.user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {sessionData?.user.email}
                      </div>
                    </div>
                    {/* <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                  </div>
                  <div className="mt-3 space-y-1">
                    {/* <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                    >
                      Settings
                    </Disclosure.Button> */}
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
}
