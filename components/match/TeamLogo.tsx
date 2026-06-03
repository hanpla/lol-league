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
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-neutral-600 border border-neutral-200/80 overflow-hidden shrink-0">
      {logoUrl && !isError ? (
        <Image
          src={logoUrl}
          alt={name}
          width={28}
          height={28}
          className="w-7 h-7 object-contain scale-[1.1]"
          onError={() => setIsError(true)}
        />
      ) : (
        name.substring(0, 2)
      )}
    </div>
  );
}
