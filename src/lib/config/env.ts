export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  APP_NAME: "SIAPOS",
  APP_DESCRIPTION:
    "Sistem Integrasi Akademik dan Pembelajaran Online Sekolah",
} as const
