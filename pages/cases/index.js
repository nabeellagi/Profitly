"use client";

import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PaperFrame } from "@/components/PaperFrame";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import MascotHelper from "@/components/MascotHelper";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function CaseStudies() {
  const cases = [
    {
      title: "Sistem Manajemen Barang",
      desc: "Pelajari bagaimana Profitly membantu pengguna mengelola barang dan menghitung margin keuntungan.",
      video: "https://www.youtube.com/embed/glsnHR1aHs0",
      img: "/prev/img1.png",
    },
    {
      title: "Analisa Grafik & Dashboard",
      desc: "Tonton bagaimana data penjualan divisualisasikan menjadi grafik performa yang mudah dipahami, lengkap dengan prediksi otomatis.",
      video: "https://www.youtube.com/embed/DZTCj08gEPY",
      img: "/prev/img2.png",
    },
    {
      title: "Pembuat Paket & Bundle Deal",
      desc: "Simak studi kasus pembuatan paket penjualan dengan diskon bertingkat dan rekomendasi keuntungan optimal.",
      video: "https://www.youtube.com/embed/-U9YzmSpXEg",
      img: "/prev/img3.png",
    },
    {
      title: "Analisa Rating Konsumen",
      desc: "AI Profitly menganalisa komentar pelanggan dan menghasilkan laporan sentimen yang membantu meningkatkan kualitas produk.",
      video: "https://www.youtube.com/embed/u-eN-7XzFiI",
      img: "/prev/img4.png",
    },
    {
      title: "Smart Decision Lab",
      desc: "Eksperimen interaktif untuk menguji dampak keputusan bisnis seperti promosi dan diskon menggunakan AI & simulasi statistik.",
      video: "https://www.youtube.com/embed/Z2aQF3hpUTc",
      img: "/prev/img5.png",
    },
  ];

  return (
    <div
      className="
        min-w-screen min-h-screen grainbg
        flex flex-col gap-6
        px-4 py-8 sm:px-10 lg:px-32
      "
    >
      <H1>Case Studies & Documentation</H1>
      <P size="lg">
        Saksikan langsung dokumentasi dan studi kasus nyata Profitly. 
        Pelajari bagaimana setiap fitur bekerja di dunia nyata, dari pengelolaan barang, analisa penjualan, hingga eksperimen bisnis AI.
      </P>

      {/* SWIPER SECTION */}
      <div className="w-full max-w-5xl mt-8">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{ clickable: true }}
          navigation
          loop
          className="rounded-2xl border border-[#835C00]/30 bg-[#fff8e7]/50 shadow-lg"
        >
          {cases.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col justify-center items-center text-center py-12 px-6 sm:px-10 gap-6">
                <h2 className="text-3xl sm:text-4xl font-galindo text-[#835C00]">
                  {slide.title}
                </h2>
                <p className="text-[#835C00]/80 max-w-2xl text-lg">
                  {slide.desc}
                </p>

                <div
                  className="
                    w-full
                    max-w-4xl
                    aspect-[16/9]
                    border border-[#835C00]/50
                    rounded-xl overflow-hidden
                    bg-[#fff8e710] shadow-inner
                  "
                >
                  <iframe
                    src={slide.video}
                    title={slide.title}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DESCRIPTION AND MASCOT */}
      <div className="flex flex-col items-center justify-center py-10">
        <PaperFrame className="p-6 text-center">
          <p className="text-[#835C00]/90 max-w-3xl">
            Selamat Datang di Dokumentasi dan contoh penggunaan Profitly!
            <br/>
            Terima Kasih untuk SMAN 1 Rejang Lebong!
          </p>
        </PaperFrame>
      </div>

      <MascotHelper
        imgSize={260}
        imgSrc="/oc/second.png"
        message={
          <div className="space-y-2 text-left">
            <p>
              Tonton, pelajari, dan terapkan metode serupa untuk usahamu sendiri!
            </p>
          </div>
        }
      />

      <FloatingSidebar />
    </div>
  );
}
