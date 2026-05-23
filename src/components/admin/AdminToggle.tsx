"use client";

import { useTransition } from "react";

interface Props {
  id: string;
  field: "in_stock" | "featured";
  value: boolean;
  action: (id: string, field: "in_stock" | "featured", value: boolean) => Promise<any>;
}

export default function AdminToggle({ id, field, value, action }: Props) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(() => action(id, field, !value));
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={`Toggle ${field}`}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        value ? "bg-[#2D5016]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
