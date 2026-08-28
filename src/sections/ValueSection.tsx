import Button from "../components/Button";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const VALUES = [
  {
    title: "Better Occupancy.",
    body: "Fill more rooms, more nights — driven by 20+ booking channels working for you around the clock.",
  },
  {
    title: "Higher Revenue.",
    body: "AI-powered pricing sets the right rate every day, so you earn more per room — without lifting a finger.",
  },
  {
    title: "Stronger Partnerships.",
    body: "Backed by a dedicated team, standardized ops, and a trusted brand guests already know.",
  },
];

export default function ValueSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section ref={ref} className="bg-[#faf9f6] py-8 md:py-8 lg:py-20">
      <Container className="flex flex-col gap-6 md:gap-6 lg:gap-10">
        <div className={`flex flex-col gap-4 ${reveal} ${visible ? shown : hidden}`}>
          <div className="flex flex-col gap-2">
            <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
              REASONS TO PARTNER
            </p>
            <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
              What to expect
            </h2>
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <Button
              variant="outline"
              className="w-auto !px-3 !py-[9px] !text-[length:var(--fontsize-label-m)] lg:!w-[225px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
            >
              Start Free Consultation
            </Button>
            <Button
              variant="primary"
              className="w-auto !px-3 !py-[9px] !text-[length:var(--fontsize-label-m)] lg:!w-[200px] lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-xl)]"
            >
              Become A Partner
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {VALUES.map((value, index) => (
            <div
              key={value.title}
              className={`flex flex-col gap-2 rounded-2xl bg-brand-red p-6 text-white lg:flex-row lg:items-start lg:justify-between lg:rounded-3xl ${reveal} ${visible ? shown : hidden}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <p className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium whitespace-nowrap lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                {value.title}
              </p>
              <p className="font-['Rubik'] max-w-[500px] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-normal lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)] lg:font-semibold">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
