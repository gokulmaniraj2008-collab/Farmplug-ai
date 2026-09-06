import RoleWorkspace from "@/components/role-workspace";

export default async function AdminRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <RoleWorkspace role="admin" slug={slug} />;
}
