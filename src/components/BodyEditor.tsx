"use client"

import { useApiStore } from "@/store/apiStore"
import { useState } from "react"
import toast from "react-hot-toast"

export function BodyEditor() {
        const { body, setBody, method } = useApiStore()
        const [copied, setCopied] = useState(false)

        if (!["POST", "PUT", "PATCH"].includes(method)) return null
        const handleCopy = async () => {
                if (!body) {
                        toast.error("محتوایی برای کپی وجود ندارد")
                        return
                }

                try {
                        await navigator.clipboard.writeText(body)
                        setCopied(true)
                        toast.success("Body کپی شد")

                        // برگرداندن آیکون به حالت قبل بعد از 2 ثانیه
                        setTimeout(() => setCopied(false), 2000)
                } catch (err) {
                        toast.error("خطا در کپی کردن")
                }
        }

        return (
                <div className="bg-gray-800 border border-gray-700 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                        Request Body
                                </div>
                                <button
                                        onClick={handleCopy}
                                        className="bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-600"
                                >
                                        Copy
                                </button>
                        </div>
                        <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder='{"name":"Ali"}'
                                className="w-full h-40 bg-black text-green-400 text-xs p-3 rounded outline-none"
                        />
                </div>
        )
}
