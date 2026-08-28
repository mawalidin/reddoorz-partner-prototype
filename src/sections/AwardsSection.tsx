import logo1 from "../assets/awards/logo-1.png";
import logo2 from "../assets/awards/logo-2.png";
import logo3 from "../assets/awards/logo-3.png";
import logo4 from "../assets/awards/logo-4.png";
import logo5 from "../assets/awards/logo-5.png";
import logo6 from "../assets/awards/logo-6.png";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const LOGOS = [logo1, logo2, logo3, logo4, logo5, logo6];

export default function AwardsSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section ref={ref} className="bg-[#faf9f6] py-8 lg:py-20">
      <Container>
        <h2 className={`mb-6 font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:mb-10 lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)] ${reveal} ${visible ? shown : hidden}`}>
          Awards & Recognition
        </h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {LOGOS.map((logo, index) => (
            <div
              key={index}
              className={`flex h-[100px] w-[150px] shrink-0 snap-start items-center justify-center rounded-2xl bg-[#f0f0f0] p-2 lg:h-[120px] lg:w-auto lg:shrink ${reveal} ${visible ? shown : hidden}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <img src={logo} alt="" className="max-h-full max-w-[100px] object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
