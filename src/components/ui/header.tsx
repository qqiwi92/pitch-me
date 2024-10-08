"use client";
import {
  useScroll,
  useTransform,
  motion,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
export default function Header() {
  const { scrollY } = useScroll();

  const textSizeLinear = useTransform(scrollY, [0, 80], [3.6, 1.25]);
  const textSize = useSpring(textSizeLinear, {
    stiffness: 1000,
    damping: 100,
    mass: 0.1,
    duration: 0.1,
  });

  const textSizeRem = useMotionTemplate`${textSize}rem`;
  return (
    <div className="bg-opacity-radial-gradient fixed left-1/2 top-2 z-[10] w-fit -translate-x-1/2 rounded-xl px-4 backdrop-blur-xl">
      <motion.h1
        style={{
          fontSize: textSizeRem,
          paddingTop: textSizeLinear,
          paddingBottom: textSizeLinear.get() - 1,
        }}
        className="z-[100] flex select-none items-center justify-center gap-2 font-bold leading-tight"
        draggable={false}
      >
        <span>smoother!</span>
      </motion.h1>
    </div>
  );
}
