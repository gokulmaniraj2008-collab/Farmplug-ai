import RoleNavigation from "@/components/navigation/RoleNavigation";

export default function FpoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><RoleNavigation role="fpo" /><main className="fp-workspace-content">{children}</main></>;
}
