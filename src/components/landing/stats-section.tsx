"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, GraduationCap, Award, Sparkles, CheckCircle2 } from "lucide-react"

const stats = [
  {
    icon: BookOpen,
    value: "50+",
    label: "Materi Pembelajaran",
    pill: "Kurikulum Terpadu",
    color: "text-primary",
    bg: "bg-primary/10",
    borderHover: "hover:border-primary/50",
    delay: 0,
  },
  {
    icon: Users,
    value: "20+",
    label: "Guru Pengajar Aktif",
    pill: "Terverifikasi",
    color: "text-orange",
    bg: "bg-orange/10",
    borderHover: "hover:border-orange/50",
    delay: 0.15,
  },
  {
    icon: GraduationCap,
    value: "500+",
    label: "Siswa Terdaftar",
    pill: "Aktif Belajar & CBT",
    color: "text-primary",
    bg: "bg-primary/10",
    borderHover: "hover:border-primary/50",
    delay: 0.3,
  },
  {
    icon: Award,
    value: "100%",
    label: "Gratis & Mandiri",
    pill: "Akses Penuh Sekolah",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/50",
    delay: 0.45,
  },
]

export function StatsSection() {
  return (
    <section className="relative py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`p-4 sm:p-7 rounded-3xl bg-card/85 dark:bg-card/90 border border-border/80 ${stat.borderHover} shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] group relative overflow-hidden flex flex-col items-center justify-center text-center cursor-default`}
            >
              {/* Top Accent Hover Glow Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating Stat Icon */}
              <motion.div
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{
                  duration: 3.5 + stat.delay * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: stat.delay,
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-inner`}
              >
                <stat.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </motion.div>

              {/* Value */}
              <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                {stat.value}
              </p>

              {/* Label */}
              <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-bold text-foreground/80 line-clamp-1">
                {stat.label}
              </p>

              {/* Pill Badge */}
              <span className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{stat.pill}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
