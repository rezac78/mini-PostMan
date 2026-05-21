import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HeaderItem, QueryItem, HistoryItem, Project } from "@/types/api";
import { extractFolderName } from "@/utils/extract-folder-name";

interface ApiState {
  url: string;
  method: string;
  body: string;
  response: any;
  loading: boolean;
  history: HistoryItem[];
  projects: Project[];
  currentProjectId: string | null;

  headers: HeaderItem[];
  query: QueryItem[];
  env: Record<string, string>;

  baseUrl: string;
  openFolders: Record<string, boolean>;
  search: string;

  // ——— Project Actions ———
  addProject: (name: string) => void;
  setCurrentProject: (id: string | null) => void;
  updateProjectEnv: (id: string, env: Record<string, string>) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;

  // ——— Existing Actions ———
  deleteHistory: (id: number) => void;
  setUrl: (v: string) => void;
  setMethod: (v: string) => void;
  setBody: (v: string) => void;
  setHeaders: (h: HeaderItem[]) => void;
  setQuery: (q: QueryItem[]) => void;
  setEnv: (e: Record<string, string>) => void;
  setSearch: (v: string) => void;
  removeQuery: (id: string) => void;
  removeHeader: (id: string) => void;
  importHistory: (items: HistoryItem[]) => void;
  sendRequest: () => Promise<void>;
  loadHistory: (item: HistoryItem) => void;
  togglePin: (id: number) => void;
}

const DEFAULT_PROJECT: Project = {
  id: "default",
  name: "Default Project",
  env: { API_URL: "", TOKEN: "" },
};

export const useApiStore = create<ApiState>()(
  persist(
    (set, get) => ({
      // ——— State ———
      url: "",
      method: "GET",
      body: "",
      response: null,
      loading: false,
      baseUrl: "",
      openFolders: {},
      search: "",

      projects: [DEFAULT_PROJECT],
      currentProjectId: "default",

      headers: [
        {
          id: crypto.randomUUID(),
          key: "Content-Type",
          value: "application/json",
        },
      ],

      query: [
        {
          id: crypto.randomUUID(),
          key: "",
          value: "",
          type: "text" as const,
          file: null,
        },
      ],

      env: { API_URL: "", TOKEN: "" },

      history: [],

      // ——— Project Actions ———
      addProject: (name) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          env: { API_URL: "", TOKEN: "" },
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id,
          env: newProject.env,
          history: [],
          url: "",
          method: "GET",
          body: "",
          response: null,
        }));
      },
      renameProject: (id, name) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name } : p,
          ),
        }));
      },
      setCurrentProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;

        set({
          currentProjectId: id,
          env: project.env,
          url: "",
          method: "GET",
          body: "",
          response: null,
        });
      },

      updateProjectEnv: (id, env) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, env } : p,
          ),
          env: id === state.currentProjectId ? env : state.env,
        }));
      },

      deleteProject: (id) => {
        set((state) => {
          if (id === "default") return state; // پروژه پیشفرض حذف نشود

          const filteredProjects = state.projects.filter((p) => p.id !== id);
          const filteredHistory = state.history.filter(
            (h) => h.projectId !== id,
          );

          return {
            projects: filteredProjects,
            history: filteredHistory,
            currentProjectId: "default",
          };
        });
      },

      // ——— Existing Actions ———
      setUrl: (url) => set({ url }),
      setMethod: (method) => set({ method }),
      setBody: (body) => set({ body }),
      setSearch: (search) => set({ search }),

      importHistory: (items) =>
        set((state) => ({
          history: [...items, ...state.history],
        })),

      deleteHistory: (id) => {
        const history = get().history.filter((h) => h.id !== id);
        set({ history });
      },

      removeQuery: (id) => {
        const query = get().query.filter((q) => q.id !== id);
        set({
          query: query.length
            ? query
            : [
                {
                  id: crypto.randomUUID(),
                  key: "",
                  value: "",
                  type: "text" as const,
                  file: null,
                },
              ],
        });
      },

      removeHeader: (id) => {
        const headers = get().headers.filter((h) => h.id !== id);
        set({
          headers: headers.length
            ? headers
            : [
                {
                  id: crypto.randomUUID(),
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
        });
      },

      setHeaders: (headers) => set({ headers }),
      setQuery: (query) => set({ query }),
      setEnv: (env) => set({ env }),

      loadHistory: (item) => {
        const safeHeaders = (item.headers || []).map((h) => ({
          id: h.id || crypto.randomUUID(),
          key: h.key || "",
          value: h.value || "",
        }));

        const safeQuery = (item.query || []).map((q) => ({
          id: q.id || crypto.randomUUID(),
          key: q.key || "",
          value: q.value || "",
          type: q.type || ("text" as const),
          file: null,
        }));

        set({
          url: item.url || "",
          method: item.method || "GET",
          headers: safeHeaders.length
            ? safeHeaders
            : [
                {
                  id: crypto.randomUUID(),
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
          query: safeQuery.length
            ? safeQuery
            : [
                {
                  id: crypto.randomUUID(),
                  key: "",
                  value: "",
                  type: "text" as const,
                  file: null,
                },
              ],
          body: item.body || "",
        });
      },

      togglePin: (id) => {
        const history = get().history.map((h) =>
          h.id === id ? { ...h, pinned: !h.pinned } : h,
        );
        set({ history });
      },

      sendRequest: async () => {
        set({ loading: true });

        const {
          url,
          method,
          headers,
          body,
          query,
          env,
          history,
          currentProjectId,
        } = get();

        const hasFile = query.some((q) => q.type === "file" && q.file);

        let finalUrl = url;

        if (env.API_URL && !url.startsWith("http")) {
          finalUrl = env.API_URL + url;
        }

        let bodyData: BodyInit | null = body;

        if (hasFile) {
          const form = new FormData();

          query.forEach((q) => {
            if (!q.key) return;
            if (q.type === "file" && q.file) {
              form.append(q.key, q.file);
            } else {
              form.append(q.key, q.value);
            }
          });

          bodyData = form;
        } else {
          const params = query
            .filter((q) => q.key)
            .map(
              (q) =>
                `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`,
            )
            .join("&");

          if (params) {
            finalUrl += (finalUrl.includes("?") ? "&" : "?") + params;
          }
        }

        const headersObj: Record<string, string> = {};

        headers.forEach((h) => {
          if (!h.key) return;
          if (
            bodyData instanceof FormData &&
            h.key.toLowerCase() === "content-type"
          ) {
            return;
          }
          headersObj[h.key] = h.value;
        });

        if (env.TOKEN) {
          headersObj["Authorization"] = `Bearer ${env.TOKEN}`;
        }

        const options: RequestInit = {
          method,
          headers: headersObj,
        };

        if (["POST", "PUT", "PATCH"].includes(method)) {
          options.body = bodyData;
        }

        const start = performance.now();

        try {
          const res = await fetch(finalUrl, options);

          const text = await res.text();
          const responseHeaders: Record<string, string> = {};

          res.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          let data;
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }

          const size = new Blob([text]).size;
          const time = Math.round(performance.now() - start);

          const response = {
            status: res.status,
            ok: res.ok,
            time,
            size,
            headers: responseHeaders,
            data,
          };

          let updated = history;

          if (res.status === 200 || res.status === 201) {
            const newItem: HistoryItem = {
              id: Date.now(),
              url,
              method,
              body: body || "",
              headers: headers.map((h) => ({ ...h })),
              query: query.map((q) => ({
                ...q,
                file: null,
              })),
              time,
              folder: extractFolderName(url),
              projectId: currentProjectId || "default",
            };

            updated = [newItem, ...history];
          }

          set({ response, history: updated, loading: false });
        } catch (err: any) {
          set({ response: { error: err.message }, loading: false });
        }
      },
    }),
    {
      name: "api-store",
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
        history: state.history,
        env: state.env,
        query: state.query.map((q) => ({
          ...q,
          file: null,
        })),
        headers: state.headers,
      }),
    },
  ),
);
