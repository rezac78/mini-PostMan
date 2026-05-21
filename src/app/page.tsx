"use client"

import { Sidebar } from "@/components/sidebar"
import { EnvPanel } from "@/components/env-panel"
import { RequestBar } from "@/components/request-bar"
import { ResponseViewer } from "@/components/response-viewer"
import { RequestTabs } from "@/components/request-tabs"

export default function Page() {
  return (
    <main className="grid grid-cols-4 gap-4 p-4 h-screen overflow-hidden bg-gray-950 text-white">

      <Sidebar />

      <div className="col-span-3 flex flex-col gap-4 min-h-0">

        <EnvPanel />

        <RequestBar />

        <RequestTabs />

        <div className="flex-1 min-h-0">
          <ResponseViewer />
        </div>

      </div>

    </main>
  )
}
