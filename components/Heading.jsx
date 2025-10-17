"use client";

export function H1({ children, className = "" }) {
  return (
    <h1
      className={`
        font-galindo text-[#835C00]
        text-[28px] leading-[45px] /* mobile base */
        sm:text-[36px] sm:leading-[58px] /* tablet & up */
        ${className}
      `}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }) {
  return (
    <h2
      className={`
        font-galindo text-[#835C00]
        text-[18px] leading-[29px]
        sm:text-[22px] sm:leading-[36px]
        ${className}
      `}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }) {
  return (
    <h3
      className={`
        font-galindo text-[#835C00]
        text-[13px] leading-[21px]
        sm:text-[14px] sm:leading-[23px]
        ${className}
      `}
    >
      {children}
    </h3>
  );
}
