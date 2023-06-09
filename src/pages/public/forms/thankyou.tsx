import Link from "next/link";
export default function ThankYou() {
  return (
    <>
      <div className="mx-auto flex h-screen max-w-2xl items-center text-center">
        <div className="w-full">
          <p>thank you for participating in this survey</p>
          <Link href="/">
            <p className="text-gray-400">powered by librepoll</p>
          </Link>
        </div>
      </div>
    </>
  );
}
