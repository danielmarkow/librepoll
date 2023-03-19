import { useSession, signIn } from "next-auth/react";

import Button from "~/components/common/Button";
import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";

export default function CreateNewForm() {
  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData ? (
        <div className="mt-1 grid grid-cols-2 gap-1">
          <div className="h-screen border-2 border-dashed border-gray-300 p-1">
            <CreateForm />
          </div>
          <div className="h-screen border-2 border-dashed border-gray-300 p-1">
            <PreRenderForm />
          </div>
        </div>
      ) : (
        <>
          <p>please login to create forms</p>
          <Button onClick={() => void signIn()}>login</Button>
        </>
      )}
    </>
  );
}
