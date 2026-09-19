"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

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
            digital di sekolah Anda.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/6281233436196?text=Halo%20Admin%20SIAPOS,%20saya%20ingin%20mendaftar%20akun%20baru." target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 bg-card text-primary hover:bg-card/90 shadow-lg w-full sm:w-auto"
              >
                Hubungi Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link href="/masuk">
              <Button
                size="lg"
                className="px-8 bg-orange text-white hover:bg-orange/90 shadow-lg border-none w-full sm:w-auto"
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
