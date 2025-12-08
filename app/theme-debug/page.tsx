'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeDebugPage() {
    const { theme, resolvedTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [htmlClass, setHtmlClass] = useState('')

    useEffect(() => {
        setMounted(true)
        setHtmlClass(document.documentElement.className)
    }, [])

    if (!mounted) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-foreground mb-8">Theme Debug Page</h1>

                <div className="bg-surface border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Current Theme Status</h2>
                        <div className="space-y-2 text-foreground">
                            <p><strong>Theme Setting:</strong> {theme}</p>
                            <p><strong>Resolved Theme:</strong> {resolvedTheme}</p>
                            <p><strong>System Theme:</strong> {systemTheme}</p>
                            <p><strong>HTML Classes:</strong> {htmlClass}</p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                        <h3 className="text-xl font-bold text-foreground mb-3">CSS Variables</h3>
                        <div className="space-y-1 text-sm font-mono text-foreground/80">
                            <p>--background: {getComputedStyle(document.documentElement).getPropertyValue('--background')}</p>
                            <p>--foreground: {getComputedStyle(document.documentElement).getPropertyValue('--foreground')}</p>
                            <p>--surface: {getComputedStyle(document.documentElement).getPropertyValue('--surface')}</p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                        <h3 className="text-xl font-bold text-foreground mb-3">Visual Test</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-background border border-neutral-200 dark:border-neutral-700 rounded">
                                <p className="text-foreground">Background Color</p>
                                <p className="text-foreground/60 text-sm">This uses bg-background</p>
                            </div>
                            <div className="p-4 bg-surface border border-neutral-200 dark:border-neutral-700 rounded">
                                <p className="text-foreground">Surface Color</p>
                                <p className="text-foreground/60 text-sm">This uses bg-surface</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                        <h3 className="text-xl font-bold text-foreground mb-3">Expected Values</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-bold text-foreground mb-2">Light Mode</h4>
                                <ul className="space-y-1 text-foreground/70">
                                    <li>--background: 240 249 255</li>
                                    <li>--foreground: 10 25 47</li>
                                    <li>--surface: 255 255 255</li>
                                    <li>HTML class: (no 'dark')</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-2">Dark Mode</h4>
                                <ul className="space-y-1 text-foreground/70">
                                    <li>--background: 2 12 27</li>
                                    <li>--foreground: 230 241 255</li>
                                    <li>--surface: 17 34 64</li>
                                    <li>HTML class: 'dark'</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="p-4 bg-primary-blue text-foreground rounded-lg">
                        <p className="font-bold">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                            <li>Check the values above</li>
                            <li>Go to System Settings → Appearance</li>
                            <li>Switch between Light and Dark</li>
                            <li>Click "Force Refresh" button below</li>
                        </ol>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem('theme')
                                window.location.reload()
                            }}
                            className="px-6 py-3 bg-error-red text-foreground rounded-lg font-bold hover:bg-error-red/90"
                        >
                            Clear Theme Cache & Reload
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary-blue text-foreground rounded-lg font-bold hover:bg-primary-blue/90"
                        >
                            Force Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
