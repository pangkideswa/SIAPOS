"use client"

import { motion } from "framer-motion"

export function DynamicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Seamless Continuous Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Connected Dynamic Floating Aurora Blobs spanning the entire page */}

      {/* Blob 1: Hero Top-Left (Primary Blue Glow) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-20 w-[550px] h-[550px] bg-primary/20 rounded-full blur-[120px]"
      />

      {/* Blob 2: Hero & Features Transition (Warm Orange/Amber Glow) */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.55, 0.25],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[500px] -right-24 w-[600px] h-[600px] bg-orange/20 rounded-full blur-[130px]"
      />

      {/* Blob 3: Features & Tentang Transition (Emerald / Teal Glow) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.45, 0.2],
          x: [-40, 40, -40],
          y: [-20, 20, -20],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[1300px] -left-24 w-[550px] h-[550px] bg-emerald-500/18 rounded-full blur-[130px]"
      />

      {/* Blob 4: Tentang & Stats Connection (Indigo / Primary Glow) */}
      <motion.div
        animate={{
          scale: [1.2, 0.95, 1.2],
          opacity: [0.2, 0.5, 0.2],
          x: [30, -30, 30],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[2000px] right-[5%] w-[500px] h-[500px] bg-primary/18 rounded-full blur-[120px]"
      />

      {/* Blob 5: Saran & Masukan Ambient (Vibrant Emerald / Cyan Glow) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.55, 0.25],
          x: [0, 45, 0],
          y: [0, -35, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[2700px] -left-16 w-[580px] h-[580px] bg-emerald-500/20 rounded-full blur-[130px]"
      />

      {/* Blob 6: Pre-CTA Glow (Warm Amber Glow) */}
      <motion.div
        animate={{
          scale: [1.1, 1.3, 1.1],
          opacity: [0.2, 0.45, 0.2],
          x: [-30, 30, -30],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-[3400px] right-[-5%] w-[520px] h-[520px] bg-orange/20 rounded-full blur-[120px]"
      />

      {/* Subtle Floating Sparkle Stars */}
      {[
        { top: "8%", left: "15%", delay: 0, duration: 4.2 },
        { top: "18%", right: "12%", delay: 1.2, duration: 5.1 },
        { top: "35%", left: "8%", delay: 2.1, duration: 4.6 },
        { top: "48%", right: "16%", delay: 0.6, duration: 3.9 },
        { top: "68%", left: "12%", delay: 1.8, duration: 5.3 },
        { top: "82%", right: "10%", delay: 2.4, duration: 4.4 },
      ].map((star, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
          style={{ top: star.top, left: (star as any).left, right: (star as any).right }}
          className="absolute w-2 h-2 rounded-full bg-primary/40 blur-[1px] hidden md:block"
        />
      ))}
    </div>
  )
}
