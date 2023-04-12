export default function DividerWithTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-4 mb-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
          {children}
        </span>
      </div>
    </div>
  );
}
