"use server";

import { createClient } from "@/components/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  console.log("started");
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const data = await supabase.auth.signInWithOtp({ email });
  console.log(data);
  if (data.error?.code === "invalid_credentials") {
    redirect("/login?t=invalid_credentials");
  }
  if (data.error) {
    redirect("/error");
  }
}
export async function verifyOtp(formData: FormData) {
  console.log("started");
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });
  if (error?.code === "otp_expired") {
    redirect("/login?t=otp_expired");
  }
  if (error) {
    redirect("/error");
  } else {
    redirect("/");
  }
}
