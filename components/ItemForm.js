"use client";

import { useState, useEffect } from "react";
import { PixelButton } from "@/components/PixelButton";
import { useItemStore } from "@/store/useItemStore";

export function ItemForm() {
  const addItem = useItemStore((s) => s.addItem);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [price, setPrice] = useState(0);
  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  useEffect(() => {
    setProfit(price - budget);
  }, [budget, price]);

  useEffect(() => {
    setPrice(Number(budget) + Number(profit));
  }, [profit]);

  useEffect(() => {
    if (budget > 0) {
      const margin = (profit / budget) * 100;
      setProfitMargin(margin);
    } else {
      setProfitMargin(0);
    }
  }, [budget, profit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nama barang tidak boleh kosong!");

    addItem({
      id: Date.now(),
      name,
      budget,
      price,
      profit,
      profitMargin,
      createdAt: new Date().toISOString(),
    });

    setName("");
    setBudget(0);
    setPrice(0);
    setProfit(0);
    setProfitMargin(0);
  };

  const handleNumberChange = (field, value) => {
    const num = Number(value.replace(/\D/g, "") || 0);
    if (field === "budget") setBudget(num);
    else if (field === "profit") setProfit(num);
    else if (field === "price") setPrice(num);
  };

  return (
    <form onSubmit={handleSubmit} className="flex font-beiruti flex-col gap-6 w-full px-2">
      {/* Nama Barang */}
      <div>
        <label className="block text-sm font-semibold text-[#835C00] mb-2">
          Nama Barang
        </label>
        <div className="pixel-frame w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent w-full text-[#FFECAD] outline-none text-center placeholder-[#FFECAD]/60"
            placeholder="Contoh: Voucher Game"
          />
        </div>
      </div>

      {/* Modal */}
      <div>
        <label className="block text-sm font-semibold text-[#835C00] mb-2">
          Modal (Budget) - IDR
        </label>
        <div className="pixel-frame w-full">
          <input
            type="text"
            value={budget.toLocaleString("id-ID")}
            onChange={(e) => handleNumberChange("budget", e.target.value)}
            className="bg-transparent w-full text-[#FFECAD] outline-none text-center"
          />
        </div>
      </div>

      {/* Profit */}
      <div>
        <label className="block text-sm font-semibold text-[#835C00] mb-2">
          Target Profit - IDR
        </label>
        <div className="pixel-frame w-full">
          <input
            type="text"
            value={profit.toLocaleString("id-ID")}
            onChange={(e) => handleNumberChange("profit", e.target.value)}
            className="bg-transparent w-full text-[#FFECAD] outline-none text-center"
          />
        </div>
      </div>

      {/* Harga Jual */}
      <div>
        <label className="block text-sm font-semibold text-[#835C00] mb-2">
          Harga Jual - IDR
        </label>
        <div className="pixel-frame w-full">
          <input
            type="text"
            value={price.toLocaleString("id-ID")}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            className="bg-transparent w-full text-[#FFECAD] outline-none text-center"
          />
        </div>
      </div>

      {/*profit Margin*/}
      <div>
        <label className="block text-sm font-semibold text-[#835C00] mb-2">
          Profit Margin
        </label>
        <div className="pixel-frame w-full">
          <p className="text-[#FFECAD] text-center">
            {budget > 0 ? `${profitMargin.toFixed(2)}%` : "-"}
          </p>
        </div>
      </div>

      <PixelButton type="submit" className="self-center mt-4 w-auto">
        Tambah Barang
      </PixelButton>
    </form>
  );
}
