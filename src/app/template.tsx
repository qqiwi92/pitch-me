"use client";

import { createClient } from "@/components/utils/supabase/client";
import { motion } from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        if (pathname !== "/login" && pathname !== "/error") {
          redirect("/login");
        }
      }
    };

    checkAuth();
  }, [pathname]);

  return <div className="remove-scrollbar animate-fadeIn">{children}</div>;
}
