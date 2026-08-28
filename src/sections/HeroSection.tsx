import Button from "../components/Button";
import heroImage from "../assets/hero/hero-image-01.png";
import heroImageTablet from "../assets/hero/hero-image-tablet.png";

const CANVAS_W = 1440;
const CANVAS_H = 537;
const TABLET_IMAGE_RATIO = "2880 / 1074";

export default function HeroSection() {
  return (
    <section id="top" className="flex flex-col justify-center bg-[#faf9f6] lg:min-h-dvh">
      <div className="flex flex-col items-center gap-6 px-4 pt-[calc(var(--header-height)+32px)] pb-8 text-center transition-[translate,opacity] duration-[1000ms] delay-[100ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-[20%] starting:opacity-0 md:px-8 lg:pb-12 lg:px-20">
        <h1 className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xxl)] leading-[var(--lineheight-headline-xxl)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]">
          Unlock Full Value of Your Property
        </h1>
        <p className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-light text-[#524f4d] lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)]">
          One technology-driven platform handles your bookings, pricing, marketing and
          operations, so you earn more from every room with less work.
        </p>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4 lg:gap-6">
          <Button
            variant="outline"
            className="!px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!h-[54px] lg:!w-[225px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
          >
            Start Free Consultation
          </Button>
          <Button
            variant="primary"
            className="!px-[12px] !py-[9px] !text-[length:var(--fontsize-label-m)] md:!px-4 md:!py-3 md:!text-[length:var(--fontsize-label-l)] lg:!h-[54px] lg:!w-[200px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
          >
            Become A Partner
          </Button>
        </div>
      </div>

      {/* Mobile + tablet share the same simplified, flattened image (no phone
       * mockup); only desktop uses the wider composite with the app mockup. */}
      <img
        src={heroImageTablet}
        alt="RedDoorz partner dashboard showing revenue analytics and platform benefits including stronger partnerships, better occupancy, and higher revenue"
        className="w-full object-cover transition-[scale,opacity] duration-[900ms] delay-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[0.97] starting:opacity-0 lg:hidden"
        style={{ aspectRatio: TABLET_IMAGE_RATIO }}
      />

      <div
        className="relative mx-auto hidden w-full max-w-[1440px] overflow-hidden transition-[scale,opacity] duration-[900ms] delay-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[0.97] starting:opacity-0 lg:block"
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, maxHeight: "56dvh" }}
      >
        <img
          src={heroImage}
          alt="RedDoorz partner dashboard showing revenue analytics, the mobile app, and platform benefits including stronger partnerships, better occupancy, and higher revenue"
          className="size-full object-contain"
        />
      </div>
    </section>
  );
}
