"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Users,
  CheckCircle2,
  Cpu,
  BookOpen,
} from "lucide-react"

export function AuthVisualShowcase() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden text-white select-none">
      {/* 1. Deep Royal Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-primary to-indigo-950 pointer-events-none" />

      {/* 2. Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* 3. Dynamic Animated Aurora Glowing Blobs (Smooth breathing & drift) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, 40, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-sky-400/30 rounded-full blur-[90px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.25, 1, 1.25],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -35, 0],
          y: [0, 35, 0],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-28 -right-20 w-[450px] h-[450px] bg-orange/25 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[90px] pointer-events-none"
      />

      {/* 4. Background Floating Watermark Icons (Adds visual depth without clutter) */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 right-12 text-white/[0.04] pointer-events-none hidden xl:block"
      >
        <GraduationCap className="w-36 h-36" />
      </motion.div>
      <motion.div
        animate={{
          y: [10, -10, 10],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-28 left-10 text-white/[0.04] pointer-events-none hidden xl:block"
      >
        <ShieldCheck className="w-36 h-36" />
      </motion.div>

      {/* Drifting Ambient Glow Particles */}
      {[
        { top: "18%", left: "15%", delay: 0, duration: 4 },
        { top: "72%", left: "20%", delay: 1.5, duration: 5 },
        { top: "32%", right: "16%", delay: 0.8, duration: 4.5 },
        { top: "82%", right: "18%", delay: 2, duration: 3.8 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          style={{ top: p.top, left: (p as any).left, right: (p as any).right }}
          className="absolute w-2 h-2 rounded-full bg-white/60 blur-[1px] pointer-events-none"
        />
      ))}

      {/* 5. TOP BAR: Back to Home Shortcut & Version Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/90 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 group shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>SIAPOS v2.0</span>
        </div>
      </div>

      {/* 6. CENTERPIECE: Spacious Headline + Clean Glass Card + Floating Feature Badges */}
      <div className="relative z-10 my-auto py-6 max-w-lg w-full mx-auto">
        {/* Brand Headline */}
        <div className="text-center lg:text-left mb-7">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/30 shadow-lg backdrop-blur-md p-2 transition-transform group-hover:scale-105 active:scale-95">
              <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-2xl tracking-tight text-white leading-none">
                SIAPOS
              </span>
              <span className="text-[11px] font-medium text-white/75 mt-1">
                Education Operating System
              </span>
            </div>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
            Belajar Lebih Mudah, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-300">
              Berkembang Lebih Cepat
            </span>
          </h2>
          <p className="mt-2.5 text-xs xl:text-sm text-white/80 max-w-md leading-relaxed">
            Sistem Integrasi Akademik dan Pembelajaran Online Sekolah. Akses ujian CBT mandiri, bank soal, dan analisis cerdas dalam satu portal.
          </p>
        </div>

        {/* Glassmorphic Interactive Status Card (Clean & Unobstructed) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-white/10 border border-white/20 p-5 sm:p-6 backdrop-blur-xl shadow-2xl"
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                SIAPOS Smart CBT Engine
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Live Ready
            </span>
          </div>

          {/* Card Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex justify-center mb-1 text-sky-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="text-base font-extrabold text-white">50+</div>
              <div className="text-[10px] text-white/70">Materi Siap</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex justify-center mb-1 text-purple-300">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="text-base font-extrabold text-white">AI Real-time</div>
              <div className="text-[10px] text-white/70">Koreksi Cepat</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex justify-center mb-1 text-amber-300">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-base font-extrabold text-white">500+</div>
              <div className="text-[10px] text-white/70">Siswa Aktif</div>
            </div>
          </div>

          {/* Animated System Ready Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-white/85 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Koneksi Server Sekolah Terenkripsi
              </span>
              <span className="text-emerald-300 font-bold">100%</span>
            </div>
            <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: "20%" }}
                animate={{ width: ["70%", "100%", "70%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* 7. Spacious Floating Feature Pills Row (Zero Collisions, Breathing Room) */}
        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-lg text-xs font-semibold text-white/95 transition-all"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span>Anti-Cheat 3x Proteksi</span>
          </motion.div>

          <motion.div
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-lg text-xs font-semibold text-white/95 transition-all"
          >
            <div className="w-5 h-5 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>AI Soal & Koreksi</span>
          </motion.div>

          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-lg text-xs font-semibold text-white/95 transition-all"
          >
            <div className="w-5 h-5 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <span>Kurikulum Merdeka</span>
          </motion.div>
        </div>
      </div>

      {/* 8. BOTTOM FOOTNOTE */}
      <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-white/75 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-medium text-center sm:text-left">
          Sistem Integrasi Akademik dan Pembelajaran Online Sekolah
        </span>
        <span className="text-[11px] text-white/60">
          © {new Date().getFullYear()} SIAPOS
        </span>
      </div>
    </div>
  )
}
