import lavana1 from "../assets/brands/lavana-1.png";
import lavana2 from "../assets/brands/lavana-2.png";
import lavana3 from "../assets/brands/lavana-3.png";
import reddoorz1 from "../assets/brands/reddoorz-1.png";
import reddoorz2 from "../assets/brands/reddoorz-2.png";
import reddoorz3 from "../assets/brands/reddoorz-3.png";
import sans1 from "../assets/brands/sans-1.png";
import sans2 from "../assets/brands/sans-2.png";
import sans3 from "../assets/brands/sans-3.png";
import sunerra1 from "../assets/brands/sunerra-1.png";
import sunerra2 from "../assets/brands/sunerra-2.png";
import sunerra3 from "../assets/brands/sunerra-3.png";
import sunerra4 from "../assets/brands/sunerra-4.png";
import sunerra5 from "../assets/brands/sunerra-5.png";
import uv1 from "../assets/brands/uv-1.png";
import uv2 from "../assets/brands/uv-2.png";
import uv3 from "../assets/brands/uv-3.png";
import Container from "../components/Container";
import BrandCarousel from "./brands/BrandCarousel";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const BRANDS = [
  {
    tag: "BUDGET",
    name: "RedDoorz",
    description: "Affordable stays without compromising on comfort.",
    images: [reddoorz1, reddoorz2, reddoorz3],
  },
  {
    tag: "LIFESTYLE",
    name: "SANS Hotels",
    description: "Vibrant, fun, stylish rooms for young travelers.",
    images: [sans1, sans2, sans3],
  },
  {
    tag: "UPSCALE URBAN",
    name: "Urbanview Hotels",
    description: "A calming urban oasis to recharge in the moment.",
    images: [uv1, uv2, uv3],
  },
  {
    tag: "PREMIUM",
    name: "Sunerra Hotels",
    description: "Premium local hospitality, world-class service.",
    images: [sunerra1, sunerra2, sunerra3, sunerra4, sunerra5],
  },
  {
    tag: "VILLAS & RESORTS",
    name: "The Lavana",
    description: "Curated villas and unique stays.",
    images: [lavana1, lavana2, lavana3],
  },
];

export default function BrandSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section id="brands" ref={ref} className="bg-[#faf9f6] py-8 lg:py-20">
      <Container>
        <div className={`mb-6 flex flex-col gap-2 lg:mb-10 lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
          <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
            OUR BRANDS
          </p>
          <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
            A brand that fits your property
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-10 lg:overflow-visible lg:pb-0">
          {BRANDS.map((brand, index) => (
            <div
              key={brand.name}
              className={`flex w-[300px] shrink-0 snap-start flex-col gap-3 lg:w-auto lg:shrink lg:gap-6 ${reveal} ${visible ? shown : hidden}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <BrandCarousel images={brand.images} alt={brand.name} />
              <div className="flex flex-col gap-2 lg:gap-4">
                <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-medium text-brand-red lg:text-[length:var(--fontsize-body-xm)] lg:leading-[var(--lineheight-body-xm)]">
                  {brand.tag}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium text-content-primary lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)]">
                    {brand.name}
                  </p>
                  <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-secondary lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                    {brand.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
