"use client";

import { H1 } from "@/components/Heading";
import P from "@/components/Paragraph";
import { PaperFrame } from "@/components/PaperFrame";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import MascotHelper from "@/components/MascotHelper";

export default function KepuasanKonsumen() {
  return (
    <div
      className="
        min-w-screen min-h-screen grainbg
        flex flex-col gap-6
        px-4 py-8 sm:px-10 lg:px-32
      "
    >
      <H1>Analisa Kepuasan Konsumen</H1>
      <P size="lg">
        Lihat data tingkat kepuasan pelanggan berdasarkan komentar yang
        diberikan.
      </P>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start sm:px-6 py-8">
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
              src="http://nab3588-customerrates.hf.space/"
              className="
                w-full h-full border-none
                scale-[1.02] sm:scale-100 origin-top
              "
              title="Analisa Kepuasan Konsumen"
              loading="lazy"
            />
          </div>

          <p className="text-xs sm:text-sm text-[#835C00]/80 mt-3 italic text-center">
            Jika belum terlihat, pastikan koneksi internet stabil dan refresh!
          </p>
        </PaperFrame>
      </div>

      <MascotHelper
        imgSize={300}
        imgSrc="/oc/second.png"
        message={
          <div className="space-y-2 text-left">
            <p>
              Salin hingga 15 ulasan pelanggan dan dapatkan hasil analisa rating
              otomatis!
            </p>
            <p>
              Kamu juga akan diberikan saran dan rekomendasi terkait melalui AI
            </p>
          </div>
        }
      />
      <FloatingSidebar />
    </div>
  );
}
