"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Laptop,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      {/* Background Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      {/* Decorative Continuous Ambient Glowing Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
          y: [0, -35, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-[-10%] w-[520px] h-[520px] bg-primary/20 rounded-full blur-[110px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.55, 0.25],
          x: [0, -45, 0],
          y: [0, 45, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-5%] w-[620px] h-[620px] bg-orange/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.4, 0.15],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none"
      />

      {/* Ambient Floating Sparkles / Particles */}
      {[
        { top: "15%", left: "12%", delay: 0, duration: 4 },
        { top: "25%", right: "18%", delay: 1, duration: 5 },
        { top: "65%", left: "8%", delay: 2, duration: 4.5 },
        { top: "75%", right: "12%", delay: 0.5, duration: 3.8 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          style={{ top: p.top, left: (p as any).left, right: (p as any).right }}
          className="absolute w-2 h-2 rounded-full bg-primary/50 blur-[1px] hidden md:block pointer-events-none"
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-36 md:pb-32 lg:pb-36">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading, description, CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            {/* Live Status Pill with Ping Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 bg-card/80 border border-primary/20 backdrop-blur-md text-foreground px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-primary/10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-primary font-bold">SIAPOS 2.0</span>
              <span className="text-muted-foreground/80">•</span>
              <span className="text-muted-foreground">Platform Asesmen & CBT Terpadu</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
              Belajar Lebih{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Mudah
              </span>
              ,{" "}
              <br className="hidden sm:inline" />
              Berkembang Lebih{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">
                Cepat
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ekosistem digital terpadu untuk sekolah masa kini. Manajemen kelas, materi interaktif, bank soal kurikulum, serta ujian online <strong>CBT dengan proteksi anti-cheat cerdas</strong> dalam satu tempat.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link href="/masuk" className="w-full sm:w-auto">
                <Button size="lg" className="px-7 h-12 shadow-lg shadow-primary/25 w-full sm:w-auto font-semibold gap-2 group active:bg-blue-700 active:scale-[0.97] transition-all">
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#fitur" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-7 h-12 border-border/80 bg-card/70 hover:bg-card active:bg-primary/10 active:text-primary active:border-primary/40 active:scale-[0.97] text-foreground backdrop-blur-sm w-full sm:w-auto font-semibold gap-2 transition-all"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Jelajahi Fitur</span>
                </Button>
              </a>
            </div>

            {/* Quick Live Stats Pill */}
            <div className="mt-10 pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Bebas Biaya</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Anti-Cheat 3x Proteksi</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Koreksi AI Real-time</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Interactive Showcase with Continuous Idle Floating Motion */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Main Showcase Container with Continuous Gentle Float */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [-0.6, 0.6, -0.6],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-[460px]"
            >
              {/* Vibrant Glow Backdrop */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 via-emerald-500/20 to-orange/30 blur-2xl opacity-70" />

              {/* Main Simulated Interactive Dashboard Card */}
              <div className="relative rounded-3xl bg-card/90 dark:bg-card/95 border border-white/60 dark:border-border/80 p-6 sm:p-7 shadow-2xl shadow-primary/10 backdrop-blur-xl space-y-5">
                {/* Simulated Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shadow-inner">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">SIAPOS Smart CBT</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] text-muted-foreground font-medium">Sesi Ujian Aktif</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Live Room
                  </span>
                </div>

                {/* Simulated Exam Card with Live Animating Progress Bar */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Penilaian Akhir Semester (PAS)</span>
                    <span className="text-primary font-bold font-mono">Soal 8 / 10</span>
                  </div>

                  {/* Dynamic looping progress bar */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      animate={{
                        width: ["40%", "85%", "40%"],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange animate-spin [animation-duration:8s]" />
                      <span>Sisa Waktu: 42:15</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Pelanggaran: 0 / 3 (Aman)
                    </span>
                  </div>
                </div>

                {/* Simulated Quick Action Modules */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">Bank Soal</p>
                      <p className="text-[10px] text-muted-foreground">10 Butir Siap</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange/5 border border-orange/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange/15 flex items-center justify-center text-orange shrink-0">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">Nilai Otomatis</p>
                      <p className="text-[10px] text-muted-foreground">Koreksi Cepat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Anti-Cheat Shield (Top Left Float) */}
              <motion.div
                animate={{
                  y: [-10, 8, -10],
                  x: [-4, 4, -4],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="absolute -top-5 -left-4 sm:-left-8 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card/95 border border-emerald-500/30 shadow-xl shadow-black/10 backdrop-blur-md"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">Anti-Cheat 3x</p>
                  <p className="text-[10px] text-muted-foreground">Proteksi Tab & Window</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: AI Evaluation (Bottom Right Float) */}
              <motion.div
                animate={{
                  y: [8, -10, 8],
                  x: [4, -4, 4],
                }}
                transition={{
                  duration: 5.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute -bottom-5 -right-4 sm:-right-6 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card/95 border border-primary/30 shadow-xl shadow-black/10 backdrop-blur-md"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">Analisis AI Guru</p>
                  <p className="text-[10px] text-muted-foreground">Koreksi Esai Presisi</p>
                </div>
              </motion.div>

              {/* Floating Badge 3: Siswa Online (Top Right Float) */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotate: [1, -1, 1],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute top-16 -right-6 sm:-right-10 hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/95 border border-border shadow-lg shadow-black/5 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-foreground">500+ Siswa Aktif</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
