"use client";
import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="w-64 h-screen sticky top-0 bg-gradient-to-b from-blue-200 to-blue-100 shadow-lg p-6 flex flex-col">
      {/* Profile */}
      <div className="flex items-center gap-3 mb-8 p-2 bg-white rounded-xl shadow">
        <img
          src={user?.image || "/default-avatar.png"}
          alt={user?.username || "Admin"}
          className="w-12 h-12 rounded-full border-2 border-blue-300"
        />
        <div>
          <p className="font-semibold text-[#003083] text-lg">{user?.username || "ADMIN"}</p>
          <p className="text-sm text-gray-500">{user?.role || "ADMIN"}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3">
        <SidebarItem icon="🏠" label="Dashboard" href="/" active={pathname === "/"} />
        <SidebarItem icon="🏢" label="Organization" href="/organization" active={pathname === "/organization"} />
        <SidebarItem icon="📢" label="Complaints" href="/complaints" active={pathname === "/complaints"} />
        <SidebarItem icon="📅" label="Events" href="/events" active={pathname === "/events"} />
        <SidebarItem icon="⚖️" label="Policy" href="/policy" active={pathname === "/policy"} />
        <SidebarItem icon="💰" label="Budget" href="/budget" active={pathname === "/budget"} />
        <SidebarItem icon="📝" label="Documents" href="/documents" active={pathname === "/documents"} />
        <SidebarItem icon="💬" label="Posts" href="/posts" active={pathname === "/posts"} />
        <SidebarItem icon="💵" label="Tax" href="/tax" active={pathname === "/tax"} />
        <SidebarItem icon="👥" label="Members" href="/members" active={pathname === "/members"} />
        <SidebarItem icon="⚠️" label="SOS/Emergency" href="/sos" active={pathname === "/sos"} />
      </nav>
    </div>
  );
};

export default Sidebar;
