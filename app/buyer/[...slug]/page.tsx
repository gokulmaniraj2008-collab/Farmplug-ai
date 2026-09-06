import RoleWorkspace from "@/components/role-workspace";

export default async function BuyerRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <RoleWorkspace role="buyer" slug={slug} />;
}
