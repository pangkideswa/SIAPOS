"use client"

import { BookOpen, Users, BarChart3, Shield, Clock, Smartphone } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: BookOpen,
    title: "Materi Interaktif",
    description:
      "Akses materi pelajaran lengkap dengan format yang mudah dipahami.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Kolaborasi Kelas",
    description:
      "Berinteraksi dengan guru dan siswa lain secara real-time.",
    color: "text-orange",
    bg: "bg-orange/10",
  },
  {
    icon: BarChart3,
    title: "Pantau Kemajuan",
    description:
      "Guru dan siswa dapat memantau progres belajar melalui dashboard.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description:
      "Data siswa tersimpan aman dengan autentikasi berbasis role.",
    color: "text-orange",
    bg: "bg-orange/10",
  },
  {
    icon: Clock,
    title: "Akses Kapan Saja",
    description:
      "Belajar tidak terbatas waktu dan tempat, tersedia 24 jam.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Tampilan responsif yang nyaman diakses dari smartphone maupun laptop.",
    color: "text-orange",
    bg: "bg-orange/10",
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
    <section id="fitur" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Fitur Unggulan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Dirancang untuk memenuhi kebutuhan pembelajaran digital di SMK
            Wahana Bakti.
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
              className="group p-6 rounded-2xl border border-border/60 bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} ${feature.color} mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
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
