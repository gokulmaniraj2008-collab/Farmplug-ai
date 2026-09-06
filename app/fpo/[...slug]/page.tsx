import RoleWorkspace from "@/components/role-workspace";

export default async function FpoRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <RoleWorkspace role="fpo" slug={slug} />;
}
