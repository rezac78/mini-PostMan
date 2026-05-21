"use client";

import { useApiStore } from "@/store/apiStore";

export function QueryEditor() {
  const { query, setQuery, removeQuery } = useApiStore();

  const update = (
    id: string,
    field: "key" | "value" | "type" | "file",
    value: string | File | null
  ) => {
    const copy = query.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );

    setQuery(copy);
  };

  const add = () => {
    setQuery([
      ...query,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        type: "text",
        file: null,
      },
    ]);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm text-orange-400">Query Params</h3>

        <button
          onClick={add}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          + Add
        </button>
      </div>

      {query.map((q) => (
        <div key={q.id} className="flex gap-2 mb-2 items-center">
          <select
            value={q.type}
            onChange={(e) => update(q.id, "type", e.target.value as "text" | "file")}
            className="bg-gray-900 text-xs border border-gray-700 rounded px-2 py-1"
          >
            <option value="text">text</option>
            <option value="file">file</option>
          </select>

          <input
            placeholder="key"
            value={q.key}
            onChange={(e) => update(q.id, "key", e.target.value)}
            className="flex-1 bg-gray-900 px-2 py-1 text-sm rounded border border-gray-700"
          />

          {q.type === "text" && (
            <input
              placeholder="value"
              value={q.value}
              onChange={(e) => update(q.id, "value", e.target.value)}
              className="flex-1 bg-gray-900 px-2 py-1 text-sm rounded border border-gray-700"
            />
          )}

          {q.type === "file" && (
            <input
              type="file"
              onChange={(e) => update(q.id, "file", e.target.files?.[0] || null)}
              className="flex-1 text-xs"
            />
          )}

          <button
            onClick={() => removeQuery(q.id)}
            className="text-red-400 text-sm px-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
