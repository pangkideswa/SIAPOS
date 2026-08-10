"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, GraduationCap, Award } from "lucide-react"

const stats = [
  { icon: BookOpen, value: "50+", label: "Materi Tersedia", color: "text-primary" },
  { icon: Users, value: "20+", label: "Guru Aktif", color: "text-orange" },
  { icon: GraduationCap, value: "500+", label: "Siswa Terdaftar", color: "text-primary" },
  { icon: Award, value: "100%", label: "Gratis", color: "text-orange" },
]

export function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-card border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/60 ${stat.color} mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
