import { getUserById } from "@/actions/userActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ViewUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return <div className="container mx-auto p-4">User not found</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto p-4">
      <Card className="w-full max-w-md gap-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
