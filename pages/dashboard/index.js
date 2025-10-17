"use client";

import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PaperFrame } from "@/components/PaperFrame";
import { PixelButton } from "@/components/PixelButton";
import { ItemForm } from "@/components/ItemForm";
import { ItemList } from "@/components/ItemList";
import { FileManager } from "@/components/FileManager";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import MascotHelper from "@/components/MascotHelper";

export default function Dashboard() {
  return (
    <div
      className="
        min-w-screen min-h-screen grainbg
        flex flex-col gap-6
        px-6 py-10 sm:px-16 lg:px-32
      "
    >
      <H1>Manajemen Barang</H1>
      <P size="lg">
        Selamat datang di Profitly! Atur dan pantau barang digital warungmu
        dengan mudah dan cepat.
      </P>

      <div
        className="
        flex flex-col lg:flex-row
        gap-6
        justify-center items-start
        px-6 py-10
        "
      >
        <div className="flex flex-col gap-6 w-full">
          <PaperFrame className="max-w-[820px] w-full h-[600px]">
            <div className="flex flex-col justify-start items-center h-full p-4">
              <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
                Daftar Barang
              </h2>
              <ItemList />
            </div>
          </PaperFrame>

          <PaperFrame className="max-w-[820px] w-full h-auto">
            <FileManager />
          </PaperFrame>
        </div>

        <PaperFrame className="max-w-[360px] w-full h-[600px]">
          <div className="flex flex-col justify-start items-center h-full p-4">
            <h2 className="font-galindo text-[#835C00] text-2xl mb-4">
              Masukkan Barang
            </h2>
            <ItemForm />
          </div>
        </PaperFrame>
        <MascotHelper
          imgSize={300}
          message={
            <div className="space-y-2 text-left">
              <p>
                📋 Lihat <b>daftar barang</b> di sini, bisa diurutkan
                berdasarkan tanggal atau deskripsi.
              </p>
              <p>
                Tambah nama <b>barang baru</b> dengan mudah di bagian "Masukkan Barang"
              </p>
              <p>
                Kalkulasi <b>profit margin</b>, modal, dan harga jual secara
                otomatis dengan beberapa klik saja!
              </p>
              <p>
                📄 Hasil bisa diunduh dalam format <b>JSON</b>, atau tambahkan
                JSON eksternal untuk mengimpor data dari luar.
              </p>
              <p>SITUS MENGGUNAKAN STORAGE INTERNAL BROWSER, UNTUK CADANGAN SILAHKAN UNDUH JSON</p>
            </div>
          }
        />
      </div>
      <FloatingSidebar />
    </div>
  );
}
