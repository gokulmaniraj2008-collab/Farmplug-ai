import RoleWorkspace from "@/components/role-workspace";

export default async function FarmerRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <RoleWorkspace role="farmer" slug={slug} />;
}
