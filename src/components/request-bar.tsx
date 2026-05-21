"use client"

import { useApiStore } from "@/store/apiStore"

export function RequestBar() {
  const { url, setUrl, method, setMethod, sendRequest, loading } = useApiStore()

  return (
    <div className="flex gap-2">

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm outline-none"
      >
        {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://api.example.com/users"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendRequest()
          }
        }}
        className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1 text-sm outline-none focus:border-orange-500"
      />


      <button
        onClick={sendRequest}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>


    </div>
  )
}
