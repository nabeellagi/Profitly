"use client";

import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PixelButton } from "@/components/PixelButton";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LandingPage() {
  const titleRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = titleRef.current.querySelectorAll("span");

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
      tl.to(letters, {
        y: -22,
        scaleY: 1.25,
        scaleX: 0.85,
        duration: 0.45,
        ease: "bounce.out",
        stagger: {
          each: 0.08,
          from: "start",
          yoyo: true,
        },
      }).to(
        letters,
        {
          y: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 0.55,
          ease: "elastic.out(1, 0.5)",
          stagger: {
            each: 0.08,
            from: "start",
          },
        },
        "-=0.3"
      );
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="grainbg min-h-screen flex flex-col items-center justify-start text-[#835C00] overflow-x-hidden">
      {/* HERO 1*/}
      <section className="flex flex-col justify-center items-center text-center px-8 sm:px-12 lg:px-20 py-32 gap-6 min-h-[90vh]">
        <motion.h1
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-galindo text-6xl sm:text-7xl text-[#835C00] flex flex-wrap justify-center gap-1"
        >
          {"Profitly".split("").map((char, i) => (
            <span key={i} className="inline-block">
              {char}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg sm:text-xl text-[#835C00]/90 max-w-2xl"
        >
          Kelola bisnismu dengan cara yang cerdas, visual, dan menyenangkan.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/dashboard">
            <PixelButton className="cursor-pointer hover:scale-[1.05] transition-transform duration-200">
              Mulai Sekarang
            </PixelButton>
          </Link>
          <Link href="/cases">
            <PixelButton className="bg-[#835C00] hover:bg-[#9e7400] text-white cursor-pointer hover:scale-[1.05] transition-transform duration-200">
              Lihat Tutorial
            </PixelButton>
          </Link>
          <Link href="https://github.com/nabeellagi/Profitly" target="_blank" rel="noopener noreferrer">
            <PixelButton className="bg-[#835C00] hover:bg-[#9e7400] text-white cursor-pointer hover:scale-[1.05] transition-transform duration-200">
              Source Code
            </PixelButton>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="italic text-[#835C00]/70">
            "Seluruh kompleksitas menjadi mudah."
          </p>
        </motion.div>
      </section>

      {/* HERO 2 */}
      <section className="w-full px-8 sm:px-16 lg:px-24 py-20 bg-[#fff8e725] rounded-3xl shadow-inner flex flex-col justify-center items-center text-center gap-8">
        <H1 className="text-4xl sm:text-5xl text-[#835C00]">
          Untuk Para Pejuang Usaha Mandiri
        </H1>

        <P className="text-lg sm:text-xl text-[#835C00]/90 max-w-3xl leading-relaxed">
          Manajemen bisnis bukan sekadar soal angka — tapi tentang bagaimana
          kamu memahami arus penjualan, modal, dan keuntungan dengan cara yang
          efisien.
        </P>

        <div className="max-w-4xl text-left bg-white/60 p-6 sm:p-10 rounded-2xl border border-[#835C00]/30 backdrop-blur">
          <p className="text-[#835C00] mb-3">Banyak di antara kita adalah:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#835C00]/90">
            <li>
              <b>Pemilik warung kecil</b> yang setiap hari masih mencatat di
              buku lusuh,
            </li>
            <li>
              <b>Freelancer</b> yang sibuk berpindah proyek tanpa waktu mengatur
              laporan,
            </li>
            <li>
              <b>Wirausaha individual</b> yang selalu sibuk,
            </li>
            <li>
              Atau bahkan <b>siswa</b> yang punya usaha sampingan sederhana
              tetapi terhanyut pr.
            </li>
          </ul>

          <p className="mt-6 text-[#835C00]/90">
            Semua punya tujuan sama, <b>mengatur bisnis dengan mudah</b>. Tapi
            tidak semua terbiasa dengan spreadsheet, rumus Excel, atau laporan
            keuangan yang kompleks.
          </p>

          <p className="mt-4 text-[#835C00] font-semibold">
            Maka muncul pertanyaannya: apakah kamu yakin <i>spreadsheet</i> bisa
            menjadi pilihan terbaikmu?
          </p>
        </div>
      </section>

      {/*HERO 3 */}
      <section className="w-full flex flex-col justify-center items-center text-center py-24 px-8 sm:px-16 lg:px-32 gap-10">
        <H1 className="text-4xl sm:text-5xl text-[#835C00]">
          Itulah Kenapa <span className="text-[#9e7400]">Profitly</span> Hadir
        </H1>
        <P className="text-lg sm:text-xl text-[#835C00]/90 max-w-2xl">
          Profitly dibuat untuk membantumu mengelola, menganalisis, dan memahami
          bisnismu
        </P>

        <div className="w-full max-w-5xl">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="rounded-2xl border border-[#835C00]/30 bg-[#fff8e7]/50 shadow-lg"
          >
            {[
              {
                title: "Sistem Manajemen Barang",
                desc: "Kelola daftar barang, hitung margin keuntungan dan pantau performa setiap produk dengan praktis.",
              },
              {
                title: "Dashboard Analisis",
                desc: "Lihat ringkasan penjualan harian, grafik performa, dan prediksi penjualan otomatis.",
              },
              {
                title: "Pembuat Paket",
                desc: "Dapatkan rekomendasi bundel produk dengan keuntungan optimal dan diskon bertingkat.",
              },
              {
                title: "Analisa Rating",
                desc: "Masukkan komentar pelanggan dan biarkan AI menilai sentimen dan memberikan umpan balik berguna.",
              },
              {
                title: "SmartDecision Lab",
                desc: "Uji keputusan bisnismu — dari potongan harga hingga kampanye iklan — dan lihat dampaknya melalui simulasi AI & statistik.",
              },
            ].map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col justify-center items-center text-center py-16 px-6 sm:px-10 gap-6">
                  <h2 className="text-3xl sm:text-4xl font-galindo text-[#835C00]">
                    {slide.title}
                  </h2>
                  <p className="text-[#835C00]/80 max-w-2xl text-lg">
                    {slide.desc}
                  </p>

                  <div className="w-full max-w-4xl aspect-[2.075/1] relative mt-4">
                    <Image
                      src={`/prev/img${i + 1}.png`}
                      alt={`Preview ${i + 1}`}
                      fill
                      className="object-cover rounded-2xl border border-[#835C00]/30 shadow-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      priority={i === 0}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-10">
          <Link href="/dashboard">
            <PixelButton className="cursor-pointer hover:scale-[1.05] transition-transform duration-200">
              Mulai Sekarang
            </PixelButton>
          </Link>
        </div>
      </section>

      {/* HERO 4 */}
      <section className="w-full flex flex-col justify-center items-center text-center py-28 px-6 sm:px-12 lg:px-24 gap-10 bg-[#994600] border-t border-[#835C00]/20">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex md:flex-row flex-col items-center text-[#2596be]"
        >
          <Image
            src="/oc/third.png"
            alt="Adin Mascot"
            width={420}
            height={420}
            className="drop-shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
          <div className="flex flex-col">
            <h2 className="font-galindo text-3xl sm:text-4xl mt-6 text-[#feeeb5]">
              Kenalkan, Adin!
            </h2>
            <p className="max-w-xl mt-4 text-[#feeeb5]/80 text-lg leading-relaxed">
              Adin adalah <b>asisten butler digital</b> yang akan menemanimu di
              Profitly. Ia akan memberikan{" "}
              <span className="italic">tooltip singkat dan tips praktis</span>,
              jadi kamu tak perlu khawatir tersesat di dashboard!
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="py-10 text-center text-sm text-[#835C00]/60">
        © {new Date().getFullYear()} Profitly — Nabeel Adriansyah.
      </footer>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev,
        .swiper-pagination-bullet {
          cursor: pointer !important;
        }
      `}</style>
      <style jsx global>{`
        .sticker-pixel {
          position: absolute;
          top: -16px;
          left: -16px;
          width: 64px;
          height: 64px;
          z-index: 20;
          transform: rotate(-8deg);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .sticker-pixel {
            width: 44px;
            height: 44px;
            top: -12px;
            left: -12px;
          }
        }
      `}</style>
    </div>
  );
}
