"use client"

import { useApiStore } from "@/store/apiStore"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useState } from "react"
import toast from "react-hot-toast"

export function ResponseViewer() {
  const { response } = useApiStore()
  const [tab, setTab] = useState<"body" | "headers">("body")

  const getData = () => {
    if (!response) return null
    return response.data ?? response
  }

  const data = getData()
  const copyToClipboard = async () => {
    if (!response) return

    let text = ""

    if (tab === "body") {
      if (typeof data === "object") {
        text = JSON.stringify(data, null, 2)
      } else {
        text = String(data)
      }
    }

    if (tab === "headers") {
      text = Object.entries(response.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    }

    await navigator.clipboard.writeText(text)

    toast.success("Copied to clipboard")
  }


  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-3 h-full flex flex-col overflow-hidden">

      <div className="flex justify-between items-center mb-3 text-xs">

        <div className="flex gap-3">
          <button
            onClick={() => setTab("body")}
            className={tab === "body" ? "text-orange-400" : "text-gray-400"}
          >
            Body
          </button>

          <button
            onClick={() => setTab("headers")}
            className={tab === "headers" ? "text-orange-400" : "text-gray-400"}
          >
            Headers
          </button>
        </div>

        {response && (
          <button
            onClick={copyToClipboard}
            className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        )}
      </div>

      {response && (
        <div className="text-xs mb-2 text-gray-400 flex gap-4">
          <span className={getStatusColor(response.status)}>
            Status {response.status}
          </span>

          <span>{response.time} ms</span>

          <span>
            {(response.size / 1024).toFixed(2)} KB
          </span>
        </div>
      )}

      {!response && (
        <pre className="text-xs bg-black p-3 rounded text-gray-500">
          No response
        </pre>
      )}

      {tab === "headers" && response && (
        <div className="text-xs bg-black p-3 rounded overflow-auto max-h-[400px]">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-blue-400">{key}:</span>
              <span className="text-green-400">{value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "body" && response && typeof data === "object" && (
        <SyntaxHighlighter
          language="json"
          style={oneDark}
          customStyle={{
            background: "#000",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            maxHeight: "400px",
            overflow: "auto"
          }}
        >
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      )}

      {tab === "body" && response && typeof data !== "object" && (
        <pre className="text-xs bg-black p-3 rounded overflow-auto max-h-[400px] text-green-400">
          {String(data)}
        </pre>
      )}

    </div>
  )
}

function getStatusColor(status: number) {
  if (status >= 200 && status < 300) return "text-green-400"
  if (status >= 300 && status < 400) return "text-yellow-400"
  if (status >= 400 && status < 500) return "text-orange-400"
  if (status >= 500) return "text-red-500"
  return "text-gray-400"
}
