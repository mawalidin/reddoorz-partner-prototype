import AvailabilityDisclaimer from "../components/AvailabilityNote";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import PlatformGrid from "./solutions/PlatformGrid";
import SolutionsList from "./solutions/SolutionsList";

export default function SolutionsSection() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>({ threshold: 0.2 });
  const { ref: platformRef, visible: platformVisible } = useRevealOnScroll<HTMLDivElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section id="solutions" className="bg-[#faf9f6] py-8 lg:py-20">
      <Container ref={ref} className="flex flex-col gap-6 lg:gap-10">
        <div className={`flex flex-col gap-2 lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
          <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
            ALL-IN-ONE INTEGRATED PLATFORM
          </p>
          <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-l)] leading-[var(--lineheight-headline-l)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
            Manage efficiently in minutes, not months
          </h2>
        </div>
        <SolutionsList visible={visible} />
        <AvailabilityDisclaimer
          notes={["philippines"]}
          className={`${reveal} delay-[300ms] ${visible ? shown : hidden}`}
        />
      </Container>

      <Container ref={platformRef} className="mt-16 lg:mt-20">
        <PlatformGrid visible={platformVisible} />
      </Container>
    </section>
  );
}
