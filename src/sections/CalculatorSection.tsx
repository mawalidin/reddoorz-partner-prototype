import { useMemo, useState } from "react";
import iconChevronDown from "../assets/calculator/icon-chevron-down.svg";
import iconThumbsUp from "../assets/calculator/icon-thumbs-up.svg";
import typeBasic from "../assets/calculator/type-basic.svg";
import typePlus from "../assets/calculator/type-plus.svg";
import typePremium from "../assets/calculator/type-premium.svg";
import Button from "../components/Button";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

type HotelType = "Basic" | "Plus" | "Premium";

const HOTEL_TYPES: { type: HotelType; icon: string; occupancy: number; recommendedRate: number }[] = [
  { type: "Basic", icon: typeBasic, occupancy: 55.9, recommendedRate: 200000 },
  { type: "Plus", icon: typePlus, occupancy: 61.5, recommendedRate: 260000 },
  { type: "Premium", icon: typePremium, occupancy: 72.0, recommendedRate: 300000 },
];

const CITIES = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta"];

const formatIDR = (value: number) => Math.round(value).toLocaleString("id-ID");

const formatRange = (mid: number) => {
  const low = mid * 0.85;
  const high = mid * 1.15;
  return `${formatIDR(low)} - ${formatIDR(high)}`;
};

export default function CalculatorSection() {
  const [rooms, setRooms] = useState(20);
  const [city, setCity] = useState("Jakarta");
  const [rate, setRate] = useState(300000);
  const [hotelType, setHotelType] = useState<HotelType>("Premium");
  const [submitted, setSubmitted] = useState(true);

  const benchmark = HOTEL_TYPES.find((h) => h.type === hotelType)!;

  const summary = useMemo(() => {
    const occupancy = benchmark.occupancy;
    const monthlyOrn = Math.round(rooms * 30 * (occupancy / 100));
    const yearlyOrn = Math.round(rooms * 365 * (occupancy / 100));
    const monthlyNbvMid = monthlyOrn * rate;
    const yearlyNbvMid = yearlyOrn * rate;
    const ratio = rate / benchmark.recommendedRate;
    const evaluation = ratio < 0.9 ? "Below Recommendation" : ratio > 1.1 ? "Above Recommendation" : "As Recommended";
    const scalePosition = Math.min(100, Math.max(0, 50 + (ratio - 1) * 100));
    return { occupancy, monthlyOrn, yearlyOrn, monthlyNbvMid, yearlyNbvMid, ratio, evaluation, scalePosition };
  }, [rooms, rate, benchmark]);

  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <section ref={ref} className="bg-[#faf9f6] py-8 md:py-8 lg:py-20">
      <Container className={`mb-6 flex flex-col gap-2 md:mb-6 md:gap-2 lg:mb-10 lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
        <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
          CALCULATE YOUR REVENUE
        </p>
        <h2 className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary sm:text-[length:var(--fontsize-display-s)] sm:leading-[var(--lineheight-display-s)] md:text-[length:var(--fontsize-headline-l)] md:leading-[var(--lineheight-headline-l)] lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
          Find your potential
        </h2>
      </Container>

      <Container>
        <div className={`overflow-hidden rounded-3xl bg-[#f0f0f0] ${reveal} delay-[150ms] ${visible ? shown : hidden}`}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="flex flex-col items-end gap-6 bg-background-primary p-6 md:p-8 lg:p-12"
          >
            <h3 className="w-full font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-m)] md:leading-[var(--lineheight-headline-m)] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
              Fill the form below:
            </h3>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-10">
              <label className="flex flex-col gap-2">
                <span className="font-['Rubik'] text-[length:var(--fontsize-label-m)] font-medium text-content-primary">
                  Total Rooms<span className="text-brand-red">*</span>
                </span>
                <input
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={(event) => setRooms(Number(event.target.value) || 0)}
                  className="rounded-lg border border-border-opaque px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary outline-none focus-visible:border-brand-red"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-['Rubik'] text-[length:var(--fontsize-label-m)] font-medium text-content-primary">
                  City<span className="text-brand-red">*</span>
                </span>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-border-opaque px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary outline-none focus-visible:border-brand-red"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <img
                    src={iconChevronDown}
                    alt=""
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-['Rubik'] text-[length:var(--fontsize-label-m)] font-medium text-content-primary">
                  Room Rate per night<span className="text-brand-red">*</span>
                </span>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value) || 0)}
                  className="rounded-lg border border-border-opaque px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary outline-none focus-visible:border-brand-red"
                />
                <span className="font-['Rubik'] text-[length:var(--fontsize-label-m)] text-content-tertiary">
                  Recommended: Rp. {formatIDR(benchmark.recommendedRate)}
                </span>
              </label>
            </div>

            <div className="flex w-full flex-col gap-2">
              <span className="font-['Rubik'] text-[length:var(--fontsize-label-m)] font-medium text-content-primary">
                Hotel Type<span className="text-brand-red">*</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {HOTEL_TYPES.map((option) => {
                  const isActive = option.type === hotelType;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setHotelType(option.type)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-body-xm)] text-content-primary ${
                        isActive ? "border-brand-red bg-light-accent-bg" : "border-border-opaque bg-background-primary"
                      }`}
                    >
                      <img src={option.icon} alt="" className="size-6" />
                      {option.type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRate(benchmark.recommendedRate)}
                className="rounded-full bg-[#f8fafb] px-4 py-3 font-['Rubik'] text-[length:var(--fontsize-label-l)] font-semibold text-brand-grey"
              >
                Use Recommendation
              </button>
              <Button type="submit" variant="outline" size="md">
                View Potential
              </Button>
            </div>
          </form>

          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-8 lg:gap-4 lg:p-12">
            <div className="flex flex-col gap-2">
              <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-m)] md:leading-[var(--lineheight-headline-m)] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
                Revenue Potential Summary:
              </h3>
              {!submitted && (
                <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] text-content-primary">
                  Fill form above to view summary
                </p>
              )}
            </div>

            {submitted && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <SummaryCard title="Occupancy" value={`${summary.occupancy.toFixed(1)}%`} caption="Occupancy rate estimate" />
                  <SummaryCard title="Monthly ORN" value={summary.monthlyOrn.toLocaleString("id-ID")} caption="Room night sold" />
                  <SummaryCard title="Yearly ORN" value={summary.yearlyOrn.toLocaleString("id-ID")} caption="Room night sold" />
                  <SummaryCard
                    title="Monthly NBV"
                    value={formatRange(summary.monthlyNbvMid)}
                    caption="Net Booking Value"
                    prefix="Rp"
                    className="md:col-span-3 lg:col-span-1"
                  />
                </div>

                <SummaryCard
                  title="Yearly NBV"
                  value={formatRange(summary.yearlyNbvMid)}
                  caption="Net Booking Value"
                  prefix="Rp"
                  full
                />

                <div className="flex flex-col gap-2 rounded-2xl bg-background-primary p-4">
                  <h4 className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-xs)] md:leading-[var(--lineheight-headline-xs)] lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
                    Market Position - ADR
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="relative h-8 rounded-full bg-background-alternative">
                      <div className="absolute inset-y-1/2 left-2 right-2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ec8422] via-[#beffe5] to-[#228aec]" />
                      <div
                        className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-brand-red bg-white/85 shadow-sm"
                        style={{ left: `${summary.scalePosition}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-['Rubik'] text-[length:var(--fontsize-body-s)] font-light text-content-tertiary">
                      <span>Below</span>
                      <span>Recommended</span>
                      <span>Above</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] font-medium text-content-primary">
                      Evaluation:
                    </p>
                    <div className="flex items-start gap-3 rounded-xl border border-background-alternative p-4">
                      <span className="flex shrink-0 items-center rounded-full bg-light-success-bg p-2">
                        <img src={iconThumbsUp} alt="" className="size-4" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] font-medium text-success">
                          {summary.evaluation}
                        </p>
                        <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] text-content-primary">
                          Your ADR is {Math.round(summary.ratio * 100)}% of the recommendation of Rp{" "}
                          {formatIDR(benchmark.recommendedRate)} for the {hotelType} type.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-background-primary p-4">
                  <h4 className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-xs)] md:leading-[var(--lineheight-headline-xs)] lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
                    Comparison of Hotel Types - City & Same Number of Rooms
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                      <thead>
                        <tr className="border-b border-border-opaque">
                          {["TYPE", "OCCUPANCY", "RECOMMENDED ADR", "NBV / MONTH"].map((head) => (
                            <th
                              key={head}
                              className="px-2 py-2 text-left font-['Rubik'] text-[length:var(--fontsize-body-s)] font-light text-content-primary"
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {HOTEL_TYPES.map((row) => {
                          const monthlyOrn = Math.round(rooms * 30 * (row.occupancy / 100));
                          const mid = monthlyOrn * row.recommendedRate;
                          return (
                            <tr
                              key={row.type}
                              className={row.type === hotelType ? "bg-light-accent-bg" : undefined}
                            >
                              <td className="px-2 py-3 text-left font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary">
                                {row.type}
                              </td>
                              <td className="px-2 py-3 text-left font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary">
                                {row.occupancy.toFixed(1)}%
                              </td>
                              <td className="px-2 py-3 text-left font-['Rubik'] text-[length:var(--fontsize-headline-xs)] text-content-primary">
                                Rp {formatIDR(row.recommendedRate)}
                              </td>
                              <td className="px-2 py-3 text-left font-['Rubik'] text-[length:var(--fontsize-headline-xs)] whitespace-nowrap text-content-primary">
                                Rp {formatRange(mid)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function SummaryCard({
  title,
  value,
  caption,
  prefix,
  full,
  className,
}: {
  title: string;
  value: string;
  caption: string;
  prefix?: string;
  full?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl bg-background-primary p-4 ${full ? "w-full" : ""} ${className ?? ""}`}>
      <p className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-xs)] md:leading-[var(--lineheight-headline-xs)] lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
        {title}
      </p>
      <div className="flex items-center gap-2">
        {prefix && (
          <span className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] font-medium text-content-tertiary">
            {prefix}
          </span>
        )}
        <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xl)] font-medium text-content-primary md:text-[length:var(--fontsize-headline-m)] md:leading-[var(--lineheight-headline-m)] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
          {value}
        </p>
      </div>
      <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] font-light text-content-primary">
        {caption}
      </p>
    </div>
  );
}
