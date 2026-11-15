"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      {/* Mobile-optimized Instant Ambient Glow (0% CPU, clean radial gradient) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[320px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none md:hidden" />

      {/* Desktop Continuous Gentle Ambient Bloom */}
      <div className="absolute top-6 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[110px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-orange/10 rounded-full blur-[120px] pointer-events-none hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-36 md:pb-32 lg:pb-36">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, description, CTA */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            {/* Live Status Pill with Ping Animation */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-card/90 border border-primary/20 text-foreground px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-primary/10 max-w-full">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-primary font-bold whitespace-nowrap shrink-0">SIAPOS 2.0</span>
              <span className="text-muted-foreground/80 shrink-0">•</span>
              <span className="text-muted-foreground whitespace-nowrap">Platform Asesmen & CBT Terpadu</span>
            </div>

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

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
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
                  className="px-7 h-12 border-border/80 bg-card hover:bg-muted active:bg-primary/10 active:text-primary active:border-primary/40 active:scale-[0.97] text-foreground w-full sm:w-auto font-semibold gap-2 transition-all shadow-xs"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Jelajahi Fitur</span>
                </Button>
              </a>
            </div>

            {/* Quick Live Stats Pill */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Bebas Biaya</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Anti-Cheat 3x Proteksi</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Koreksi AI Real-time</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Interactive Showcase with Lightweight GPU CSS Float */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-4 sm:pt-0">
            {/* Main Showcase Container with Hardware-Accelerated Gentle Float */}
            <div className="relative w-full max-w-[460px] animate-float-gentle">
              {/* Vibrant Glow Backdrop */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/25 via-emerald-500/15 to-orange/20 blur-xl opacity-65 pointer-events-none" />

              {/* Main Simulated Interactive Dashboard Card */}
              <div className="relative rounded-3xl bg-card/95 border border-border/80 p-5 sm:p-7 shadow-xl shadow-primary/5 space-y-4 sm:space-y-5 transition-all">
                {/* Simulated Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
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

                  {/* Dynamic looping progress bar (CSS ScaleX - zero layout reflow) */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-primary to-emerald-500 rounded-full animate-progress-smooth" />
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
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">Bank Soal</p>
                      <p className="text-[10px] text-muted-foreground">10 Butir Siap</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange/5 border border-orange/15 flex items-center gap-2.5 sm:gap-3">
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

              {/* Floating Badge 1: Anti-Cheat Shield (Top Left Counter-Float) */}
              <div className="absolute -top-3 left-1 sm:-top-5 sm:-left-8 inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-card/95 border border-emerald-500/30 shadow-lg shadow-black/5 animate-float-reverse whitespace-nowrap">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight whitespace-nowrap">Anti-Cheat 3x</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">Proteksi Tab & Window</p>
                </div>
              </div>

              {/* Floating Badge 2: AI Evaluation (Bottom Right Counter-Float) */}
              <div className="absolute -bottom-3 right-1 sm:-bottom-5 sm:-right-6 inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-card/95 border border-primary/30 shadow-lg shadow-black/5 animate-float-gentle whitespace-nowrap">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight whitespace-nowrap">Analisis AI Guru</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">Koreksi Esai Presisi</p>
                </div>
              </div>

              {/* Floating Badge 3: Siswa Online (Top Right Float) */}
              <div className="absolute top-12 -right-1 sm:top-16 sm:-right-10 inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-card/95 border border-border shadow-md shadow-black/5 animate-float-reverse whitespace-nowrap">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">500+ Siswa Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
