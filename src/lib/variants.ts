import { Variants } from "framer-motion";

export const heightVariants = {
  initial: {
    height: "0px",
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
  },
  exit: {
    height: "0px",
    opacity: 0,
  },
} satisfies Variants;
