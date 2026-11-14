"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Mail, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-blue-600 to-primary/90 relative overflow-hidden text-white">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      {/* Dynamic Animated Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.45, 0.2],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Transformasi Digital Sekolah Sekarang
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Siap Memulai Perjalanan Belajar Modern?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan SIAPOS sekarang. Rasakan kemudahan manajemen kelas, asesmen terstandar, dan ujian CBT yang adil & transparan.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Hubungi via WhatsApp */}
            <a
              href="https://wa.me/6281233436196?text=Halo%20Admin%20SIAPOS,%20saya%20ingin%20berkonsultasi%20seputar%20implementasi%20SIAPOS."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="px-8 h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.97] text-white shadow-xl border-none font-bold w-full sm:w-auto gap-2.5 transition-all group"
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Hubungi Admin via WhatsApp</span>
              </Button>
            </a>

            {/* Hubungi via Email / Gmail */}
            <a
              href="mailto:pangkiajaa@gmail.com?subject=Konsultasi%20SIAPOS&body=Halo%20Admin%20SIAPOS,%20saya%20ingin%20berkonsultasi%20seputar%20implementasi%20SIAPOS."
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="secondary"
                className="px-8 h-12 bg-white text-primary hover:bg-white/90 active:bg-blue-50 active:scale-[0.97] shadow-xl font-bold w-full sm:w-auto gap-2.5 transition-all group"
              >
                <Mail className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span>Hubungi Admin via Email</span>
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
