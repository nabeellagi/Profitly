"use client";

import { useState } from "react";
import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PaperFrame } from "@/components/PaperFrame";
import { PixelButton } from "@/components/PixelButton";
import { useItemStore } from "@/store/useItemStore";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import Image from "next/image";

import { FiPlus, FiMinus } from "react-icons/fi";
import MascotHelper from "@/components/MascotHelper";

export default function AnalisaGrafikPage() {
  const items = useItemStore((s) => s.items);

  const {
    days,
    activeDay,
    filterItem,
    chartData,
    summary,
    addDay,
    modifySales,
    setActiveDay,
    setFilterItem,
    setChartData,
    setSummary,
    clearAll,
  } = useAnalyticsStore();

  // // Calculate chart and summary; Old function
  // const calculate = () => {
  //   const { days, filterItem } = useAnalyticsStore.getState();
  //   const items = useItemStore.getState().items;

  //   const data = days.map((d) => {
  //     let totalBudget = 0,
  //       totalPrice = 0,
  //       totalProfit = 0;

  //     items.forEach((i) => {
  //       if (filterItem && i.id !== filterItem) return;
  //       const sold = d.sales[i.id] || 0;
  //       totalBudget += i.budget * sold;
  //       totalPrice += i.price * sold;
  //       totalProfit += (i.price - i.budget) * sold;
  //     });

  //     return {
  //       name: d.label,
  //       budget: totalBudget,
  //       cost: totalPrice,
  //       profit: totalProfit,
  //     };
  //   });

  //   useAnalyticsStore.getState().setChartData(data);

  //   const summarized = data.map((d) => ({
  //     day: d.name,
  //     totalBudget: d.budget,
  //     totalPrice: d.cost,
  //     totalProfit: d.profit,
  //     margin:
  //       d.budget > 0 ? ((d.profit / d.budget) * 100).toFixed(1) + "%" : "0%",
  //   }));

  //   useAnalyticsStore.getState().setSummary(summarized);
  // };

  const calculate = () => {
    // use the reactive values already obtained at the top of your component
    const currentDays = days;
    const currentItems = items;
    const currentFilter = filterItem;

    const data = currentDays.map((d) => {
      let totalBudget = 0,
        totalPrice = 0,
        totalProfit = 0;

      const salesMap = {};

      currentItems.forEach((i) => {
        if (currentFilter && i.id !== currentFilter) return;
        const sold = d.sales[i.id] || 0;
        totalBudget += i.budget * sold;
        totalPrice += i.price * sold;
        totalProfit += (i.price - i.budget) * sold;
        if (sold > 0) salesMap[i.name] = sold;
      });

      return {
        name: d.label,
        budget: totalBudget,
        cost: totalPrice,
        profit: totalProfit,
        salesMap,
      };
    });

    setChartData(data);
    setSummary(
      data.map((d) => {
        let maxSold = 0;
        let mostBought = [];

        for (const [itemName, sold] of Object.entries(d.salesMap)) {
          if (sold > maxSold) {
            maxSold = sold;
            mostBought = [itemName];
          } else if (sold === maxSold) {
            mostBought.push(itemName);
          }
        }

        return {
          day: d.name,
          totalBudget: d.budget,
          totalPrice: d.cost,
          totalProfit: d.profit,
          margin:
            d.budget > 0
              ? ((d.profit / d.budget) * 100).toFixed(1) + "%"
              : "0%",
          mostBought,
        };
      })
    );
  };

  const downloadCSV = () => {
    if (days.length === 0 || items.length === 0) {
      alert("Belum ada data untuk diunduh!");
      return;
    }

    const header = [
      "Hari",
      "Barang",
      "Jumlah Terjual",
      "Modal per Unit",
      "Harga per Unit",
      "Total Modal",
      "Total Penjualan",
      "Profit",
    ];

    const rows = [];

    days.forEach((d) => {
      items.forEach((i) => {
        const sold = d.sales[i.id] || 0;
        if (sold === 0) return; // Skip items not sold

        const totalBudget = i.budget * sold;
        const totalPrice = i.price * sold;
        const profit = totalPrice - totalBudget;

        rows.push([
          d.label,
          i.name,
          sold,
          i.budget,
          i.price,
          totalBudget,
          totalPrice,
          profit,
        ]);
      });
    });

    // Convert to CSV
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((r) => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analisa_grafik_detail.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div
      className="
        min-w-screen min-h-screen grainbg
        flex flex-col gap-6
        px-6 py-10 sm:px-12 lg:px-20
      "
    >
      <H1>Analisa Grafik</H1>
      <P size="lg">
        Lihat perkembangan penjualan dan margin keuntungan harianmu dalam bentuk
        grafik. Gunakan tab harian untuk menambahkan data penjualan dan pantau
        performa secara visual.
      </P>

      {/* FRAME 1: FILTER & CHART */}
      <PaperFrame className="w-full h-auto flex flex-col gap-4 justify-start items-center p-6">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <h2 className="font-galindo text-[#835C00] text-2xl mb-2">
            Grafik Penjualan
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterItem ?? ""} // ensures "Semua Barang" is shown by default
              className="border border-[#835C00]/50 bg-transparent text-[#835C00] rounded-lg px-3 py-2"
              onChange={(e) =>
                setFilterItem(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Semua Barang</option>
              {items.map((i) => (
                <option key={i.id} value={i.id} className="text-black">
                  {i.name}
                </option>
              ))}
            </select>

            <PixelButton onClick={calculate}>Tampilkan Grafik</PixelButton>
            <PixelButton
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700"
            >
              Unduh CSV
            </PixelButton>
            <PixelButton
              onClick={() => {
                const confirmClear = confirm(
                  "Apakah kamu yakin ingin menghapus semua data penjualan dan grafik?"
                );
                if (confirmClear) {
                  clearAll();
                  setChartData([]);
                  setSummary([]);
                  setFilterItem(null);
                  alert("Data berhasil dihapus!");
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus Data
            </PixelButton>
          </div>
        </div>

        {/* Responsive Chart Container */}
        <div className="w-full h-[400px] flex-shrink-0 overflow-hidden">
          {chartData.length === 0 ? (
            <p className="text-[#835C00] italic text-center mt-10">
              Belum ada data. Tekan "Tampilkan Grafik" setelah menambahkan
              penjualan.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                style={{ backgroundColor: "white", borderRadius: "12px" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => formatIDR(v)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#fc0ac4ec"
                  name="Total Modal"
                  strokeWidth={4}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#219EBC"
                  name="Total Penjualan"
                  strokeWidth={4}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#2A9D8F"
                  name="Total Profit"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </PaperFrame>

      {/* FRAME 2: DAY TABS + ITEM SALES */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start w-full">
        {/* Left: Day Tabs */}
        <div className="flex flex-col items-center max-w-[90vw]">
          <PaperFrame className="max-w-[60vw] sm:max-w-[50vw] lg:max-w-[40vw] w-full h-[600px] flex flex-col justify-start items-center p-4 gap-4">
            <h2 className="font-galindo text-[#835C00] text-2xl mb-2">
              Hari Penjualan
            </h2>
            <div className="flex gap-2 w-full overflow-x-auto px-2 pb-2">
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDay(d.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-150 ${
                    activeDay === d.id
                      ? "bg-[#FFECAD] text-[#835C00] font-semibold"
                      : "bg-[#fff8e715] text-[#835C00]/70 hover:bg-[#fff8e730]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              {days.length < 30 && (
                <button
                  onClick={addDay}
                  className="px-4 py-2 bg-[#fff8e720] text-[#835C00] border border-[#835C00]/40 rounded-lg hover:bg-[#FFECAD]/30"
                >
                  + Tambah Hari
                </button>
              )}
            </div>
          </PaperFrame>
          <MascotHelper
            imgSize={300}
            message={
              <div className="space-y-2 text-left">
                <p>
                  Kamu bisa menambahkan <b>hari penjualan</b> di sini.
                </p>
                <p>
                  Di tab <b>Penjualan Per Hari</b>, kamu bisa menambah atau
                  mengurangi jumlah item terjual.
                </p>
                <p>
                  Gulir ke atas dan tekan <b>Tampilkan Grafik</b> untuk melihat
                  visualisasi per item atau keseluruhan.
                </p>
                <p>
                  Di bagian bawah, ada <b>ringkasan penjualan harian</b> yang
                  merangkum performa kamu hari ini.
                </p>
                <p>
                  Unduh file <b>CSV</b> dan unggah kembali di frame paling bawah
                  untuk melihat <b>prediksi penjualan</b> berikutnya.
                </p>
              </div>
            }
          />
        </div>

        {/* Right: Item sales editor */}
        <PaperFrame className="max-w-[600px] w-full h-[600px] overflow-y-auto flex flex-col justify-start items-center p-4 gap-4">
          <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
            Data Penjualan
          </h2>

          {items.length === 0 ? (
            <p className="text-[#835C00] text-center italic">
              Belum ada data barang. Tambahkan barang di halaman{" "}
              <span className="underline">/dashboard</span>.
            </p>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {items.map((item) => {
                const sales =
                  days.find((d) => d.id === activeDay)?.sales[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border border-[#835C00]/50 rounded-lg p-3 bg-[#fff8e710]"
                  >
                    <div>
                      <p className="font-semibold text-[#835C00]">
                        {item.name}
                      </p>
                      <p className="text-sm text-[#835C00]/80">
                        Modal: {formatIDR(item.budget)} | Harga:{" "}
                        {formatIDR(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => modifySales(item.id, -1)}
                        className="p-2 rounded-full bg-[#fff8e725] hover:bg-[#FFECAD]/40 text-[#835C00]"
                      >
                        <FiMinus />
                      </button>
                      <span className="text-[#835C00] w-8 text-center font-semibold">
                        {sales}
                      </span>
                      <button
                        onClick={() => modifySales(item.id, 1)}
                        className="p-2 rounded-full bg-[#fff8e725] hover:bg-[#FFECAD]/40 text-[#835C00]"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PaperFrame>
      </div>
      {/* FRAME 3: DAILY SUMMARY */}
      <PaperFrame className="w-full h-auto flex flex-col justify-start items-center p-6 gap-4">
        <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
          Ringkasan Harian
        </h2>

        {summary.length === 0 ? (
          <p className="text-[#835C00] italic">
            Belum ada data. Tekan “Tampilkan Grafik” untuk melihat ringkasan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {summary.map((d, idx) => (
              <div
                key={idx}
                className="border border-[#835C00]/40 rounded-lg p-4 bg-[#fff8e710]"
              >
                <p className="font-bold text-[#835C00] mb-2">{d.day}</p>
                <p className="text-sm text-[#835C00]/90">
                  Total Modal: {formatIDR(d.totalBudget)}
                </p>
                <p className="text-sm text-[#835C00]/90">
                  Total Penjualan: {formatIDR(d.totalPrice)}
                </p>
                <p className="text-sm text-[#835C00]/90">
                  Total Profit: {formatIDR(d.totalProfit)}
                </p>
                <p className="text-green-800 font-semibold">
                  Margin: {d.margin}
                </p>

                {/* New section: Most Bought Items */}
                {d.mostBought && d.mostBought.length > 0 ? (
                  <p className="text-sm text-[#835C00]/80 mt-2">
                    <span className="font-semibold">
                      Barang Terbanyak Terjual:
                    </span>{" "}
                    {d.mostBought.join(", ")}{" "}
                    {d.mostBought.length > 1 ? "(tie)" : ""}
                  </p>
                ) : (
                  <p className="text-sm text-[#835C00]/80 mt-2 italic">
                    Tidak ada penjualan
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </PaperFrame>

      <PaperFrame
        className="
            w-full
            min-h-[500px]
            sm:min-h-[600px]
            lg:min-h-[700px]
            flex flex-col justify-center items-center
            p-2 sm:p-0
          "
      >
        <div
          className="
              w-full
              h-[420px] sm:h-[550px] lg:h-[650px]
              overflow-hidden
              rounded-xl sm:rounded-2xl
              border border-[#835C00]/50
              shadow-inner
              bg-[#fff8e710]
            "
        >
          <iframe
            src="https://nab3588-demandregression.hf.space/"
            className="
                w-full h-full border-none
                scale-[1.02] sm:scale-100 origin-top
              "
            title="Analisa Prediksi Konsumen"
            loading="lazy"
          />
        </div>

        <p className="text-xs sm:text-sm text-[#835C00]/80 mt-3 italic text-center">
          Jika belum terlihat, pastikan koneksi internet stabil dan refresh!
        </p>
      </PaperFrame>
      <FloatingSidebar />
    </div>
  );
}
