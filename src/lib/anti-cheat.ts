/**
 * Anti-Cheat Utilities for CBT & Quiz
 * Detects mobile split-screen (multi-window / pop-up view), fullscreen status, and screen tampering.
 */

export interface SplitScreenDetectionResult {
  isSplit: boolean
  reason?: string
  ratio?: number
}

/**
 * Checks whether the current device is a mobile phone or tablet.
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }

  const ua = navigator.userAgent || ""
  const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTouchDevice =
    navigator.maxTouchPoints > 0 &&
    Math.max(window.screen.width, window.screen.height) <= 1366

  return isMobileUa || isTouchDevice
}

/**
 * Detects whether the browser window is in split-screen (layar terbelah / multi-window)
 * or floating pop-up window mode on mobile/tablet devices.
 * 
 * Accurately excludes soft-keyboard opening by checking activeElement.
 */
export function detectSplitScreen(): SplitScreenDetectionResult {
  if (typeof window === "undefined") {
    return { isSplit: false }
  }

  // Only mobile/tablet devices have native Android/iOS split-screen multitasking
  if (!isMobileOrTablet()) {
    return { isSplit: false }
  }

  // If user is currently typing in an input/textarea (e.g. typing token or essay answer),
  // Android soft keyboard opens and temporarily shrinks window.innerHeight.
  // We do NOT treat virtual keyboard focus as a split-screen cheat attempt.
  if (typeof document !== "undefined" && document.activeElement) {
    const tagName = document.activeElement.tagName?.toUpperCase()
    const isInput =
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      (document.activeElement as HTMLElement).isContentEditable

    if (isInput) {
      return { isSplit: false }
    }
  }

  const screenWidth = window.screen.width || 0
  const screenHeight = window.screen.height || 0

  if (screenWidth === 0 || screenHeight === 0) {
    return { isSplit: false }
  }

  const availWidth = window.screen.availWidth || screenWidth
  const availHeight = window.screen.availHeight || screenHeight

  const winWidth = window.innerWidth
  const winHeight = window.innerHeight

  const isPortrait = screenHeight >= screenWidth

  if (isPortrait) {
    // In portrait orientation:
    // A normal mobile browser viewport occupies >= 75% of available height even with address bars.
    // In Android split-screen (two apps stacked), height drops to ~35% - 50% (ratio < 0.68).
    // Width must also span nearly full width (ratio >= 0.75). If width is smaller, it's pop-up/floating window.
    const heightRatio = winHeight / Math.min(availHeight, screenHeight)
    const widthRatio = winWidth / Math.min(availWidth, screenWidth)

    if (heightRatio < 0.68) {
      return {
        isSplit: true,
        reason: `Layar terbagi vertikal (Tinggi ${Math.round(heightRatio * 100)}% dari layar penuh)`,
        ratio: heightRatio,
      }
    }

    if (widthRatio < 0.75) {
      return {
        isSplit: true,
        reason: `Jendela aplikasi terdeteksi pop-up / floating window (Lebar ${Math.round(widthRatio * 100)}% dari layar)`,
        ratio: widthRatio,
      }
    }
  } else {
    // In landscape orientation:
    // Split-screen puts apps side-by-side (width halved, ratio < 0.68) or stacked (height halved).
    const widthRatio = winWidth / Math.min(availWidth, screenWidth)
    const heightRatio = winHeight / Math.min(availHeight, screenHeight)

    if (widthRatio < 0.68 || heightRatio < 0.68) {
      const minRatio = Math.min(widthRatio, heightRatio)
      return {
        isSplit: true,
        reason: `Layar terbagi horizontal / landscape (Ukuran ${Math.round(minRatio * 100)}% dari layar penuh)`,
        ratio: minRatio,
      }
    }
  }

  return { isSplit: false }
}
