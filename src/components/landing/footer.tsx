import Link from "next/link"

const footerLinks = [
  {
    title: "Navigasi",
    links: [
      { href: "#fitur", label: "Fitur" },
      { href: "#tentang", label: "Tentang" },
    ],
  },
  {
    title: "Akun",
    links: [
      { href: "/masuk", label: "Masuk" },
      { href: "/daftar", label: "Daftar" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs shadow-md shadow-primary/25">
                  SI
                </div>
                <span className="font-semibold text-lg tracking-tight text-foreground">
                  SIAPOS
                </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Platform pembelajaran digital untuk SMK Wahana Bakti. Belajar
              lebih mudah, berkembang lebih cepat.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} SIAPOS - SMK Wahana Bakti. Hak
            cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
