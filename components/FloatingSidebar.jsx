"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChartLine, FaBoxOpen, FaClipboardList, FaUserCheck, FaPrint, FaGlassCheers, FaAtom, FaNewspaper, FaGithub } from "react-icons/fa";

export function FloatingSidebar() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  const menuItems = [
    { name: "Manajemen Barang", icon: <FaClipboardList />, href: "/dashboard" },
    { name: "Grafik Pendapatan", icon: <FaChartLine />, href: "/dashboard/analytics" },
    { name: "Buat Paket", icon: <FaBoxOpen />, href: "/dashboard/package" },
    { name: "Analisa Rate Konsumen", icon: <FaUserCheck />, href: "/dashboard/consumers" },
    { name: "SmartDecision Lab!", icon: <FaAtom />, href: "/dashboard/decision" },
    { name: "Dokumentasi/Contoh", icon: <FaNewspaper />, href: "/cases" },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 z-50 bg-[#FFECAD] text-[#835C00]
                   shadow-lg rounded-full p-4 text-2xl hover:scale-105
                   transition-transform duration-200 border-2 border-[#835C00]"
        aria-label="Toggle menu"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-[#FFF8E7] border-l-4 border-[#835C00]
                    shadow-2xl z-50 transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full font-beiruti">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#835C00]/30">
            <h2 className="text-xl font-galindo text-[#835C00]">Navigasi</h2>
            <button onClick={toggleSidebar} className="text-[#835C00] text-lg">
              <FaTimes />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-2 px-4 py-6 text-[#835C00]">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#FFECAD]/50 
                           transition-colors text-lg font-semibold"
                onClick={toggleSidebar}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto px-6 py-4 text-xs text-center text-[#835C00]/60 border-t border-[#835C00]/20">
            Profitly © {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
}
