"use client";
import Link from "next/link";

const SidebarItem = ({ icon, label, href, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-2 rounded transition
        ${active ? "bg-[#003083] text-white font-semibold" : "text-gray-700 hover:bg-blue-200"}
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
