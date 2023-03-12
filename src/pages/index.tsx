import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import CreatePoll from "~/components/CreatePoll";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <main>
        {sessionData ? (
          <CreatePoll />
        ) : (
          <button
            onClick={() => void signIn()}
            type="button"
            className="rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Login
          </button>
        )}
      </main>
    </>
  );
};

export default Home;
