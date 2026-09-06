// File location: app/forbidden/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const WORKSPACE_BY_ROLE: Record<string, string> = {
  farmer: "/dashboard/farmer",
  buyer: "/dashboard/buyer",
  fpo: "/dashboard/fpo",
  admin: "/dashboard/admin",
};

export default function ForbiddenPage() {
  const [homeLink, setHomeLink] = useState("/");

  useEffect(() => {
    async function loadRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (profile?.role && WORKSPACE_BY_ROLE[profile.role]) setHomeLink(WORKSPACE_BY_ROLE[profile.role]);
    }
    loadRole();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">You don't have access to this page</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">This area belongs to a different account role. If you think this is wrong, contact support or sign in with the correct account.</p>
      <Link href={homeLink} className="mt-6 rounded-md bg-green-600 px-5 py-2.5 font-medium text-white">Go to my workspace</Link>
    </div>
  );
}
