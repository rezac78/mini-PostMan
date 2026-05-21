"use client"

import { ReactNode } from "react"

type Props = {
        open: boolean
        onClose: () => void
        title?: string
        children: ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
        if (!open) return null

        return (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                        {/* overlay */}
                        <div
                                onClick={onClose}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* modal */}
                        <div className="relative bg-gray-900 w-full max-w-sm rounded-lg shadow-lg border border-gray-700 p-4">

                                {title && (
                                        <div className="text-sm font-semibold mb-3 text-gray-200">
                                                {title}
                                        </div>
                                )}

                                {children}

                        </div>
                </div>
        )
}
