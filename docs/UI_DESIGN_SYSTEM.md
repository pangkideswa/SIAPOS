# UI Design System

> Panduan desain UI untuk seluruh komponen SIAPOS.

---

## Color Palette

| Token | Warna | Hex | Tailwind | Penggunaan |
|-------|-------|-----|----------|------------|
| Primary | Biru | `#2563EB` | `blue-600` | Tombol utama, link, highlight |
| Secondary | Oranye | `#F97316` | `orange-500` | Aksen, badge, stat sekunder |
| Background | Abu Muda | `#F8FAFC` | `slate-50` | Latar halaman |
| Foreground | Hitam | `#0F172A` | `slate-900` | Teks utama |
| Muted | Abu | `#64748B` | `slate-500` | Teks sekunder |
| Border | Abu Border | `#E2E8F0` | `slate-200` | Garis pemisah |
| Success | Hijau | `#22C55E` | `green-500` | Status sukses, lengkap |
| Danger | Merah | `#EF4444` | `red-500` | Hapus, error, urgent |
| Warning | Kuning | `#F59E0B` | `amber-500` | Peringatan, belum lengkap |

### Semantic Colors untuk Status

| Status | Class |
|--------|-------|
| Lengkap / Aktif / Sukses | `bg-green-100 text-green-800` |
| Belum Lengkap / Draft | `bg-yellow-100 text-yellow-800` |
| Tidak Aktif / Gagal | `bg-red-100 text-red-800` |
| Default / Informasi | `bg-blue-100 text-blue-800` |

---

## Typography

| Level | Weight | Size | Line Height | Penggunaan |
|-------|--------|------|-------------|------------|
| H1 | Bold (700) | 24px / `text-2xl` | 1.25 | Judul halaman |
| H2 | Semibold (600) | 18px / `text-lg` | 1.3 | Judul section |
| H3 | Medium (500) | 16px / `text-base` | 1.4 | Judul card |
| Body | Regular (400) | 14px / `text-sm` | 1.5 | Teks konten |
| Small | Medium (500) | 12px / `text-xs` | 1.5 | Label, helper text |
| Badge | Medium (500) | 11px / `text-[11px]` | 1.4 | Badge, tag |

Font: **Plus Jakarta Sans** (400, 500, 600, 700, 800)

---

## Border Radius

| Komponen | Radius | Tailwind |
|----------|--------|----------|
| Button | 12px | `rounded-xl` |
| Input | 12px | `rounded-xl` |
| Card | 18px | `rounded-xl` (tapi lebih besar secara visual) |
| Modal/Dialog | 20px | `rounded-xl` (tapi lebih besar) |
| Badge | 999px | `rounded-4xl` (pill shape) |
| Avatar | 50% | `rounded-full` |
| Table | 12px | `rounded-lg` |

---

## Button

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Default | Primary (`#2563EB`) | White | — | `brightness-90` |
| Secondary | Secondary (`#F97316`) | White | — | `brightness-90` |
| Outline | Transparent | Foreground | `border-border` | `bg-muted` |
| Ghost | Transparent | Muted | — | `bg-muted` |
| Destructive | Transparent | Danger | — | `bg-destructive/10` |

### Size

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `xs` | 28px | 6px 12px | 12px |
| `sm` | 32px | 8px 16px | 13px |
| `default` | 36px | 8px 16px | 14px |
| `lg` | 40px | 10px 20px | 14px |
| `icon-sm` | 32px | — | — |

---

## Card

| Properti | Value |
|----------|-------|
| Background | `bg-card` (white) |
| Border | `ring-1 ring-foreground/10` |
| Radius | `rounded-xl` |
| Padding default | `p-4` (16px) |
| Padding small | `p-3` (12px) |
| Shadow | Ring saja, tanpa drop shadow |

---

## Badge

| Variant | Style |
|---------|-------|
| Default | `bg-primary text-primary-foreground` |
| Destructive | `bg-destructive/10 text-destructive` |
| Outline | `border-border text-foreground` |
| Custom | Pakai class warna langsung (contoh: `bg-green-100 text-green-800`) |

---

## Icon

- Library: **Lucide React**
- Ukuran standar: 16px (`h-4 w-4`) untuk icon dalam button
- Ukuran medium: 20px (`h-5 w-5`) untuk icon di card header
- Ukuran large: 24px (`h-6 w-6`) untuk icon di stat card

---

## Spacing

| Scale | Value |
|-------|-------|
| `gap-1` | 4px |
| `gap-2` | 8px |
| `gap-3` | 12px |
| `gap-4` | 16px |
| `gap-6` | 24px |
| Section spacing | `space-y-6` (24px) |
| Container padding | `px-4 md:px-6` (16px md: 24px) |

---

## Responsive Breakpoint

| Breakpoint | Prefix | Target |
|------------|--------|--------|
| 640px | `sm:` | Tablet kecil |
| 768px | `md:` | Tablet, tampilkan sidebar */
| 1024px | `lg:` | Desktop, grid 3 kolom |
| 1280px | `xl:` | Desktop besar |

### Layout per Device

| Device | Navigasi | Konten |
|--------|----------|--------|
| Mobile (< 768px) | BottomNav (fixed bottom) | Full width, padding 16px |
| Desktop (>= 768px) | Sidebar (left, 256px) | Padding 24px, max-width |
| Tablet | Sidebar atau BottomNav tergantung viewport | Responsive grid |

---

## Shadow

Gunakan shadow ringan dan minimal:

```css
shadow-sm         /* box-shadow kecil */
shadow-primary/20  /* shadow dengan warna primary */
```

Hindari shadow tebal atau berlebihan.

---

## Animasi

| Komponen | Durasi | Timing |
|----------|--------|--------|
| Page transition | 300ms | ease |
| Sidebar collapse | 300ms | ease |
| Hover state | 200ms | ease |
| Modal open/close | 100ms | ease |
