import { useEffect, useState } from "react";
import SegmentedSwitch from "../components/SegmentedSwitch";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import photoFranchised from "../assets/storytelling/business-usp.jpg";
import photoLeased from "../assets/storytelling/business-usp-leased.jpg";
import iconCheckCircle from "../assets/icons/icon-check-circle.svg";

const PROPERTY_TYPES = [
  { value: "franchised", label: "Franchised" },
  { value: "leased", label: "Leased" },
] as const;
type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

const CONTENT: Record<
  PropertyType,
  {
    photo: string;
    photoAlt: string;
    headline: [string, string];
    body: string;
    benefits: { title: string; text: string }[];
  }
> = {
  franchised: {
    photo: photoFranchised,
    photoAlt: "RedDoorz partner and hotel owner reviewing performance on a tablet in a hotel lobby",
    headline: ["You run it.", "We help it grow."],
    body: "Keep full ownership and day-to-day control of your property while we bring the brand, technology, and guest demand. You manage the hotel, we help fill every room.",
    benefits: [
      {
        title: "More bookings, less legwork.",
        text: "Your rooms go live on the RedDoorz app, website, and leading OTAs, backed by marketing that brings travelers to your door.",
      },
      {
        title: "Smarter pricing, stronger revenue.",
        text: "Demand-based pricing and our property management system help you set the right rate every night and track performance in one place.",
      },
      {
        title: "Standards that build loyalty.",
        text: "Brand standards, staff training, and regular quality checks turn first-time guests into repeat bookings.",
      },
    ],
  },
  leased: {
    photo: photoLeased,
    photoAlt: "Hotel lobby with front desk and housekeeping staff while a guest relaxes with her phone",
    headline: ["We run it.", "You earn from it."],
    body: "Lease your property to RedDoorz and we take over the full operation, from staffing and maintenance to sales and guest service. You earn predictable income without the daily work.",
    benefits: [
      {
        title: "Predictable income, month after month.",
        text: "Receive fixed rent under a long-term agreement, protected from occupancy swings and seasonal dips.",
      },
      {
        title: "Fully hands-off operations.",
        text: "Our team handles staffing, housekeeping, maintenance, and guest service, so you never deal with daily operations.",
      },
      {
        title: "Your property, upgraded.",
        text: "We refresh your property to RedDoorz standards, keeping it competitive and protecting its long-term value.",
      },
    ],
  },
};

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const rise = `transition-[translate,opacity] duration-[900ms] ${ease}`;
// Replays whenever the keyed element remounts on a Franchised/Leased switch.
const swap = "animate-[content-swap_500ms_cubic-bezier(0.23,1,0.32,1)_both]";

export default function BusinessUspSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const [propertyType, setPropertyType] = useState<PropertyType>("franchised");
  const content = CONTENT[propertyType];

  // Avoid a blank frame when the Leased photo is first swapped in.
  useEffect(() => {
    new Image().src = photoLeased;
  }, []);

  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";
  const state = visible ? shown : hidden;

  return (
    <section id="business-usp" ref={ref} className="scroll-mt-[var(--header-height)] bg-[#faf9f6]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 py-8 md:px-8 lg:gap-10 lg:p-20">
        <SegmentedSwitch
          label="Property type"
          options={PROPERTY_TYPES}
          value={propertyType}
          onChange={setPropertyType}
          className={`${rise} ${state}`}
        />

        <h2
          className={`text-center font-['Rubik'] text-[length:var(--fontsize-headline-l)] leading-[var(--lineheight-headline-l)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)] ${rise} delay-[100ms] ${state}`}
        >
          Growing at every stage
        </h2>

        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:justify-center lg:gap-10">
          <img
            key={`photo-${propertyType}`}
            src={content.photo}
            alt={content.photoAlt}
            className={`${swap} aspect-[358/200] w-full rounded-2xl object-cover md:aspect-auto md:h-[300px] md:w-[261px] md:shrink-0 md:rounded-3xl lg:h-[620px] lg:w-[539px] transition-[scale,opacity] duration-[900ms] ${ease} delay-[250ms] ${visible ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"}`}
          />

          <div
            key={`text-${propertyType}`}
            className={`${swap} flex w-full flex-col gap-6 [animation-delay:80ms] md:min-w-0 md:flex-1 lg:gap-10`}
          >
            <div className={`flex flex-col gap-2 text-content-primary lg:gap-4 ${rise} delay-[350ms] ${state}`}>
              <p className="font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold lg:text-[length:var(--fontsize-display-s)] lg:leading-[var(--lineheight-display-s)]">
                {content.headline[0]}
                <br />
                {content.headline[1]}
              </p>
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                {content.body}
              </p>
            </div>

            <div className="flex flex-col gap-2 lg:gap-4">
              <h3
                className={`font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-medium text-content-primary lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)] ${rise} delay-[450ms] ${state}`}
              >
                What we offer
              </h3>
              <ul className="flex flex-col">
                {content.benefits.map((benefit, index) => (
                  <li
                    key={benefit.title}
                    className={`flex items-start gap-2 border-b border-border-opaque py-2 lg:gap-3 lg:py-3 ${rise} ${state}`}
                    style={{ transitionDelay: `${550 + index * 120}ms` }}
                  >
                    <img src={iconCheckCircle} alt="" className="size-4 shrink-0 lg:size-5" />
                    <p className="min-w-0 flex-1 font-['Rubik'] text-[length:11px] leading-[16px] font-light text-content-primary lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
                      <span className="font-medium">{benefit.title}</span> {benefit.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
