"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const highlights = [
  "Platform khusus SMK Wahana Bakti",
  "Mudah digunakan untuk guru dan siswa",
  "Tersedia di smartphone dan laptop",
  "Akses materi dan tugas kapan saja",
]

export function AboutSection() {
  return (
    <section id="tentang" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Tentang SIAPOS
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              SIAPOS adalah Education Operating System yang dirancang
              khusus untuk SMK Wahana Bakti. Kami memudahkan proses belajar
              mengajar dengan teknologi modern yang simpel dan ramah pengguna.
            </p>

            <div className="mt-8 space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-white to-orange/10 border border-border/50 p-8 sm:p-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary">
                    Guru
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kelola materi & tugas
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-orange">
                    Siswa
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Belajar kapan saja
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary">
                    Admin
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kelola pengguna
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-orange">
                    Wali
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pantau perkembangan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
