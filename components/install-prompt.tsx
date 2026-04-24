"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"

export function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if app is already installed/running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes("android-app://");
      
      setIsStandalone(isStandaloneMode)
    }

    checkStandalone()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for display mode changes (e.g., when the app is installed and opened)
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches)
    }
    
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Automatic installation is not supported by your browser. Please look for the 'Install' icon in your address bar or browser menu.")
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      setDeferredPrompt(null)
    }
  }

  // Prevent hydration mismatch by returning null until mounted
  if (!isMounted || isStandalone) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-bold">Install Application</h1>
        <p className="text-lg text-slate-300">
          This application requires installation to function properly. Please install it to continue using the invoice generator offline.
        </p>
        <Button 
          onClick={handleInstallClick}
          size="lg" 
          className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700"
        >
          Install App Now
        </Button>
        <p className="text-sm text-slate-400 mt-4">
          If the install button doesn't work, look for the install icon in your browser's address bar, or select "Add to Home Screen" from your browser's menu.
        </p>
      </div>
    </div>
  )
}
