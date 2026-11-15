"use client"

import { BookOpen, Users, BarChart3, Shield, Clock, Smartphone, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: BookOpen,
    title: "Materi Interaktif",
    description:
      "Akses materi pelajaran lengkap dengan format yang mudah dipahami kapan saja.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/40",
  },
  {
    icon: Users,
    title: "Kolaborasi Kelas",
    description:
      "Berinteraksi dengan guru dan siswa lain secara terstruktur dan terpadu.",
    color: "text-orange",
    bg: "bg-orange/10",
    border: "hover:border-orange/40",
  },
  {
    icon: BarChart3,
    title: "Pantau Kemajuan & CBT",
    description:
      "Pantau progres belajar siswa, kuis, dan ujian CBT dengan analisis nilai otomatis.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/40",
  },
  {
    icon: Shield,
    title: "Aman & Anti-Cheat",
    description:
      "Dilengkapi pengawasan ujian canggih dengan deteksi perpindahan tab maksimal 3x.",
    color: "text-orange",
    bg: "bg-orange/10",
    border: "hover:border-orange/40",
  },
  {
    icon: Sparkles,
    title: "Sudah Terintegrasi dengan AI",
    description:
      "Pembuatan soal otomatis dengan AI lengkap dengan kunci jawaban, serta koreksi otomatis berbasis AI berdasarkan hasil pengerjaan siswa dan kunci jawaban AI.",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/40",
  },
  {
    icon: Smartphone,
    title: "Mobile & Desktop Friendly",
    description:
      "Antarmuka responsif yang sangat ringan dan presisi di layar laptop maupun ponsel.",
    color: "text-orange",
    bg: "bg-orange/10",
    border: "hover:border-orange/40",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export function FeaturesSection() {
  return (
    <section id="fitur" className="relative py-20 md:py-28 bg-transparent overflow-hidden scroll-mt-24">
      {/* Subtle continuous ambient drift */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] pointer-events-none hidden md:block"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5" />
            Fitur Andalan
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Fitur Unggulan SIAPOS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Dirancang khusus untuk memenuhi segala kebutuhan pembelajaran digital dan ujian terstandar di sekolah Anda.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group p-6 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 ${feature.border}`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
