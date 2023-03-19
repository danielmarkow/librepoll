import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import FormSelector from "~/components/FormSelector";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <main>
        {sessionData ? (
          <>
            <FormSelector />
          </>
        ) : (
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
        )}
      </main>
    </>
  );
};

export default Home;
