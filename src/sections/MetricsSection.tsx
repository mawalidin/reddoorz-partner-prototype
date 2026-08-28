import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

type Metric = {
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
};

const METRICS: Metric[] = [
  { value: "4.33M", suffix: "+", label: "Active Customers" },
  { value: "2.000", suffix: "+", label: "Partner Properties" },
  { value: "20", suffix: "+", label: "Booking Channels" },
  { prefix: "Up to", value: "10", suffix: "x", label: "Revenue with Experts & Tech." },
  { value: "24/7", label: "Partner Support" },
];

export default function MetricsSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section ref={ref} className="bg-[#f0f0f0] px-4 py-8 md:p-8 lg:px-20 lg:py-20">
      <div className={`mx-auto flex max-w-[900px] flex-col items-center gap-2 text-center lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
        <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-l)] leading-[var(--lineheight-headline-l)] font-semibold text-content-primary md:text-[length:var(--fontsize-headline-m)] md:leading-[var(--lineheight-headline-m)] lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
          Why work with RedDoorz
        </h2>
        <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] text-content-primary lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)]">
          Our size, scale, and volume allows us to build strong relationships with online
          networks, property management, and guests globally to help you better serve
          customers, minimize costs, and drive revenue.
        </p>
      </div>

      <div className={`mx-auto mt-10 grid max-w-[1280px] grid-cols-2 gap-2 rounded-3xl bg-[#ffecf6] p-4 md:mt-6 md:grid-cols-5 md:gap-4 md:p-6 lg:mt-10 lg:gap-x-0 lg:gap-y-6 ${reveal} delay-[150ms] ${visible ? shown : hidden}`}>
        {METRICS.map((metric) => (
          <div key={metric.label} className="flex flex-col items-start gap-2 p-2 lg:gap-3 lg:p-4">
            <div className="flex items-center gap-3 whitespace-nowrap">
              {metric.prefix && (
                <span className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-primary lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                  {metric.prefix}
                </span>
              )}
              <p className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-s)] lg:leading-[var(--lineheight-display-s)]">
                {metric.value}
                {metric.suffix && (
                  <span className="bg-gradient-to-b from-[#fb4042] to-[#ec228a] bg-clip-text text-transparent">
                    {metric.suffix}
                  </span>
                )}
              </p>
            </div>
            <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-primary lg:text-[length:var(--fontsize-body-m)] lg:leading-[var(--lineheight-body-m)]">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
