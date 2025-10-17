"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function MascotHelper({
  imgSrc = "/oc/first.png",
  message = "Hello World",
  imgSize = 180,
  className = "",
  tooltipClass = "",
}) {
  const [open, setOpen] = useState(false);

  // auto-close after 6s
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // click outside to close
//   useEffect(() => {
//     const closeTooltip = (e) => {
//       if (!e.target.closest(".mascot-helper")) setOpen(false);
//     };
//     if (open) document.addEventListener("click", closeTooltip);
//     return () => document.removeEventListener("click", closeTooltip);
//   }, [open]);

  return (
    <div className={`mascot-helper flex flex-col items-center ${className}`}>
      <Tooltip.Provider>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger asChild>
            <Image
              src={imgSrc}
              alt="Mascot Helper"
              width={imgSize}
              height={imgSize}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setOpen((prev) => !prev)}
            />
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="center"
              className={`
                bg-[#fff8e7] text-[#835C00]
                px-4 py-2 rounded-lg border border-[#835C00]/40 shadow-lg
                font-semibold max-w-[60vw] text-center
                overflow-y-auto 
                animate-fade-in ${tooltipClass}
              `}
            >
              {message}
              <Tooltip.Arrow className="fill-[#fff8e7]" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
