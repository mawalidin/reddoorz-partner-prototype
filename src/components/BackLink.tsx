import type { ReactNode } from "react";
import ArrowLeftIcon from "./ArrowLeftIcon";
import { navigateOnClick } from "../router";

// Grey pill "Back" button used at the top of the register screens.
export default function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      onClick={navigateOnClick(href)}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-background-alternative px-3 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] leading-6 font-semibold text-brand-grey transition-[background-color,scale] duration-150 ease-out hover:bg-border-opaque active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red lg:gap-3 lg:px-5 lg:py-4 lg:text-[length:var(--fontsize-label-l)] lg:leading-[normal]"
    >
      <ArrowLeftIcon />
      {children}
    </a>
  );
}
