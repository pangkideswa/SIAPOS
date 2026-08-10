"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, GraduationCap, Laptop } from "lucide-react"
import { motion } from "framer-motion"

const floatingCards = [
  {
    icon: BookOpen,
    label: "Materi",
    color: "bg-primary/10 text-primary",
    position: "top-8 -left-4 sm:left-8 lg:left-16",
    delay: 0,
  },
  {
    icon: GraduationCap,
    label: "Tugas",
    color: "bg-orange/10 text-orange",
    position: "top-20 -right-2 sm:right-4 lg:right-12",
    delay: 0.2,
  },
  {
    icon: Laptop,
    label: "Digital",
    color: "bg-emerald-50 text-emerald-600",
    position: "bottom-8 left-4 sm:left-4 lg:left-20",
    delay: 0.4,
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-orange/5">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <BookOpen className="h-4 w-4" />
              SMK Wahana Bakti
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Belajar Lebih{" "}
              <span className="text-primary">Mudah</span>,{" "}
              Berkembang Lebih{" "}
              <span className="text-orange">Cepat</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Platform pembelajaran digital untuk SMK Wahana Bakti. Akses materi,
              kerjakan tugas, dan pantau perkembangan belajar dalam satu tempat.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href="/daftar">
                <Button size="lg" className="px-8 shadow-lg shadow-primary/25 w-full sm:w-auto">
                  Mulai Belajar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/masuk">
                <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="relative w-80 h-80"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-orange/20 blur-3xl" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary/10 to-orange/10 border border-white/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">SIAPOS</p>
                  <p className="text-xs text-muted-foreground mt-1">Platform Pembelajaran</p>
                </div>
              </div>

              {floatingCards.map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + card.delay, duration: 0.5 }}
                  className={`absolute ${card.position} inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-card shadow-lg shadow-black/5 border border-border/50`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{card.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
