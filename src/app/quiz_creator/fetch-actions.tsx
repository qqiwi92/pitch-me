"use server";

import { createClient } from "@/components/utils/supabase/server";
import { createClient as createNewClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function checkAuth() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
}
async function supabaseFetch(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: any,
) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL_QUIZ_COIN}/rest/v1/${endpoint}`;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_QUIZ_COIN;

  const response = await fetch(url, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  } as any);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error with Supabase request");
  }
  if (method === "GET") return await response.json();
  return null;
}

// Function to delete a quiz by ID
export async function deleteQuiz({ id }: { id: string }) {
  await checkAuth();
  return await supabaseFetch(`quizes?id=eq.${id}`, "DELETE");
}

export async function createQuiz({ quiz }: { quiz: string }) {
  await checkAuth();
  return await supabaseFetch("quizes", "POST", { quiz: quiz });
}

export async function getQuizes() {
  await checkAuth();
  return await supabaseFetch("quizes", "GET");
}
