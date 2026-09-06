// File location: app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-green-700">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">This page doesn't exist</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">The page you're looking for may have moved or the link may be outdated.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white">Go to homepage</Link>
        <Link href="/support" className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700">Contact support</Link>
      </div>
    </div>
  );
}
