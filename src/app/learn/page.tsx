import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LearnPage } from "@/components/learn/learn-page";

export default async function Learn() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <LearnPage />;
}
