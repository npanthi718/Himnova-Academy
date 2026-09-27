import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HimnovaLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

export const HimnovaLogo: React.FC<HimnovaLogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
  href = '/',
}) => {
  const sizeMap = {
    sm: { img: 32, title: 'text-base', sub: 'text-[8px]' },
    md: { img: 40, title: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    lg: { img: 48, title: 'text-2xl', sub: 'text-[10px]' },
    xl: { img: 60, title: 'text-3xl', sub: 'text-[11px]' },
  };

  const config = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 group shrink-0 ${className}`}>
      <div
        className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(0,217,255,0.45)]"
        style={{ width: config.img, height: config.img }}
      >
        <Image
          src="/logos/Circle Ico.png"
          alt="Himnova Academy Circle Logo"
          fill
          sizes="64px"
          className="object-contain rounded-full"
          priority
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold font-display tracking-tight text-white leading-none group-hover:text-brand-cyan transition-colors ${config.title}`}>
            HIMNOVA
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gradient-to-r from-brand-cyan/20 to-blue-500/20 border border-brand-cyan/40 text-brand-cyan tracking-wider uppercase">
            ACADEMY
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-extrabold tracking-widest text-brand-cyan uppercase mt-0.5 ${config.sub}`}>
            TECHNOLOGIES PVT. LTD.
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="focus:outline-none select-none">
      {content}
    </Link>
  );
};

