"use client";

import { useApiStore } from "@/store/apiStore";

export function HeadersEditor() {
        const { headers, setHeaders, removeHeader, query } = useApiStore();

        const hasFile = query.some((q) => q.type === "file" && q.file);

        const update = (id: string, field: "key" | "value", val: string) => {
                const copy = headers.map((h) =>
                        h.id === id ? { ...h, [field]: val } : h
                );
                setHeaders(copy);
        };

        const add = () => {
                setHeaders([
                        ...headers,
                        {
                                id: crypto.randomUUID(),
                                key: "",
                                value: "",
                        },
                ]);
        };

        return (
                <div className="bg-gray-800 border border-gray-700 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm text-orange-400">Headers</h3>

                                <button
                                        onClick={add}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                                >
                                        + Add
                                </button>
                        </div>

                        {headers.map((h) => {
                                const disabled =
                                        hasFile && h.key.toLowerCase() === "content-type";

                                return (
                                        <div key={h.id} className="flex gap-2 mb-2 items-center">
                                                <input
                                                        value={h.key}
                                                        placeholder="Header"
                                                        disabled={disabled}
                                                        onChange={(e) => update(h.id, "key", e.target.value)}
                                                        className="flex-1 bg-gray-900 px-2 py-1 text-sm rounded border border-gray-700"
                                                />

                                                <input
                                                        value={h.value}
                                                        placeholder="Value"
                                                        disabled={disabled}
                                                        onChange={(e) => update(h.id, "value", e.target.value)}
                                                        className="flex-1 bg-gray-900 px-2 py-1 text-sm rounded border border-gray-700"
                                                />

                                                <button
                                                        onClick={() => removeHeader(h.id)}
                                                        className="text-red-400 text-sm px-2"
                                                >
                                                        ✕
                                                </button>
                                        </div>
                                );
                        })}

                        {hasFile && (
                                <div className="text-xs text-yellow-400 mt-2">
                                        multipart/form-data detected — Content-Type will be set automatically
                                </div>
                        )}
                </div>
        );
}
