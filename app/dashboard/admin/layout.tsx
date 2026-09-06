import RoleNavigation from "@/components/navigation/RoleNavigation";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><RoleNavigation role="admin" /><main className="fp-workspace-content">{children}</main></>;
}
