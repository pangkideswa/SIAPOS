"use client"

import { motion } from "framer-motion"
import { CheckCircle2, GraduationCap, Laptop, ShieldCheck } from "lucide-react"

const highlights = [
  "Ekosistem digital terintegrasi untuk institusi pendidikan",
  "Antarmuka intuitif dan ramah pengguna untuk semua kalangan",
  "Akses fleksibel lintas perangkat (Desktop, Tablet, Mobile)",
  "Pembelajaran interaktif tanpa batasan ruang dan waktu",
  "Sistem CBT mandiri dengan proteksi kecurangan dan koreksi otomatis",
]

const roles = [
  {
    title: "Guru Pengajar",
    role: "Guru",
    desc: "Menyusun materi interaktif, pembuatan bank soal kurikulum, pelaksanaan kuis, serta koreksi otomatis nilai CBT dengan bantuan analisis AI.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/25",
    badge: "Manajemen Belajar & CBT",
    icon: GraduationCap,
    delay: 0,
  },
  {
    title: "Siswa Peserta Didik",
    role: "Siswa",
    desc: "Akses bahan ajar terstruktur, pengerjaan tugas mandiri, serta mengikuti ujian online aman dengan sistem proteksi anti-cheat 3x.",
    color: "text-orange",
    bg: "bg-orange/10",
    border: "border-orange/25",
    badge: "Pembelajaran & Asesmen Mandiri",
    icon: Laptop,
    delay: 0.2,
  },
  {
    title: "Administrator Sekolah",
    role: "Admin",
    desc: "Pusat kendali operasional: manajemen akun pengguna, kelas mengajar, jadwal akademik, dan rekapitulasi data nilai sekolah.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    badge: "Kendali Sistem & Kurikulum",
    icon: ShieldCheck,
    delay: 0.4,
  },
]

export function AboutSection() {
  return (
    <section id="tentang" className="relative py-20 md:py-28 bg-transparent overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Description & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-5 shadow-sm whitespace-nowrap">
              Mengenal SIAPOS Lebih Dekat
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Platform Pendidikan Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Terpadu & Modern
              </span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              SIAPOS (Sistem Integrasi Akademik dan Pembelajaran Online Sekolah) hadir sebagai solusi digital komprehensif untuk mentransformasi cara sekolah mengelola kegiatan belajar mengajar dan asesmen akademik. Kami memadukan kemudahan akses dengan teknologi ujian modern yang transparan, aman, dan efisien.
            </p>

            <div className="mt-8 space-y-3.5">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 3 Dedicated Roles (Guru, Siswa, Admin) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl bg-card/80 backdrop-blur-xl border border-border/80 p-5 sm:p-7 shadow-xl shadow-black/5 space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">3 Peran Utama Pengguna</h3>
                  <p className="text-xs text-muted-foreground">Dirancang selaras dengan alur kerja sekolah</p>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap shrink-0">
                  Role-Based
                </span>
              </div>

              {/* 3 Role Cards Stack */}
              <div className="space-y-3.5 pt-1">
                {roles.map((r) => {
                  const Icon = r.icon
                  return (
                    <motion.div
                      key={r.title}
                      animate={{
                        y: [-2.5, 2.5, -2.5],
                      }}
                      transition={{
                        duration: 4.5 + r.delay * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: r.delay,
                      }}
                      className={`p-4 sm:p-5 rounded-2xl bg-card/90 border ${r.border} shadow-sm hover:shadow-md transition-all group`}
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4">
                        <div className={`w-11 h-11 rounded-xl ${r.bg} ${r.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1.5">
                            <h4 className={`text-base font-bold ${r.color} whitespace-nowrap`}>
                              {r.title}
                            </h4>
                            <span className="self-start sm:self-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                              {r.badge}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {r.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
