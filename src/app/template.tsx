"use client";

import { createClient } from "@/components/utils/supabase/client";
import { motion } from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        pathname !== "/login" && pathname !== "/error" && redirect("/login");
      }
    };

    checkAuth();
  }, [pathname]);

  return (
    <div className="remove-scrollbar">
      {children}

      <motion.div
        initial={{ opacity: 1 }}
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 bg-background"
        animate={{ opacity: 0 }}
      />
    </div>
  );
}
