"use client";

export default function P({ children, className = "", size = "base" }) {
  const sizeClasses = {
    sm: "text-[14px] sm:text-[16px] ", // good for notes or captions
    base: "text-[18px] sm:text-[20px] ", // readable main body
    lg: "text-[22px] sm:text-[24px]", // emphasis paragraphs or callouts
  };

  return (
    <p
      className={`
        font-beiruti text-[#835C00] text-justify paragraph
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </p>
  );
}
