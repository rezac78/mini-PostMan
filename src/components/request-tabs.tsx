"use client"

import { useState } from "react"
import { QueryEditor } from "@/components/query-editor"
import { HeadersEditor } from "@/components/headers-editor"
import { BodyEditor } from "@/components/BodyEditor"

type Tab = "params" | "headers" | "body"

export function RequestTabs() {
        const [tab, setTab] = useState<Tab>("params")

        const tabStyle = (name: Tab) =>
                `px-4 py-2 text-sm border-b-2 ${tab === name
                        ? "border-orange-400 text-orange-400"
                        : "border-transparent text-gray-400 hover:text-white"
                }`

        return (
                <div className="bg-gray-800 border border-gray-700 rounded">

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700">
                                <button onClick={() => setTab("params")} className={tabStyle("params")}>
                                        Params
                                </button>

                                <button onClick={() => setTab("headers")} className={tabStyle("headers")}>
                                        Headers
                                </button>

                                <button onClick={() => setTab("body")} className={tabStyle("body")}>
                                        Body
                                </button>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                                {tab === "params" && <QueryEditor />}
                                {tab === "headers" && <HeadersEditor />}
                                {tab === "body" && <BodyEditor />}
                        </div>

                </div>
        )
}
