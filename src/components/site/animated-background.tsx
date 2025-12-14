"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <>
      {/* Layer 1: Animated blobs with accent colors */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Violet blob - top left */}
        <motion.div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent-violet/20 dark:bg-accent-violet/15 blur-[100px]"
          animate={{
            x: [0, 50, -30, 50, 0],
            y: [0, -60, 40, -30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Emerald blob - center right */}
        <motion.div
          className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-accent-emerald/15 dark:bg-accent-emerald/10 blur-[100px]"
          animate={{
            x: [0, -40, 30, -20, 0],
            y: [0, 50, -40, 30, 0],
            scale: [1, 0.95, 1.1, 0.98, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Amber blob - bottom left */}
        <motion.div
          className="absolute bottom-20 left-1/4 h-[450px] w-[450px] rounded-full bg-accent-amber/15 dark:bg-accent-amber/10 blur-[100px]"
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -40, 50, -30, 0],
            scale: [1, 1.05, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Rose blob - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-accent-rose/10 dark:bg-accent-rose/5 blur-[100px]"
          animate={{
            x: [0, -50, 40, -30, 0],
            y: [0, 40, -50, 35, 0],
            scale: [1, 0.9, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>

      {/* Layer 2: Glass overlay that stays fixed on scroll */}
      <div className="fixed inset-0 -z-10 bg-background/80 dark:bg-background/90 backdrop-blur-[2px] pointer-events-none" />
    </>
  );
}
