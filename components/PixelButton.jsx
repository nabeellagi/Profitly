"use client";
import { useRef } from "react";
import { gsap } from "gsap";

export function PixelButton({ children, className = "", onClick }) {
  const buttonRef = useRef(null);

  const handleClick = () => {
    const el = buttonRef.current;

    // Play GSAP animation
    gsap.fromTo(
      el,
      { scale: 0.95, rotate: -3 },
      {
        scale: 1,
        rotate: 3,
        duration: 0.25,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Call the actual onClick action AFTER animation finishes
          if (onClick) onClick();
        },
      }
    );
  };

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const textLength = String(children).length;
  const sizeClass =
    textLength < 6
      ? "text-[clamp(18px,1.8vw,24px)]"
      : textLength < 12
      ? "text-[clamp(16px,1.6vw,20px)]"
      : "text-[clamp(14px,1.4vw,18px)]";

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pixel-frame font-galindo ${sizeClass} ${className} text-[#FFECAD] select-none active:brightness-90 transition-transform duration-150`}
    >
      {children}
    </button>
  );
}
