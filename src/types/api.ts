export type HeaderItem = {
  id: string;
  key: string;
  value: string;
};

export interface Project {
  id: string;
  name: string;
  baseUrl: string;
  env: Record<string, string>;
}

export type QueryItem = {
  id: string;
  key: string;
  value: string;
  type: "text" | "file";
  file?: File | null;
};

export interface HistoryItem {
  id: number;
  url: string;
  method: string;
  body: string;
  headers: HeaderItem[];
  query: QueryItem[];
  time: number;
  pinned?: boolean;
  projectId?: string;
}
