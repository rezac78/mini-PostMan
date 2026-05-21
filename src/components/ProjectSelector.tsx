"use client";
import { useState } from "react";
import { useApiStore } from "@/store/apiStore";
import Modal from "./Modal";

export const ProjectSelector = () => {
  const { projects, currentProjectId, setCurrentProject, addProject, deleteProject, renameProject } = useApiStore();

  const [modal, setModal] = useState<{ type: 'rename' | 'add' | 'delete' | null, isOpen: boolean }>({ type: null, isOpen: false });
  const [tempName, setTempName] = useState("");

  const closeModal = () => setModal({ type: null, isOpen: false });
  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <div className="mb-4 space-y-2">
      <select
        value={currentProjectId}
        onChange={(e) => {
          if (e.target.value === "NEW") {
            setTempName(""); setModal({ type: 'add', isOpen: true });
          } else {
            setCurrentProject(e.target.value);
          }
        }}
        className="w-full bg-gray-900 text-xs p-2 rounded border border-gray-700 outline-none"
      >
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        <option value="NEW">+ Create New Project</option>
      </select>

      <div className="flex gap-2 text-xs">
        <button
          onClick={() => {
            if (!currentProjectId) return
            setTempName(currentProject?.name || "")
            setModal({ type: "rename", isOpen: true })
          }}
          className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          ✏️ Rename
        </button>
        <button onClick={() => setModal({ type: 'delete', isOpen: true })} className="bg-red-900/50 text-red-200 px-2 py-1 rounded hover:bg-red-800">🗑 Delete</button>
      </div>

      <Modal open={modal.isOpen} onClose={closeModal} title={modal.type === 'add' ? "New Project" : modal.type === 'rename' ? "Rename Project" : "Delete Project"}>
        {modal.type !== 'delete' ? (
          <div className="space-y-4">
            <input
              autoFocus className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-xs"
              placeholder="Project Name..." value={tempName} onChange={(e) => setTempName(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={closeModal} className="text-gray-400 text-xs">Cancel</button>
              <button onClick={() => {
                modal.type === 'add' ? addProject(tempName) : renameProject(currentProjectId, tempName);
                closeModal();
              }} className="bg-orange-600 px-3 py-1 rounded text-white text-xs">Save</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Are you sure? All history in this project will be lost.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={closeModal} className="text-gray-400 text-xs">Cancel</button>
              <button onClick={() => { deleteProject(currentProjectId); closeModal(); }} className="bg-red-600 px-3 py-1 rounded text-white text-xs">Confirm Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
