import * as React from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.textarea
        layout
        className={cn(
          "flex w-full resize-none rounded-md border border-input bg-background p-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...(props as any)}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
