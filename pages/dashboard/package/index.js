"use client";

import { useState } from "react";
import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PaperFrame } from "@/components/PaperFrame";
import { PixelButton } from "@/components/PixelButton";
import { useItemStore } from "@/store/useItemStore";
import { generateOptimizedBundles } from "@/utils/bundleOptimizer";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import MascotHelper from "@/components/MascotHelper";

export default function BundleOptimizerPage() {
  const items = useItemStore((s) => s.items);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [error, setError] = useState("");

  const handleToggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOptimize = () => {
    setError("");
    try {
      const chosen = items.filter((i) => selectedItems.includes(i.id));
      if (chosen.length < 2) {
        setError("Pilih minimal dua barang untuk membuat paket!");
        return;
      }

      if (chosen.length % 2 !== 0) {
        setError("Jumlah barang harus genap untuk membuat paket!");
        return;
      }

      const result = generateOptimizedBundles(chosen);
      setBundles(result);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memproses paket.");
    }
  };

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // Extra discount grading tierS
  const discountTiers = [
    { label: "Stable Discount", k: 0.2 },
    { label: "Standard Discount", k: 0.5 },
    { label: "Aggressive Promo", k: 1 },
    { label: "Flash Sale", k: 1.2 },
    { label: "Limited Promo", k: 1.5 },
  ];

  return (
    <div
      className="
        min-w-screen min-h-screen grainbg
        flex flex-col gap-6
        px-6 py-10 sm:px-16 lg:px-32
      "
    >
      <H1>Buat Paket</H1>
      <P size="lg">
        Pilih beberapa barang dari daftar di bawah untuk membentuk paket dengan
        rekomendasi harga dan diskon otomatis berdasarkan margin keuntungan.
      </P>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start px-6 py-10">
        {/* LEFT: Item Selector */}
        <PaperFrame className="max-w-[500px] w-full h-[600px] overflow-y-auto">
          <div className="flex flex-col justify-start items-center h-full p-4">
            <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
              Pilih Barang
            </h2>

            {items.length === 0 ? (
              <p className="text-[#835C00] text-center italic">
                Belum ada data barang. Tambahkan barang di halaman{" "}
                <span className="underline">/dashboard</span>.
              </p>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {items.map((item) => {
                  const selected = selectedItems.includes(item.id);
                  const percentage =
                    item.budget > 0
                      ? ((item.profit / item.budget) * 100).toFixed(1)
                      : 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item.id)}
                      className={`
                        border rounded-lg cursor-pointer p-3 transition-all duration-150
                        ${
                          selected
                            ? "bg-[#FFECAD]/30 border-[#835C00] scale-[1.02]"
                            : "bg-transparent border-[#835C00]/40 hover:bg-[#fff8e715]"
                        }
                      `}
                    >
                      <p className="font-semibold text-[#835C00]">
                        {item.name}
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Modal: {formatIDR(item.budget)}
                      </p>
                      <p className="text-xl text-[#835C00]/90">
                        Harga: {formatIDR(item.price)}
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Profit: {formatIDR(item.profit)} ({percentage}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <MascotHelper
            imgSize={300}
            imgSrc="/oc/second.png"
            message={
              <div className="space-y-2 text-left">
                <p>Pilih Barang dengan Jumlah Genap</p>
                <p>
                  Sistem akan mencarikan pasangan item terbaik dan rekomendasi
                  diskon
                </p>
                <p>
                  <b>Tabel Diskon</b> akan memberikan tingkatan potongan harga
                  dan persentase profit terbaik
                </p>
              </div>
            }
          />
        </PaperFrame>

        {/* RIGHT: Results */}
        <PaperFrame className="max-w-[600px] w-full h-auto min-h-[600px] overflow-y-auto ">
          <div className="flex flex-col justify-start items-center h-full p-4 gap-4">
            <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
              Rekomendasi Paket
            </h2>

            <PixelButton onClick={handleOptimize} className="px-6 py-2">
              Cari Rekomendasi Paket
            </PixelButton>

            {error && (
              <p className="text-red-700 font-semibold text-center">{error}</p>
            )}

            {bundles.length > 0 && (
              <div className="flex flex-col gap-4 w-full mt-4">
                {bundles.map((b, i) => {
                  // Generate grading tables for each K
                  const gradingRows = discountTiers.map((tier) => {
                    const [graded] = generateOptimizedBundles(
                      items.filter((i) => selectedItems.includes(i.id)),
                      tier.k
                    ).filter(
                      (bundle) => bundle.bundle.join("+") === b.bundle.join("+")
                    );

                    return (
                      graded && {
                        ...tier,
                        discountPercent: graded.discountRate,
                        discountedPrice: graded.discountedPrice,
                        profitMargin: graded.avgMargin,
                      }
                    );
                  });

                  return (
                    <div
                      key={i}
                      className="border border-[#835C00]/50 rounded-lg p-4 bg-[#fff8e710]
                      max-w-[60vw]"
                    >
                      <p className="font-bold text-[#835C00]">
                        Paket #{i + 1}: {b.bundle.join(" + ")}
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Total Harga: {formatIDR(b.totalPrice)}
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Total Profit: {formatIDR(b.totalProfit)}
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Margin Rata-rata: {b.avgMargin}%
                      </p>
                      <p className="text-sm text-[#835C00]/90">
                        Diskon Rekomendasi: {b.discountRate}
                      </p>
                      <p className="text-green-800 font-semibold">
                        Harga Setelah Diskon: {formatIDR(b.discountedPrice)}
                      </p>
                      <p className="text-green-800 font-semibold">
                        Pembulatan:{" "}
                        {formatIDR(Math.floor(b.discountedPrice / 1000) * 1000)}{" "}
                        atau{" "}
                        {formatIDR(Math.floor(b.discountedPrice / 500) * 500)}
                      </p>

                      {/* Collapsible Grading Table */}
                      <details className="mt-3">
                        <summary className="cursor-pointer text-[#835C00] font-semibold">
                          Lihat Tabel Grading Diskon
                        </summary>
                        <div className="mt-2 w-full overflow-hidden">
                          <div className="overflow-x-auto max-h-[240px] scrollbar-thin scrollbar-thumb-[#835C00]/40">
                            <table className="w-full text-sm border-collapse border border-[#835C00]/40">
                              <thead className="bg-[#FFF6DA]">
                                <tr>
                                  <th className="border border-[#835C00]/40 px-2 py-1 text-left">
                                    Tipe Diskon
                                  </th>
                                  <th className="border border-[#835C00]/40 px-2 py-1 text-left">
                                    Persen Diskon
                                  </th>
                                  <th className="border border-[#835C00]/40 px-2 py-1 text-left">
                                    Harga Setelah Diskon
                                  </th>
                                  <th className="border border-[#835C00]/40 px-2 py-1 text-left">
                                    Margin Profit
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {gradingRows.map(
                                  (row, idx) =>
                                    row && (
                                      <tr
                                        key={idx}
                                        className="hover:bg-[#FFF2B0]/40"
                                      >
                                        <td className="border border-[#835C00]/40 px-2 py-1">
                                          {row.label}
                                        </td>
                                        <td className="border border-[#835C00]/40 px-2 py-1">
                                          {row.discountPercent}
                                        </td>
                                        <td className="border border-[#835C00]/40 px-2 py-1">
                                          {formatIDR(row.discountedPrice)}
                                        </td>
                                        <td className="border border-[#835C00]/40 px-2 py-1">
                                          {row.profitMargin}%
                                        </td>
                                      </tr>
                                    )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PaperFrame>
      </div>
      <FloatingSidebar />
    </div>
  );
}
