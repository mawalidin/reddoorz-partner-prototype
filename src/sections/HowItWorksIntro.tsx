import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const STEPS = [
  {
    number: 1,
    title: "Submit Your Property",
    body: "Tell us about your rooms in 2 minutes.",
  },
  {
    number: 2,
    title: "Free Assessment",
    body: "We propose the right brand, pricing & revenue plan.",
  },
  {
    number: 3,
    title: "Onboard & Brand",
    body: "We set up the tech, train your team, and launch.",
  },
  {
    number: 4,
    title: "Go Live & Grow",
    body: "Bookings flow across every channel — tracked from your app.",
  },
];

export default function HowItWorksIntro() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section id="how-it-works" className="bg-[#faf9f6] py-8 lg:py-20">
      <Container ref={ref} className="flex flex-col gap-6 lg:gap-10">
        <div className={`flex flex-col gap-2 lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
          <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
            HOW IT WORKS
          </p>
          <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
            4 steps to fully booked
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:gap-4">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`flex w-[300px] shrink-0 snap-start flex-col gap-6 rounded-2xl bg-[#f0f0f0] p-4 md:h-[172px] md:gap-4 md:p-6 lg:h-auto lg:w-[320px] lg:gap-6 ${reveal} ${visible ? shown : hidden}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-content-primary font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-medium text-content-primary lg:size-12 lg:text-[length:var(--fontsize-headline-m)] lg:leading-normal">
                {step.number}
              </span>
              <div className="flex flex-col gap-2 md:gap-4 lg:gap-2">
                <p className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium text-content-primary">
                  {step.title}
                </p>
                <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-primary lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
