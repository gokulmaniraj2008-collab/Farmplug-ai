import RoleNavigation from "@/components/navigation/RoleNavigation";

export default function FarmerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><RoleNavigation role="farmer" /><main className="fp-workspace-content">{children}</main></>;
}
