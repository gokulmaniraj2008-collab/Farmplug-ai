import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">The page you requested does not exist.</p>
        <Link href="/" className="mt-5 inline-block rounded-md bg-black px-4 py-2 text-sm text-white">
          Go home
        </Link>
      </div>
    </main>
  );
}
