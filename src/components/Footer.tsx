import chevronDown from "../assets/icons/chevron-down.svg";
import footerIllustration from "../assets/footer/illustration.png";
import logo from "../assets/logo.svg";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Our Brands", href: "#brands" },
  { label: "Partner Stories", href: "#partner-stories" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M13.5 22v-8.5h2.85l.43-3.32H13.5V8.05c0-.96.27-1.62 1.65-1.62h1.76V3.14C16.6 3.1 15.6 3 14.42 3c-2.44 0-4.11 1.49-4.11 4.22v2.96H7.44v3.32h2.87V22h3.19Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 1.8a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM16.9 6.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 4.6c2.3 0 2.58.01 3.49.05.9.04 1.5.18 2.03.4.55.21.98.5 1.42.94.44.44.73.87.94 1.42.21.53.36 1.13.4 2.03.04.91.05 1.19.05 3.49s-.01 2.58-.05 3.49c-.04.9-.19 1.5-.4 2.03a3.9 3.9 0 0 1-.94 1.42c-.44.44-.87.73-1.42.94-.53.21-1.13.36-2.03.4-.91.04-1.19.05-3.49.05s-2.58-.01-3.49-.05c-.9-.04-1.5-.19-2.03-.4a3.9 3.9 0 0 1-1.42-.94 3.9 3.9 0 0 1-.94-1.42c-.21-.53-.36-1.13-.4-2.03C3.61 14.58 3.6 14.3 3.6 12s.01-2.58.05-3.49c.04-.9.19-1.5.4-2.03.21-.55.5-.98.94-1.42.44-.44.87-.73 1.42-.94.53-.21 1.13-.36 2.03-.4C9.42 3.61 9.7 3.6 12 3.6Z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    path: "M16.5 3h-2.7v12.3a2.4 2.4 0 1 1-1.7-2.3v-2.8a5.2 5.2 0 1 0 4.4 5.1V9.2c.9.6 2 1 3.1 1V7.5c-1.7 0-3.1-1.3-3.1-3V3Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M21 8.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.3 5 12 5 12 5s-3.3 0-6.1.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.8 10 2.8 11.7v1.6c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 6 .2 6 .2s3.3 0 6.1-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1.6c0-1.7-.2-3.5-.2-3.5ZM10 14.7v-5l4.5 2.5-4.5 2.5Z",
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#f0f0f0]">
      <div className="flex flex-col gap-12 px-4 py-16 md:gap-6 lg:gap-12 lg:px-20">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <img src={logo} alt="RedDoorz" className="h-11 w-auto self-start" />

          <div className="flex flex-col gap-6 md:flex-row lg:gap-12">
            <div className="flex flex-col gap-0">
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] font-normal text-content-tertiary">
                NAVIGATION
              </p>
              <nav aria-label="Footer" className="flex flex-col gap-0">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-0">
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] font-normal text-content-tertiary">
                WHO WE ARE
              </p>
              <p className="max-w-[150px] py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey">
                A technology-driven hotel management & booking platform
              </p>
            </div>

            <div className="flex flex-col gap-0">
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] font-normal text-content-tertiary">
                SOCIALS
              </p>
              <div className="flex gap-0">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full text-content-primary hover:bg-background-primary"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] font-light text-content-primary">
            © 2026 RedDoorz. All rights reserved.
          </p>
          <button
            type="button"
            className="flex items-center gap-2 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey"
            aria-label="Select language"
          >
            EN
            <img src={chevronDown} alt="" className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-[1440/516] w-full overflow-hidden" aria-hidden="true">
        <img src={footerIllustration} alt="" className="size-full object-cover" />
      </div>
    </footer>
  );
}
