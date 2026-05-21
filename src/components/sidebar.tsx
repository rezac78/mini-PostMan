"use client"

import { useApiStore } from "@/store/apiStore"
import { normalizeUrl } from "@/utils/normalize-url"
import { useState, useMemo } from "react"
import { ProjectSelector } from "./ProjectSelector"
import { extractFolderName } from "@/utils/extract-folder-name"

type TabType = "history" | "latest" | "folders"

export function Sidebar() {
        const {
                history,
                loadHistory,
                search,
                setSearch,
                togglePin,
                currentProjectId,
                deleteHistory, importHistory
        } = useApiStore()
        const projectHistory = useMemo(() =>
                history.filter(h => h.projectId === currentProjectId),
                [history, currentProjectId]);
        const filtered = useMemo(() =>
                projectHistory.filter((h) => h.url.toLowerCase().includes(search.toLowerCase())),
                [projectHistory, search]);
        const latest = useMemo(() => projectHistory.slice(0, 5), [projectHistory]);
        const grouped = useMemo(() => {
                const map: Record<string, typeof projectHistory> = {};
                projectHistory.forEach((item) => {
                        const folder = item.folder || "other";
                        if (!map[folder]) map[folder] = [];
                        map[folder].push(item);
                });
                return map;
        }, [projectHistory]);
        const [tab, setTab] = useState<TabType>("history")
        const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})
        const uniqueCount = useMemo(() => {
                const set = new Set(projectHistory.map((h) => `${h.method}:${h.url}`))
                return set.size
        }, [projectHistory])


        const exportPostman = () => {

                const collection = {
                        info: {
                                name: "My API Client Export",
                                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                        },
                        item: history.map((h) => ({
                                name: h.url,
                                request: {
                                        method: h.method,
                                        header: h.headers?.map((hd: any) => ({
                                                key: hd.key,
                                                value: hd.value
                                        })) || [],
                                        url: {
                                                raw: h.url,
                                                host: [h.url]
                                        },
                                        body: h.body
                                                ? {
                                                        mode: "raw",
                                                        raw: h.body
                                                }
                                                : undefined
                                }
                        }))
                }

                const blob = new Blob([JSON.stringify(collection, null, 2)], {
                        type: "application/json"
                })

                const url = URL.createObjectURL(blob)

                const a = document.createElement("a")
                a.href = url
                a.download = "postman_collection.json"
                a.click()

                URL.revokeObjectURL(url)
        }

        const importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (!file) return

                const reader = new FileReader()

                reader.onload = () => {
                        try {
                                const parsed = JSON.parse(reader.result as string)

                                // اگر Postman Collection باشد
                                if (parsed.item) {
                                        const items = parsed.item.map((it: any) => {
                                                const req = it.request || {}

                                                const rawUrl =
                                                        typeof req.url === "string"
                                                                ? req.url
                                                                : req.url?.raw || ""

                                                return {
                                                        id: Date.now() + Math.random(),
                                                        url: rawUrl,
                                                        method: req.method || "GET",
                                                        body: req.body?.raw || "",
                                                        headers:
                                                                req.header?.map((h: any) => ({
                                                                        id: crypto.randomUUID(),
                                                                        key: h.key,
                                                                        value: h.value,
                                                                })) || [],
                                                        query: [],
                                                        time: 0,
                                                        folder: extractFolderName(rawUrl),
                                                        projectId: currentProjectId || "default",
                                                }
                                        })

                                        importHistory(items)
                                        return
                                }

                                // اگر فایل خود ابزار باشد
                                if (Array.isArray(parsed)) {
                                        importHistory(parsed)
                                        return
                                }

                                alert("Unsupported file format")
                        } catch {
                                alert("Invalid file")
                        }
                }

                reader.readAsText(file)
        }


        const toggleFolder = (folder: string) => {
                setOpenFolders((prev) => ({
                        ...prev,
                        [folder]: !prev[folder],
                }))
        }

        const methodColor = (m: string) => {
                if (m === "GET") return "text-green-400"
                if (m === "POST") return "text-blue-400"
                if (m === "DELETE") return "text-red-400"
                return "text-yellow-400"
        }

        const Item = (h: any) => (
                <div
                        key={h.id}
                        onClick={() => loadHistory(h)}
                        className="bg-gray-900 p-2 mb-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between items-center"
                >
                        <div>
                                <span className={methodColor(h.method)}>
                                        {h.method}
                                </span>{" "}
                                {normalizeUrl(h.url)}
                        </div>

                        <div className="flex gap-2">

                                <button
                                        onClick={(e) => {
                                                e.stopPropagation()
                                                togglePin(h.id)
                                        }}
                                >
                                        {h.pinned ? "⭐" : "☆"}
                                </button>

                                <button
                                        onClick={(e) => {
                                                e.stopPropagation()
                                                deleteHistory(h.id)
                                        }}
                                        className="text-red-400"
                                >
                                        🗑
                                </button>

                        </div>
                </div>
        )
        return (
                <div className="bg-gray-800 p-3 rounded flex flex-col h-full overflow-hidden">
                        <ProjectSelector />
                        <input
                                placeholder="Search endpoint..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-gray-900 p-2 text-xs rounded outline-none border border-gray-700"
                        />
                        <div className="flex justify-between items-center">
                                <div className="flex gap-2 mt-2 text-xs">

                                        <button
                                                onClick={exportPostman}
                                                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                                        >
                                                Export
                                        </button>

                                        <label className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                                                Import
                                                <input
                                                        type="file"
                                                        accept="application/json"
                                                        onChange={importFile}
                                                        className="hidden"
                                                />
                                        </label>

                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                        Unique APIs: {uniqueCount}
                                </div>
                        </div>

                        <div className="flex gap-3 text-xs mt-3 border-b border-gray-700 pb-2">
                                <button
                                        onClick={() => setTab("history")}
                                        className={tab === "history" ? "text-orange-400" : "text-gray-400"}
                                >
                                        History
                                </button>

                                <button
                                        onClick={() => setTab("latest")}
                                        className={tab === "latest" ? "text-orange-400" : "text-gray-400"}
                                >
                                        Latest
                                </button>

                                <button
                                        onClick={() => setTab("folders")}
                                        className={tab === "folders" ? "text-orange-400" : "text-gray-400"}
                                >
                                        Folders
                                </button>
                        </div>

                        <div className="mt-4 flex-1 overflow-y-auto text-xs">

                                {tab === "history" && filtered.map(Item)}

                                {tab === "latest" && latest.map(Item)}

                                {tab === "folders" &&
                                        Object.entries(grouped).map(([folder, items]) => (

                                                <div key={folder} className="mb-3">

                                                        <div
                                                                onClick={() => toggleFolder(folder)}
                                                                className="bg-gray-700 px-2 py-1 cursor-pointer rounded"
                                                        >
                                                                📁 {folder} ({items.length})
                                                        </div>

                                                        {openFolders[folder] &&
                                                                items.map((h) => (
                                                                        <div key={h.id} className="ml-3">
                                                                                {Item(h)}
                                                                        </div>
                                                                ))}
                                                </div>
                                        ))}

                        </div>
                </div>
        )
}
