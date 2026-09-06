import RoleNavigation from "@/components/navigation/RoleNavigation";

export default function BuyerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><RoleNavigation role="buyer" /><main className="fp-workspace-content">{children}</main></>;
}
