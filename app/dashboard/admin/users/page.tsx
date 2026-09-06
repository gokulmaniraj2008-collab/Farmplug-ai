// File location: app/dashboard/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  auth_provider: string | null;
  profile_complete: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, auth_provider, profile_complete")
      .order("full_name");
    setUsers(data ?? []);
    setLoading(false);
  }

  const filtered =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  if (loading) return <div className="p-6 text-gray-500">Loading users...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Users</h1>

      <div className="mt-3 flex gap-2">
        {["all", "farmer", "buyer", "fpo", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === r
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Sign-up method</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{u.full_name ?? "—"}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role ?? "unassigned"}</td>
                <td className="px-4 py-2 capitalize">{u.auth_provider ?? "email"}</td>
                <td className="px-4 py-2">
                  {u.profile_complete ? (
                    <span className="text-green-700">Complete</span>
                  ) : (
                    <span className="text-amber-600">Incomplete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Read-only. Role changes (e.g. granting Admin) must be done via a
        server-side/service-role action, never from this UI directly.
      </p>
    </div>
  );
}
