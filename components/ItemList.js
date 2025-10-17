"use client";

import { useEffect, useState, useRef } from "react";
import { useItemStore } from "@/store/useItemStore";
import { PixelButton } from "@/components/PixelButton";
import { FaTrash } from "react-icons/fa";
import gsap from "gsap";

export function ItemList() {
  const items = useItemStore((s) => s.items);
  const deleteItem = useItemStore((s) => s.deleteItem);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const listRef = useRef(null);

  // Filter items
  const filtered = items
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Sort by date
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Animate item cards
  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, [items, sortBy, sortOrder, search]);

  // Format helper for IDR
  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div className="w-full flex flex-col gap-6 p-4 font-beiruti">
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
        {/* Pixel-style Search */}
        <div className="pixel-search w-full sm:w-[70%] lg:w-[400px] mx-auto text-[#835C00]">
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-[#835C00] text-center placeholder-[#FFECAD]/70
            font-beiruti text-[18px]"
          />
        </div>

        {/* Sort controls */}
        <div className="flex gap-3 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#fff8e7] border border-[#835C00] rounded-md px-3 py-2 text-sm font-semibold text-[#835C00]"
          >
            <option value="date">Tanggal</option>
            <option value="name">Nama</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#fff8e7] border border-[#835C00] rounded-md px-3 py-2 text-sm font-semibold text-[#835C00]"
          >
            <option value="desc">↓ Desc</option>
            <option value="asc">↑ Asc</option>
          </select>
        </div>
      </div>

      {/* Item Cards */}
      <div
        ref={listRef}
        className="
          flex flex-col gap-3 
          max-h-[500px] overflow-y-auto 
          px-1 sm:px-3
        "
      >
        {filtered.length === 0 ? (
          <p className="text-center text-[#835C00] text-sm italic">
            Belum ada barang yang cocok.
          </p>
        ) : (
          filtered.map((item) => {
            const percentage =
              item.budget > 0
                ? ((item.profit / item.budget) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.id}
                className="
                  rounded-lg border border-[#835C00]/60 
                  bg-[#fff8e700] 
                  flex flex-col sm:flex-row 
                  justify-between items-start sm:items-center 
                  p-4 w-full 
                  shadow-[0_2px_0_#835C00]
                  hover:scale-[1.01] transition-transform duration-150
                "
              >
                <div className="flex flex-col gap-1 text-[#835C00] w-full sm:w-auto">
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-sm">
                    Modal: <span className="font-semibold">{formatIDR(item.budget)}</span>
                  </p>
                  <p className="text-sm">
                    Harga Jual: <span className="font-semibold">{formatIDR(item.price)}</span>
                  </p>
                  <p className="text-sm text-green-700 font-semibold">
                    Pendapatan: {formatIDR(item.profit)} ({percentage}%)
                  </p>
                  <p className="text-xs opacity-80 italic">
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 items-center mt-3 sm:mt-0 self-end sm:self-center">
                  <PixelButton
                    onClick={() => deleteItem(item.id)}
                    className="px-3 py-1 bg-red-700 hover:bg-red-800 flex items-center gap-2"
                  >
                    <FaTrash size={14} />
                  </PixelButton>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
