import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { availabilityMarker } from "../../components/AvailabilityNote";
import Button from "../../components/Button";
import iconCheck from "../../assets/solutions/icon-check.svg";
import iconShieldTick from "../../assets/solutions/icon-shield-tick.svg";
import thumbnailDemandMarketing from "../../assets/solutions/thumbnail-demand-marketing.png";
import thumbnailOperations from "../../assets/solutions/thumbnail-operations.png";

const NAV_ITEMS = ["01 Demand & Marketing", "02 Technology & Pricing", "03 Operations & Support"];

const TECH_FEATURES: { title: string; body: string; checks?: string[] }[] = [
  {
    title: "Revenue Management System",
    body: "RedFox dynamic pricing reads demand and occupancy to set the best rate, every day, automatically.",
  },
  {
    title: "Property Management System",
    body: "RedPartners runs front-desk operations — check-in/out, guest details, availability and housekeeping — on one screen.",
    checks: [
      "Real-time occupancy & revenue. See what's open, booked, and earned.",
      "RedCM Channel Manager. One inventory, live across every channel. No overbooking.",
      "Automated billing & payouts. Monthly settlements straight to your bank.",
    ],
  },
  {
    title: "Channel Manager",
    body: "RedCM keeps one inventory live across 20+ channels in real time — no manual updates, no overbooking.",
  },
];

export default function SolutionsList({ visible }: { visible: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Progress across the whole card list, from the moment it meets the sticky
  // nav to the moment its bottom edge clears the viewport under that nav.
  const updateProgress = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const headerHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
    const stickyOffset = headerHeight + (navRef.current?.offsetHeight ?? 0);
    const rect = list.getBoundingClientRect();
    const scrollableDistance = rect.height - (window.innerHeight - stickyOffset);
    const raw = scrollableDistance > 0 ? (stickyOffset - rect.top) / scrollableDistance : 0;
    setProgress(Math.min(1, Math.max(0, raw)));
  }, []);

  useLenis(updateProgress);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
  }, [updateProgress]);

  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      <nav
        ref={navRef}
        aria-label="Solutions sections"
        className={`sticky top-[var(--header-height)] z-10 flex flex-col bg-[#faf9f6] lg:top-24 lg:w-[216px] lg:shrink-0 lg:bg-transparent ${reveal} delay-[150ms] ${visible ? shown : hidden}`}
      >
        <div className="flex gap-6 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
          {NAV_ITEMS.map((label, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={label}
                className="flex shrink-0 items-center gap-4 py-3 lg:gap-3 lg:py-6"
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`size-2 shrink-0 rounded-sm bg-error transition-opacity lg:bg-brand-red ${isActive ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
                <p
                  className={`font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] whitespace-nowrap text-content-primary transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
        <div className="h-1 w-full shrink-0 overflow-hidden rounded-full bg-border-opaque lg:hidden">
          <div
            className="h-full rounded-full bg-content-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </nav>

      <div ref={listRef} className="flex flex-1 flex-col gap-4 lg:gap-10">
        <article
          ref={(el) => {
            cardRefs.current[0] = el;
          }}
          className={`overflow-hidden rounded-2xl bg-[#dae9ff] ${reveal} delay-[300ms] ${visible ? shown : hidden}`}
        >
          <div className="flex flex-col items-start gap-6 p-4 md:p-6 lg:flex-row">
            <div className="flex w-full flex-1 flex-col gap-2 text-[#003d99] lg:gap-4">
              <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                Demand & Marketing{availabilityMarker("philippines")}
              </h3>
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                We list you across 20+ channels, run brand and OTA campaigns, and bring
                corporate & reseller bookings to your door — at zero upfront cost.
              </p>
            </div>
            <Button
              variant="plain"
              size="lg"
              className="shrink-0 max-md:leading-6 md:leading-[normal] !px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!px-5 lg:!py-4"
            >
              Learn More
            </Button>
          </div>
          <img
            src={thumbnailDemandMarketing}
            alt="Team members reviewing marketing materials together outside an office"
            className="aspect-[970/329.5] w-full object-cover lg:aspect-auto lg:h-[330px]"
          />
        </article>

        <article
          ref={(el) => {
            cardRefs.current[1] = el;
          }}
          className={`rounded-2xl bg-error p-6 ${reveal} delay-[450ms] ${visible ? shown : hidden}`}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex flex-col gap-4 lg:flex-1 lg:gap-12">
              <img src={iconShieldTick} alt="" className="size-11" />
              <div className="flex flex-col gap-2 text-white lg:gap-4">
                <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                  <span className="md:hidden">ALL-IN-ONE INTEGRATED SYSTEM</span>
                  <span className="hidden md:inline">TECHNOLOGY & PRICING</span>
                </p>
                <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                  The power of AI with the industrial-grade platform your business demands
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-white lg:w-[413px] lg:shrink-0 lg:gap-12">
              {TECH_FEATURES.map((feature) => (
                <div key={feature.title} className="flex flex-col gap-2 lg:gap-4">
                  <h4 className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                    {feature.title}
                  </h4>
                  <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                    {feature.body}
                  </p>
                  {feature.checks && (
                    <ul className="flex flex-col gap-2">
                      {feature.checks.map((check) => (
                        <li key={check} className="flex items-start gap-2">
                          <img src={iconCheck} alt="" className="size-4 shrink-0 lg:size-6" />
                          <span className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                            {check}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article
          ref={(el) => {
            cardRefs.current[2] = el;
          }}
          className={`overflow-hidden rounded-2xl bg-[#fdf0ce] ${reveal} delay-[600ms] ${visible ? shown : hidden}`}
        >
          <img
            src={thumbnailOperations}
            alt="Support agents assisting guests at computer workstations"
            className="aspect-[970/329.5] w-full object-cover lg:aspect-auto lg:h-[330px]"
          />
          <div className="flex flex-col items-start gap-6 p-4 md:p-6 lg:flex-row">
            <div className="flex w-full flex-1 flex-col gap-2 text-[#5a2c04] lg:gap-4">
              <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                Operations & Support{availabilityMarker("philippines")}
              </h3>
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                Standardized housekeeping, staff training, and 24/7 guest support keep
                reviews high — while your payout settles to your bank every month.
              </p>
            </div>
            <Button
              variant="plain"
              size="lg"
              className="shrink-0 max-md:leading-6 md:leading-[normal] !px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!px-5 lg:!py-4"
            >
              Learn More
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
