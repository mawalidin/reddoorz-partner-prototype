import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import before from "../assets/transformation/before.png";
import after from "../assets/transformation/after.png";
import iconChevronLeft from "../assets/brands/icon-chevron-left.svg";
import iconChevronRight from "../assets/brands/icon-chevron-right.svg";

const CAPTION = "SANS Hotel Jakarta — a former RedDoorz partner, fully rebranded into a SANS.";

// Figma shows three identical slides (same content as the Storytelling carousel
// note in IMPLEMENTATION_NOTES.md), so the slider repeats one mock transformation.
const SLIDES = [1, 2, 3];

const Accent = ({ children }: { children: ReactNode }) => (
  <span className="bg-gradient-to-b from-[#fb4042] to-[#ec228a] bg-clip-text text-transparent">
    {children}
  </span>
);

const STATS: { label: string; value: ReactNode }[] = [
  {
    label: "OCCUPANCY",
    value: (
      <>
        38<Accent>%</Accent> → 76<Accent>%</Accent>
      </>
    ),
  },
  {
    label: "AVG. ROOM NIGHT",
    value: (
      <>
        <Accent>+</Accent>32%
      </>
    ),
  },
  {
    label: "TIME TO REOPEN",
    value: (
      <>
        12 weeks
      </>
    ),
  },
];

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const rise = `transition-[translate,opacity] duration-[900ms] ${ease}`;

const navButton =
  "absolute top-1/2 z-10 hidden size-[45px] -translate-y-1/2 items-center justify-center rounded-full bg-background-primary shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] transition-[opacity,scale] duration-200 ease-out hover:scale-105 active:scale-95 md:flex lg:size-14";

export default function TransformationSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    // Let the compare handle be dragged without also dragging the carousel.
    watchDrag: (_api, event) => !(event.target as HTMLElement).closest("[data-compare-handle]"),
    breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";
  const state = visible ? shown : hidden;

  return (
    <section id="transformation" ref={ref} className="overflow-x-clip bg-[#faf9f6]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:p-8 lg:gap-10 lg:p-20">
        <div className={`flex flex-col gap-2 lg:gap-4 ${rise} ${state}`}>
          <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
            REAL TRANSFORMATION
          </p>
          <h2 className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-l)] leading-[var(--lineheight-headline-l)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-s)]">
            Turn a tired property into a thriving asset
          </h2>
        </div>

        <div
          className={`relative transition-[scale,opacity] duration-[900ms] ${ease} delay-[150ms] ${visible ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"}`}
        >
          {/* No overflow clipping here: slides run past the content column and are clipped at the page edge by the section. */}
          <div ref={emblaRef}>
            <div className="flex touch-pan-y touch-pinch-zoom gap-2 md:gap-4">
              {SLIDES.map((slide, index) => (
                <figure
                  key={slide}
                  className="m-0 flex shrink-0 basis-[calc(100%-38px)] flex-col items-center gap-2 md:basis-[calc(100%-40px)] lg:basis-[calc(100%-26px)] lg:gap-4"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${SLIDES.length}`}
                >
                  <BeforeAfterSlider
                    before={before}
                    after={after}
                    alt="Hotel lounge before and after the SANS Hotel rebrand"
                    className="h-[284px] w-full rounded-2xl md:h-[364px] md:rounded-3xl lg:h-[620px]"
                  />
                  <figcaption className="max-w-[288px] text-center font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[16px] text-content-tertiary md:max-w-[494px] md:text-[length:var(--fontsize-body-m)] md:leading-[20px] lg:max-w-none">
                    {CAPTION}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous transformation"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className={`${navButton} left-0 ${canPrev ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img src={iconChevronLeft} alt="" className="size-5 lg:size-6" />
          </button>
          <button
            type="button"
            aria-label="Next transformation"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className={`${navButton} right-0 ${canNext ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img src={iconChevronRight} alt="" className="size-5 lg:size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6 text-content-primary md:flex-row md:items-start lg:gap-10">
          <div className={`hidden min-w-0 flex-1 flex-col gap-2 md:flex lg:gap-4 ${rise} delay-[250ms] ${state}`}>
            <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
              SANS Hotel Jakarta
            </h3>
            <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
              Former RedDoorz partner, a leased operated partnership, fully rebranded into SANS Hotel.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-3 gap-4 md:inline-grid md:shrink-0 md:grid-cols-[repeat(3,fit-content(100%))] lg:gap-6">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-2 lg:gap-3 ${rise} ${state}`}
                style={{ transitionDelay: `${350 + index * 120}ms` }}
              >
                <dt className="font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[16px] font-light md:text-[length:var(--fontsize-label-m)] lg:text-[length:var(--fontsize-body-m)] lg:leading-[20px]">
                  {stat.label}
                </dt>
                <dd className="m-0 font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[24px] font-semibold whitespace-nowrap lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[32px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
