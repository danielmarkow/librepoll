import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";

export default function CreateNewForm() {
  return (
    <div className="mt-1 grid grid-cols-2 gap-1">
      <div className="h-screen border-2 border-dashed border-gray-300 p-1">
        <CreateForm />
      </div>
      <div className="h-screen border-2 border-dashed border-gray-300 p-1">
        <PreRenderForm />
      </div>
    </div>
  );
}
