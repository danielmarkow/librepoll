import CreateForm from "~/components/CreateForm";
import PreRenderForm from "~/components/PreRenderForm";

export default function FormEdit() {
  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="h-screen border border-dashed border-gray-500">
        <CreateForm />
      </div>
      <div className="h-screen border border-dashed border-gray-500">
        <PreRenderForm />
      </div>
    </div>
  );
}
