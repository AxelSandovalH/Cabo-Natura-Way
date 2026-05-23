"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";

const STATUSES = [
  { value: "pending",          label: "Pending"          },
  { value: "confirmed",        label: "Confirmed"        },
  { value: "preparing",        label: "Preparing"        },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered",        label: "Delivered"        },
  { value: "cancelled",        label: "Cancelled"        },
];

interface Props {
  orderId: string;
  currentStatus: string;
  colors: Record<string, string>;
}

export default function OrderStatusSelect({ orderId, currentStatus, colors }: Props) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    startTransition(() => updateOrderStatusAction(orderId, newStatus));
  }

  const colorClass = colors[currentStatus] ?? "bg-gray-100 text-gray-600";

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={pending}
      className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D5016]/20 disabled:opacity-60 ${colorClass}`}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
