import { createUser } from "@/actions/userActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/UserForm";
import { redirect } from "next/navigation";

export default function CreateUserPage() {
  const handleSubmit = async (data: { name: string; email: string }) => {
    "use server";
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    const result = await createUser(formData);
    if (result.success) {
      redirect("/users");
    }
    return result;
  };

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold mb-4">
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <UserForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
