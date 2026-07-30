"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Siap Memulai Perjalanan Belajar?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Bergabung dengan SIAPOS sekarang dan rasakan kemudahan belajar
            digital di SMK Wahana Bakti.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/daftar">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto"
              >
                Daftar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/masuk">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Masuk ke Akun
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
