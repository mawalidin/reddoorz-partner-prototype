import { useLenis } from "lenis/react";
import { useState } from "react";
import chevronDown from "../assets/icons/chevron-down.svg";
import chevronRight from "../assets/icons/icon-chevron-right.svg";
import globeIcon from "../assets/icons/icon-globe.svg";
import logo from "../assets/logo.svg";
import Button from "./Button";

const NAV_LINKS = [
  { label: "Our Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Our Brands", href: "#brands" },
  { label: "Partner Stories", href: "#stories" },
];

const SCROLL_THRESHOLD = 8;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<"EN" | "ID">("EN");

  useLenis(({ scroll }) => {
    setScrolled(scroll > SCROLL_THRESHOLD);
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "bg-[rgba(250,249,246,0.9)] backdrop-blur-[29px]"
            : "bg-transparent"
        }`}
      >
        <div className="flex h-[length:var(--header-height)] items-center justify-between px-4 py-2 transition-[translate,opacity] duration-[1000ms] delay-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] starting:-translate-y-[20%] starting:opacity-0 md:px-8 lg:px-20">
          <div className="flex items-center gap-6 lg:gap-12">
            <a href="#top" className="shrink-0">
              <img src={logo} alt="RedDoorz" className="h-11 w-auto" />
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey whitespace-nowrap hover:bg-background-alternative"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey hover:bg-background-alternative"
              aria-label="Select language"
            >
              EN
              <img src={chevronDown} alt="" className="size-4" />
            </button>
            <Button variant="primary" size="sm">Get Started</Button>
          </div>

          <button
            type="button"
            className="flex items-center justify-center rounded-full p-2 text-brand-grey hover:bg-background-alternative lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuOpen ? "opacity-100" : "opacity-0"}`}
              />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="mega-menu-scrim fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-black/30 lg:hidden"
          onClick={closeMenu}
        >
          <nav
            id="mobile-nav"
            aria-label="Primary"
            className="mega-menu-panel flex w-full flex-col rounded-b-3xl bg-background-primary"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-t border-border-opaque" />
            <div className="flex items-center gap-4 px-4 md:px-8">
              <img src={globeIcon} alt="" className="size-4" />
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`rounded-full py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold ${language === "EN" ? "text-brand-red" : "text-brand-grey"}`}
              >
                EN
              </button>
              <div className="h-4 w-px bg-border-opaque" />
              <button
                type="button"
                onClick={() => setLanguage("ID")}
                className={`rounded-full py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold ${language === "ID" ? "text-brand-red" : "text-brand-grey"}`}
              >
                ID
              </button>
            </div>
            <div className="border-t border-border-opaque" />
            <div className="flex flex-col gap-4 px-4 pt-4 pb-6 md:px-8 md:py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-2 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey"
                >
                  {link.label}
                  <img src={chevronRight} alt="" className="size-4" />
                </a>
              ))}
              <div className="flex flex-col gap-2 md:flex-row">
                <Button variant="outline" size="sm" className="w-full md:flex-1">
                  Start Free Consultation
                </Button>
                <Button variant="primary" size="sm" className="w-full md:flex-1">
                  Become A Partner
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
