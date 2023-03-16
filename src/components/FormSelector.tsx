import Link from "next/link";
import { api } from "~/utils/api";

export default function FormSelector() {
  const getAllFormsQuery = api.form.getAllForms.useQuery();

  return (
    <>
      <p>form selector</p>
      <div className="flex gap-1">
        {getAllFormsQuery.isSuccess &&
          getAllFormsQuery.data.length > 0 &&
          getAllFormsQuery.data.map((f) => (
            <>
              <div className="border-2 border-dashed border-gray-300 px-1">
                <Link href={`/forms/${f.id}`}>{f.name}</Link>
              </div>
            </>
          ))}
        <div className="border-2 border-dashed border-gray-700 px-1">
          <Link href={`/forms/create-form`}>create form</Link>
        </div>
      </div>
    </>
  );
}
