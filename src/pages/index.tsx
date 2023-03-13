import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";
import FormProvider from "~/context/FormProvider";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <main>
        {sessionData ? (
          <div className="grid grid-cols-2 gap-1">
            <FormProvider>
              <div className="h-screen border border-dashed border-gray-500">
                <CreateForm />
              </div>
              <div className="h-screen border border-dashed border-gray-500">
                <PreRenderForm />
              </div>
            </FormProvider>
          </div>
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
