import Button from "../components/Button";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import iconImageUserPlus from "../assets/value/icon-image-user-plus.svg";
import iconLineChartUp from "../assets/value/icon-line-chart-up.svg";
import iconHandshake from "../assets/value/icon-handshake.svg";

const VALUES = [
  {
    icon: iconImageUserPlus,
    title: "Better Occupancy.",
    body: "Fill more rooms, more nights — driven by 20+ booking channels working for you around the clock.",
  },
  {
    icon: iconLineChartUp,
    title: "Higher Revenue.",
    body: "AI-powered pricing sets the right rate every day, so you earn more per room — without lifting a finger.",
  },
  {
    icon: iconHandshake,
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

        <div className="flex flex-col gap-2 md:gap-4">
          {VALUES.map((value, index) => (
            <div
              key={value.title}
              className={`flex flex-col gap-4 rounded-2xl bg-brand-red p-6 text-white md:flex-row md:items-start md:gap-6 lg:min-h-[150px] lg:justify-between lg:rounded-3xl ${reveal} ${visible ? shown : hidden}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#c81012] p-3 lg:size-16 lg:rounded-md lg:p-4">
                <img src={value.icon} alt="" className="size-5 lg:size-8" />
              </span>
              <div className="flex flex-col gap-2 md:min-w-0 md:flex-1 lg:flex-none lg:gap-6">
                <p className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)] lg:whitespace-nowrap">
                  {value.title}
                </p>
                <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-normal lg:w-[500px] lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)] lg:font-semibold">
                  {value.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
