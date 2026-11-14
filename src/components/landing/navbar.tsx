"use client"

import Link from "next/link"
import { Menu, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { id: "fitur", href: "#fitur", label: "Fitur Unggulan", shortLabel: "Fitur" },
  { id: "tentang", href: "#tentang", label: "Tentang SIAPOS", shortLabel: "Tentang" },
  { id: "saran", href: "#saran", label: "Saran & Masukan", shortLabel: "Saran", isNew: true },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")

  // Scroll detection & ScrollSpy for active section highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 40)

      // Calculate which section is currently in view
      const scrollPos = scrollY + 220
      const sections = [
        { id: "saran", el: document.getElementById("saran") },
        { id: "tentang", el: document.getElementById("tentang") },
        { id: "fitur", el: document.getElementById("fitur") },
      ]

      let current = ""
      for (const sec of sections) {
        if (sec.el && scrollPos >= sec.el.offsetTop) {
          current = sec.id
          break
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      {/* 1. TOP HEADER (Visible when at the top of the page) */}
      <header
        className={`relative z-40 w-full transition-opacity duration-300 py-4 ${
          scrolled ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-primary/20 shadow-md shadow-primary/15 overflow-hidden p-1.5 transition-transform group-hover:scale-105 active:scale-95">
                <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-foreground">
                    SIAPOS
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    v2.0
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">
                  Education Operating System
                </span>
              </div>
            </Link>

            {/* Desktop Capsule Menu (At Top) */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-card/75 border border-border/80 backdrop-blur-md shadow-sm">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 select-none active:scale-95 ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/25 font-bold active:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-primary/10 active:text-primary"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isNew && !isActive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Action Button (At Top) */}
            <div className="hidden md:flex items-center">
              <Link href="/masuk">
                <Button
                  size="sm"
                  className="text-xs font-bold px-4 h-9 bg-primary text-white hover:bg-primary/90 active:bg-blue-700 shadow-md shadow-primary/20 gap-1.5 rounded-xl active:scale-95 transition-all"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Masuk ke Akun</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle (At Top) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-card/80 border border-border/80 text-foreground hover:bg-muted active:scale-95 transition-all shadow-sm"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (At Top) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-b border-border/80 bg-card/95 backdrop-blur-xl shadow-xl mt-3"
            >
              <div className="px-5 py-4 space-y-2 max-w-7xl mx-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between text-sm font-semibold rounded-xl px-3.5 py-2.5 transition-all active:scale-[0.98] ${
                      activeSection === link.id
                        ? "bg-primary text-white font-bold"
                        : "text-foreground/80 hover:bg-muted/80"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isNew && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Baru
                      </span>
                    )}
                  </Link>
                ))}

                <div className="pt-3 border-t border-border/60">
                  <Link href="/masuk" onClick={() => setMobileOpen(false)} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold justify-center gap-2 h-10 active:bg-blue-700 active:scale-[0.98] shadow-sm" size="sm">
                      <LogIn className="h-4 w-4" />
                      Masuk ke Akun
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. FLOATING CAPSULE ISLAND NAVBAR (Appears & follows when scrolling down) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]"
          >
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-card/90 dark:bg-card/95 border border-border/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              {/* Mini Brand Logo in Capsule */}
              <button
                type="button"
                onClick={scrollToTop}
                title="Kembali ke atas"
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full hover:bg-muted/70 active:scale-95 transition-all text-foreground shrink-0 group"
              >
                <div className="w-6 h-6 rounded-lg bg-card border border-primary/20 overflow-hidden p-0.5 shrink-0 group-hover:scale-105 transition-transform">
                  <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-xs tracking-tight text-foreground hidden sm:inline">
                  SIAPOS
                </span>
              </button>

              <div className="w-px h-4 bg-border/80 shrink-0" />

              {/* Navigation Links inside Floating Capsule with Active ScrollSpy Highlight */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1 select-none whitespace-nowrap active:scale-95 ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/25 font-bold active:bg-blue-700"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-primary/10 active:text-primary"
                      }`}
                    >
                      <span className="hidden sm:inline">{link.label}</span>
                      <span className="inline sm:hidden">{link.shortLabel}</span>
                      {link.isNew && !isActive && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="w-px h-4 bg-border/80 shrink-0" />

              {/* Floating Quick Action */}
              <Link href="/masuk">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs font-bold gap-1 rounded-full bg-primary text-white hover:bg-primary/90 active:bg-blue-700 active:scale-95 shadow-sm shadow-primary/20 transition-all"
                >
                  <LogIn className="h-3 w-3" />
                  <span>Masuk</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
