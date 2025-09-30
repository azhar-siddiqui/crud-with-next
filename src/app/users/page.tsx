import { deleteUser, getUsers } from "@/actions/userActions";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <Link href="/users/create">
        <Button>Create New User</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full col-span-3">
            <p className="text-2xl">No users found</p>
          </div>
        ) : (
          users?.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{user.email}</p>
                <div className="flex space-x-2 mt-2">
                  <Link href={`/users/view/${user.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link href={`/users/edit/${user.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <ConfirmationDialog
                    trigger={<Button variant="destructive">Delete</Button>}
                    title="Confirm Delete"
                    description={`Are you sure you want to delete ${user.name}?`}
                    onConfirm={async () => {
                      "use server";
                      return await deleteUser(user.id);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
