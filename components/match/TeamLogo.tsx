"use client";
import { useState } from "react";
import Image from "next/image";

interface TeamLogoProps {
  logoUrl: string | null;
  name: string;
}

export default function TeamLogo({ logoUrl, name }: TeamLogoProps) {
  const [isError, setIsError] = useState(false);
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200/80 bg-white text-[10px] font-bold text-neutral-600">
      {logoUrl && !isError ? (
        <Image
          src={logoUrl}
          alt={name}
          width={28}
          height={28}
          className="h-7 w-7 scale-[1.1] object-contain"
          onError={() => setIsError(true)}
        />
      ) : (
        name.substring(0, 2)
      )}
    </div>
  );
}
