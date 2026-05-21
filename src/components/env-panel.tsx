"use client"

import { useApiStore } from "@/store/apiStore"
import { useState } from "react"

export function EnvPanel() {
        const { env, setEnv } = useApiStore()
        const [open, setOpen] = useState(false)

        return (
                <div className="bg-gray-800 rounded border border-gray-700">

                        {/* Header */}
                        <div
                                onClick={() => setOpen(!open)}
                                className="flex items-center justify-between p-3 cursor-pointer select-none"
                        >
                                <span className="text-sm text-gray-300">Environment</span>

                                <span
                                        className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""
                                                }`}
                                >
                                        ▼
                                </span>
                        </div>

                        {/* Content */}
                        {open && (
                                <div className="p-3 pt-0 space-y-2 border-t border-gray-700">

                                        <input
                                                placeholder="API_URL"
                                                value={env.API_URL}
                                                onChange={(e) =>
                                                        setEnv({ ...env, API_URL: e.target.value })
                                                }
                                                className="w-full bg-gray-900 p-2 text-sm rounded border border-gray-700 outline-none"
                                        />

                                        <input
                                                placeholder="TOKEN"
                                                value={env.TOKEN}
                                                onChange={(e) =>
                                                        setEnv({ ...env, TOKEN: e.target.value })
                                                }
                                                className="w-full bg-gray-900 p-2 text-sm rounded border border-gray-700 outline-none"
                                        />

                                </div>
                        )}
                </div>
        )
}
