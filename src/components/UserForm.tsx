"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  defaultValues?: UserFormValues;
  onSubmit: (
    data: UserFormValues
  ) => Promise<{ success: boolean; error?: string }>;
}

export function UserForm({ defaultValues, onSubmit }: Readonly<UserFormProps>) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues || { name: "", email: "" },
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: UserFormValues) => {
    startTransition(async () => {
      const result = await onSubmit(data);
      if (result.success) {
        toast.success(
          defaultValues
            ? "User updated successfully"
            : "User created successfully"
        );
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  let buttonLabel: string;

  if (isPending) {
    buttonLabel = defaultValues ? "Updating..." : "Creating...";
  } else {
    buttonLabel = defaultValues ? "Update" : "Create";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full mt-4">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
}
