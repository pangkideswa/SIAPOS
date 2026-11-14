"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Bug,
  Lightbulb,
  Heart,
  Palette,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"

const ROLES = [
  { id: "Guru", label: "Guru" },
  { id: "Siswa", label: "Siswa" },
  { id: "Admin Sekolah", label: "Admin Sekolah" },
  { id: "Umum", label: "Umum / Pengunjung" },
]

const CATEGORIES = [
  { id: "Saran Fitur", label: "Saran Fitur Baru", icon: Lightbulb },
  { id: "Laporan Bug", label: "Laporan Kendala / Bug", icon: Bug },
  { id: "Tampilan & Desain", label: "Kemudahan & Desain", icon: Palette },
  { id: "Pertanyaan", label: "Pertanyaan / Bantuan", icon: HelpCircle },
  { id: "Apresiasi", label: "Apresiasi & Testimoni", icon: Heart },
]

export function FeedbackSection() {
  const [nama, setNama] = useState("")
  const [peran, setPeran] = useState("Guru")
  const [kategori, setKategori] = useState("Saran Fitur")
  const [pesan, setPesan] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const WA_NUMBER = "6281233436196"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!pesan.trim()) {
      toast.error("Mohon tuliskan pesan saran atau masukan Anda.")
      return
    }

    if (pesan.trim().length < 5) {
      toast.error("Pesan masukan terlalu singkat (minimal 5 karakter).")
      return
    }

    setIsSubmitting(true)

    const senderName = nama.trim() || "Anonim / Pengguna SIAPOS"

    const formattedMessage = [
      `*Halo Tim Pengembang SIAPOS,*`,
      `Saya ingin menyampaikan saran & masukan melalui form website:`,
      ``,
      `👤 *Nama:* ${senderName}`,
      `🏷️ *Peran:* ${peran}`,
      `📌 *Kategori:* ${kategori}`,
      ``,
      `💬 *Pesan / Masukan:*`,
      `"${pesan.trim()}"`,
      ``,
      `Terima kasih!`,
    ].join("\n")

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(formattedMessage)}`

    toast.success("Membuka WhatsApp untuk mengirim saran/masukan Anda...")

    // Open WhatsApp in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer")
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setPesan("")
    }, 1000)
  }

  return (
    <section id="saran" className="relative py-20 md:py-28 bg-transparent overflow-hidden scroll-mt-24">
      {/* Decorative Floating Ambient Background Lights */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[-5%] w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-[-5%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[110px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Kotak Aspirasi & Umpan Balik Pengguna
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            <span className="block">Jika Ada Saran / Masukan</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mt-1">
              Silakan Isi Form Berikut
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Suara Anda sangat berarti bagi kemajuan SIAPOS. Setiap saran, laporan kendala, atau ide fitur baru akan langsung terkirim ke WhatsApp tim pengembang kami untuk segera ditindaklanjuti.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: The Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama Pengirim */}
              <div className="space-y-2">
                <Label htmlFor="saran-nama" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nama Anda <span className="text-muted-foreground/60 font-normal lowercase">(opsional)</span>
                </Label>
                <Input
                  id="saran-nama"
                  type="text"
                  placeholder="Contoh: Pak Budi (Guru) atau Siti (Siswa XII RPL)"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="h-11 bg-background/60 text-sm focus:border-emerald-500"
                />
              </div>

              {/* Peran */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Peran / Status Anda
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const isSelected = peran === r.id
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setPeran(r.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                        }`}
                      >
                        {r.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Kategori Masukan */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Kategori Masukan
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = kategori === cat.id
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setKategori(cat.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-all border ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm"
                            : "border-border/70 bg-background/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-emerald-600" : "text-muted-foreground"}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Pesan / Masukan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="saran-pesan" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Pesan, Saran, atau Masukan <span className="text-rose-500">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {pesan.length} karakter
                  </span>
                </div>
                <Textarea
                  id="saran-pesan"
                  rows={4}
                  required
                  placeholder="Tuliskan saran perbaikan fitur, ide pengembangan, kendala yang dialami, atau masukan lainnya dengan jelas..."
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  className="bg-background/60 text-sm resize-none focus:border-emerald-500 min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all duration-200 gap-2.5 rounded-xl group"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Kirim Masukan via WhatsApp</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-2.5">
                  Format pesan akan otomatis dirangkum rapi ke nomor WhatsApp resmi SIAPOS.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Information & Live Support Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Live WhatsApp Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-primary/10 border border-emerald-500/30 p-6 sm:p-7 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Layanan WhatsApp Aktif
                  </span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                  Official Support
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">
                Diskusi Langsung Bersama Pengembang
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Punya pertanyaan teknis, butuh panduan implementasi untuk sekolah, atau ingin bermitra? Kami siap melayani Anda secara langsung.
              </p>

              {/* Direct WhatsApp Callout */}
              <div className="mt-5 p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">WhatsApp Hotline</p>
                    <p className="text-sm font-bold text-foreground font-mono">+62 812-3343-6196</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Admin SIAPOS, saya ingin berkonsultasi seputar sistem SIAPOS.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Chat Cepat
                </a>
              </div>
            </div>

            {/* Why Feedback Matters */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/60 border border-border/60">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Respons Tercepat</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Setiap pesan WhatsApp akan dibaca dan dijawab oleh tim teknis kami dalam waktu singkat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/60 border border-border/60">
                <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Pengembangan Berbasis Kebutuhan</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Pembaruan modul CBT, manajemen nilai, dan materi terus disempurnakan berdasarkan saran nyata guru & siswa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/60 border border-border/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Privasi & Keamanan Data</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Informasi kontak dan masukan Anda aman dan hanya digunakan untuk keperluan peningkatan layanan sekolah.
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
