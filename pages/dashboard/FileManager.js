"use client";

import { useRef } from "react";
import { useItemStore } from "@/store/useItemStore";
import { PixelButton } from "@/components/PixelButton";

export default function FileManager() {
  const fileInputRef = useRef(null);
  const items = useItemStore((s) => s.items);
  const clearAll = useItemStore((s) => s.clearAll);
  const addItem = useItemStore((s) => s.addItem);

  const handleDownload = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "profitly-items.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) {
          alert("File tidak valid! Pastikan formatnya adalah array JSON.");
          return;
        }

        clearAll(); // remove old items
        data.forEach((item) => addItem(item)); // safely add new ones
        alert("Data berhasil dimuat dari file!");
      } catch (err) {
        console.error(err);
        alert("Gagal membaca file JSON. Format tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center font-beiruti w-full gap-4 p-4">
      <h2 className="font-galindo text-[#835C00] text-2xl mb-2">
        Simpan & Muat Data
      </h2>

      <p className="text-[#835C00] text-center text-sm mb-2 max-w-[300px]">
        Unduh semua data barangmu sebagai file JSON atau unggah file untuk memuat ulang data.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
        <PixelButton onClick={handleDownload} className="px-6 py-2">
          💾 Unduh JSON
        </PixelButton>

        <PixelButton
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-green-700 hover:bg-green-800"
        >
          📂 Unggah JSON
        </PixelButton>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <p className="text-xs italic text-[#835C00]/70 mt-3">
        Semua perubahan akan langsung tersimpan ke localStorage.
      </p>
    </div>
  );
}
