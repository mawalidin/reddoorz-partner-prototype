import { useState } from "react";
import Button from "../components/Button";
import SegmentedSwitch from "../components/SegmentedSwitch";
import slide1 from "../assets/hero/carousel-1.jpg";
import slide2 from "../assets/hero/carousel-2.jpg";
import slide3 from "../assets/hero/carousel-3.jpg";
import slide4 from "../assets/hero/carousel-4.png";
import slide5 from "../assets/hero/carousel-5.jpg";
import slide6 from "../assets/hero/carousel-6.jpg";
import slide7 from "../assets/hero/carousel-7.jpg";

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
const ACTIVE_SLIDE = 3;

const PROPERTY_TYPES = [
  { value: "franchised", label: "Franchised" },
  { value: "leased", label: "Leased" },
] as const;
type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

export default function HeroSection() {
  const [propertyType, setPropertyType] = useState<PropertyType>("franchised");

  return (
    <section id="top" className="flex flex-col justify-center overflow-hidden bg-[#faf9f6] lg:min-h-dvh">
      <div className="flex flex-col items-center gap-6 px-4 pt-[calc(var(--header-height)+32px)] pb-8 text-center transition-[translate,opacity] duration-[1000ms] delay-[100ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-[20%] starting:opacity-0 md:px-8 lg:pb-12 lg:px-20">
        <SegmentedSwitch
          label="Property type"
          options={PROPERTY_TYPES}
          value={propertyType}
          onChange={setPropertyType}
          className="lg:mb-2"
        />
        <h1 className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xxl)] leading-[var(--lineheight-headline-xxl)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]">
          Unlock Full Value of Your Property
        </h1>
        <p className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-light text-[#524f4d] lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)]">
          One technology-driven platform handles your bookings, pricing, marketing and
          operations, so you earn more from every room with less work.
        </p>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4 lg:gap-6">
          <Button
            variant="plain"
            className="max-md:leading-6 md:leading-[normal] !px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!h-[54px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
          >
            Start Consultation
          </Button>
          <Button
            variant="primary"
            className="max-md:leading-6 md:leading-[normal] !px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!h-[54px] lg:!w-[200px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
          >
            Become A Partner
          </Button>
        </div>
      </div>

      {/* Figma: 7-up row centered on the 500px active slide (desktop), half size
       * on tablet, and only the active slide on mobile. */}
      <div
        className="flex items-center justify-center gap-2 transition-[scale,opacity] duration-[900ms] delay-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[0.97] starting:opacity-0 lg:gap-6"
        role="img"
        aria-label="Hotel partner using a tablet, with platform benefits: higher revenue, better occupancy, and stronger partnerships"
      >
        {slides.map((src, i) =>
          i === ACTIVE_SLIDE ? (
            <img
              key={src}
              src={src}
              alt=""
              className="aspect-square w-full shrink-0 object-cover md:size-[250px] md:rounded-[12px] lg:size-[500px] lg:rounded-[24px]"
            />
          ) : (
            <div
              key={src}
              aria-hidden
              className="relative hidden h-[250px] w-[125px] shrink-0 overflow-hidden rounded-[12px] md:block lg:h-[500px] lg:w-[250px] lg:rounded-[24px]"
            >
              <img src={src} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
