"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  label: string;
  action: (id: string) => Promise<any>;
}

export default function AdminDeleteBtn({ id, label, action }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => startTransition(() => action(id))}
          disabled={pending}
          className="text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          {pending ? "…" : "Delete"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[11px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
