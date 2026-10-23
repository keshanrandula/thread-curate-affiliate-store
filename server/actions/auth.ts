"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, setAdminSession, clearAdminSession } from "@/lib/auth";
import { AdminLoginInputSchema } from "@/lib/validations";

export async function loginAction(prevState: any, formData: FormData) {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;

  const validation = AdminLoginInputSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    const issues = (validation.error as any).issues || (validation.error as any).errors || [];
    return {
      error: issues[0]?.message || validation.error.message || "Invalid input",
    };
  }

  const { email, password } = validation.data;
  const { user, error } = await authenticateAdmin(email, password);

  if (error || !user) {
    return {
      error: error || "Invalid email or password",
    };
  }

  await setAdminSession(user);
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";
  const destination = callbackUrl.startsWith("/admin") && !callbackUrl.includes("/login") ? callbackUrl : "/admin";
  redirect(destination);
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
