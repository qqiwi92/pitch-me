import { createClient } from "@/components/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import QuizCreator from "./quiz_creator";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (
    !["epochta@yahoo.com", "mit.levkin@vk.com"].includes(
      data?.user?.email ?? "",
    )
  ) {
    notFound();
  }
  return (
    <div className="mx-auto my-36 w-full max-w-3xl">
      <QuizCreator />
    </div>
  );
}
