import type { CSSProperties } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import Button from "../components/Button";
import badgeBooked from "../assets/storytelling/badge-booked.png";
import badgeReport from "../assets/storytelling/badge-report.png";
import photo from "../assets/storytelling/photo.png";

// Figma stacks these vertically at roughly the same 0% / 40% / 80% rhythm on
// both breakpoints, but the horizontal stagger differs between tablet (704px
// canvas) and desktop (1440px canvas), so each gets its own left offset.
const QUOTES = [
  {
    text: "“How do I keep my rooms full without running myself into the ground?”",
    mdLeftPct: 21,
    lgLeftPct: 27,
    topPct: 0,
  },
  {
    text: "“How do I get more people to know our property?",
    mdLeftPct: 79,
    lgLeftPct: 62,
    topPct: 40,
  },
  {
    text: '"What are some ways to simplify my property management?"',
    mdLeftPct: 50,
    lgLeftPct: 44,
    topPct: 80,
  },
];

const PHOTO_CANVAS = 450;
const photoBox = (left: number, top: number, width: number, height: number): CSSProperties => ({
  left: `${(left / PHOTO_CANVAS) * 100}%`,
  top: `${(top / PHOTO_CANVAS) * 100}%`,
  width: `${(width / PHOTO_CANVAS) * 100}%`,
  height: `${(height / PHOTO_CANVAS) * 100}%`,
});

export default function StorytellingSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";
  const fadeReveal = "transition-opacity duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";

  return (
    <section id="stories" ref={ref} className="bg-[#f0f0f0]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-8 md:relative md:h-[340px] md:gap-0 md:px-8 md:py-8 lg:h-[420px] lg:px-20 lg:py-20">
        {QUOTES.map((quote, index) => (
          <p
            key={quote.text}
            className={`mx-auto w-[250px] font-['Caveat'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] text-[#524f4d] text-center md:absolute md:mx-0 md:w-auto md:max-w-[300px] md:text-[length:var(--fontsize-headline-xl)] md:leading-[var(--lineheight-headline-xl)] md:left-[var(--q-left-md)] md:[transform:translateX(-50%)] lg:max-w-[500px] lg:text-[length:var(--fontsize-display-s)] lg:leading-[var(--lineheight-display-s)] lg:left-[var(--q-left-lg)] ${reveal} ${visible ? shown : hidden}`}
            style={
              {
                top: `${quote.topPct}%`,
                "--q-left-md": `${quote.mdLeftPct}%`,
                "--q-left-lg": `${quote.lgLeftPct}%`,
                transitionDelay: `${index * 150}ms`,
              } as CSSProperties
            }
          >
            {quote.text}
          </p>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 p-8 md:flex-row md:gap-6 md:px-8 md:py-8 lg:gap-10 lg:px-20 lg:py-20">
        {/* Mobile: plain square photo, no floating badges */}
        <img
          src={photo}
          alt="RedDoorz partner reviewing bookings on his phone"
          className={`size-[250px] rounded-3xl object-cover md:hidden ${fadeReveal} delay-[450ms] ${visible ? "opacity-100" : "opacity-0"}`}
        />

        <div className={`relative hidden aspect-square w-full max-w-[450px] shrink-0 md:block md:max-w-[300px] lg:max-w-[450px] ${fadeReveal} delay-[450ms] ${visible ? "opacity-100" : "opacity-0"}`}>
          <div
            className="absolute overflow-hidden rounded-3xl"
            style={photoBox(84, 14, 281.25, 421.875)}
          >
            <img src={photo} alt="RedDoorz partner reviewing bookings on his phone" className="size-full object-cover" />
          </div>
          <img
            src={badgeBooked}
            alt="100 Booked"
            className="pointer-events-none absolute object-contain"
            style={photoBox(253, 296, 187, 64)}
          />
          <img
            src={badgeReport}
            alt="Report"
            className="pointer-events-none absolute object-contain"
            style={photoBox(10, 62, 120, 52)}
          />
        </div>

        <div className={`flex flex-1 flex-col items-start gap-6 md:gap-6 lg:gap-8 ${reveal} delay-[450ms] ${visible ? shown : hidden}`}>
          <div className="flex flex-col items-start gap-2 md:gap-2 lg:gap-4">
            <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary md:text-[length:var(--fontsize-headline-m)] md:leading-[var(--lineheight-headline-m)] lg:text-[length:var(--fontsize-display-s)] lg:leading-[var(--lineheight-display-s)]">
              A place where you don't have to juggle roles as a marketer, pricing analyst,
              and night-shift manager.
            </h2>
            <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-primary md:text-[length:var(--fontsize-headline-xs)] md:leading-[var(--lineheight-headline-xs)] md:font-light lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)] lg:font-normal">
              We plug your property into one ecosystem — and handle the three things that
              decide whether you make money.
            </p>
          </div>
          <Button
            variant="primary"
            className="!px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
          >
            Our Solutions
          </Button>
        </div>
      </div>
    </section>
  );
}
