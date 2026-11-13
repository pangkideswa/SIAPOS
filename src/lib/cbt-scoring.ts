/**
 * CBT Scoring & Weighting Helper
 * Digunakan untuk mendistribusikan bobot soal secara proporsional agar total = 100
 * serta membedakan bobot Pilihan Ganda dan Esai/Isian Singkat (Esai memiliki bobot lebih tinggi).
 */

export interface ItemForWeighting {
  bank_soal_id: number
  tipe_soal?: string
  bobot?: number
  nomor_urut?: number
}

export function distributeProportionalWeights<T extends ItemForWeighting>(
  items: T[],
  targetTotal = 100
): (T & { bobot: number })[] {
  if (items.length === 0) return []

  const isPgType = (t?: string) => {
    if (!t) return false
    const upper = t.toUpperCase()
    return upper === "PILIHAN_GANDA" || upper === "PILIHAN GANDA" || upper === "BENAR_SALAH" || upper === "BENAR / SALAH"
  }

  const pgItems = items.filter((i) => isPgType(i.tipe_soal))
  const esaiItems = items.filter((i) => !isPgType(i.tipe_soal))

  const nPg = pgItems.length
  const nEsai = esaiItems.length

  // Kasus 1: Hanya ada soal Pilihan Ganda
  if (nEsai === 0) {
    const baseWeight = Math.floor((targetTotal / nPg) * 10) / 10
    const remainder = Math.round((targetTotal - baseWeight * nPg) * 10) / 10
    return items.map((item, idx) => ({
      ...item,
      bobot: idx === items.length - 1 ? Math.round((baseWeight + remainder) * 10) / 10 : baseWeight,
    }))
  }

  // Kasus 2: Hanya ada soal Esai / Isian
  if (nPg === 0) {
    const baseWeight = Math.floor((targetTotal / nEsai) * 10) / 10
    const remainder = Math.round((targetTotal - baseWeight * nEsai) * 10) / 10
    return items.map((item, idx) => ({
      ...item,
      bobot: idx === items.length - 1 ? Math.round((baseWeight + remainder) * 10) / 10 : baseWeight,
    }))
  }

  // Kasus 3: Campuran Pilihan Ganda & Esai
  // Esai memiliki bobot lebih tinggi (rasio ~2x lipat dari PG)
  // nPg * wPg + nEsai * (2 * wPg) = targetTotal
  const rawWpg = targetTotal / (nPg + 2 * nEsai)
  const wPg = Math.max(1, Math.round(rawWpg))
  const totalPgWeight = nPg * wPg
  const remainingForEsai = Math.max(nEsai, targetTotal - totalPgWeight)

  const baseEsaiWeight = Math.floor((remainingForEsai / nEsai) * 10) / 10
  const esaiRemainder = Math.round((remainingForEsai - baseEsaiWeight * nEsai) * 10) / 10

  let currentEsaiIndex = 0
  return items.map((item) => {
    if (isPgType(item.tipe_soal)) {
      return { ...item, bobot: wPg }
    } else {
      currentEsaiIndex++
      const weight =
        currentEsaiIndex === nEsai
          ? Math.round((baseEsaiWeight + esaiRemainder) * 10) / 10
          : baseEsaiWeight
      return { ...item, bobot: weight }
    }
  })
}
