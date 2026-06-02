"use client";

import { useState } from "react";
import Image from "next/image";

export default function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  const [isError, setIsError] = useState(false);

  return (
    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300 border border-neutral-700 overflow-hidden shrink-0">
      {logoUrl && !isError ? (
        <Image
          src={logoUrl}
          alt={name}
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
          onError={() => setIsError(true)}
        />
      ) : (
        name.substring(0, 2)
      )}
    </div>
  );
}
