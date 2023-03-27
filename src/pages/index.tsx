import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import FormSelector from "~/components/FormSelector";
import Loading from "~/components/common/Loading";

const Home: NextPage = () => {
  const { status: sessionStatus } = useSession();
  return (
    <>
      <main>
        {sessionStatus === "authenticated" && (
          <>
            <FormSelector />
          </>
        )}
        {sessionStatus === "unauthenticated" && (
          <>
            <div className="mx-auto flex h-screen max-w-2xl items-center text-center">
              <div className="w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  LibrePoll
                </h1>

                <p>- public beta -</p>
                <button
                  onClick={() => void signIn()}
                  type="button"
                  className="mt-5 rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Login
                </button>
              </div>
            </div>
          </>
        )}{" "}
        {sessionStatus === "loading" && (
          <div className="flex min-h-screen flex-col items-center justify-center">
            <Loading />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
