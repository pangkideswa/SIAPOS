import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const { prompt, systemInstruction } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt tidak boleh kosong" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    // Fallback jika API Key belum dikonfigurasi di server / local
    if (!apiKey) {
      console.warn("GEMINI_API_KEY tidak ditemukan. Menggunakan fallback mode.")
      // Jeda buatan agar terasa seperti memanggil API sungguhan
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      return NextResponse.json({
        result: `[SIMULASI AI] Sistem AI belum dikonfigurasi sepenuhnya. Anda meminta: "${prompt.substring(0, 50)}...". Harap masukkan GEMINI_API_KEY di environment server Anda untuk mengaktifkan AI sungguhan.`,
      })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Memanggil API Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "Kamu adalah asisten pintar dan ramah yang membantu tugas pendidikan di aplikasi SIAPOS.",
        temperature: 0.7,
      },
    })

    return NextResponse.json({
      result: response.text,
    })
  } catch (error: any) {
    console.error("Kesalahan API AI:", error)
    return NextResponse.json(
      { error: "Gagal menghasilkan konten AI", details: error.message },
      { status: 500 }
    )
  }
}
