import AvailabilityDisclaimer, { availabilityMarker } from "../../components/AvailabilityNote";
import type { Availability } from "../../components/AvailabilityNote";
import iconBarChart from "../../assets/solutions/icon-bar-chart.svg";
import iconCalendarCheck from "../../assets/solutions/icon-calendar-check.svg";
import iconGlobe from "../../assets/solutions/icon-globe.svg";
import iconMonitor from "../../assets/solutions/icon-monitor.svg";
import iconPhone from "../../assets/solutions/icon-phone.svg";
import iconShare from "../../assets/solutions/icon-share.svg";
import iconTrendUp from "../../assets/solutions/icon-trend-up.svg";
import iconWallet from "../../assets/solutions/icon-wallet.svg";

const PLATFORM_FEATURES: { icon: string; title: string; body: string; availability?: Availability }[] = [
  { icon: iconShare, title: "Channel Manager", body: "RedCM — one inventory across every channel." },
  { icon: iconCalendarCheck, title: "Booking Engine", body: "RBE — take direct, commission-free bookings.", availability: "philippines" },
  { icon: iconMonitor, title: "Front Desk (PMS)", body: "RedPartners — run daily operations with ease." },
  { icon: iconTrendUp, title: "Dynamic Pricing", body: "RedFox — AI rates that maximize revenue." },
  { icon: iconBarChart, title: "Business Reports", body: "Automated performance reports, anytime you need." },
  { icon: iconGlobe, title: "Direct Website & App", body: "Featured on the RedDoorz App & Website." },
  { icon: iconWallet, title: "Autobilling & Payout", body: "Reliable monthly payouts to your bank.", availability: "franchised" },
  { icon: iconPhone, title: "Grow App", body: "Track performance from your phone, anywhere you want." },
];

export default function PlatformGrid({ visible }: { visible: boolean }) {
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  return (
    <div className="flex flex-col items-center gap-6 lg:gap-10">
      <div className={`flex flex-col items-center gap-2 text-center lg:gap-4 ${reveal} ${visible ? shown : hidden}`}>
        <p className="font-['Caveat'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-[#524f4d] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
          POWERFUL & COMPLETE
        </p>
        <h2 className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)]">
          A system built to grow your property, not just advertise them.
        </h2>
      </div>

      <div className={`grid w-full grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border-opaque lg:grid-cols-3 ${reveal} delay-[150ms] ${visible ? shown : hidden}`}>
        {PLATFORM_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-start gap-2 bg-background-primary p-4 lg:gap-4 lg:p-12"
          >
            <span className="flex items-center justify-center rounded-full border border-[#fb4042] p-[10px] lg:p-4">
              <img src={feature.icon} alt="" className="size-4 lg:size-6" />
            </span>
            <h3 className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-medium text-content-primary lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)]">
              {feature.title}
              {availabilityMarker(feature.availability)}
            </h3>
            <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-primary lg:text-[length:var(--fontsize-body-xl)] lg:leading-[var(--lineheight-body-xl)]">
              {feature.body}
            </p>
          </div>
        ))}
        <div className="hidden flex-col items-start justify-center gap-3 bg-[#f0f0f0] p-8 lg:flex lg:p-12">
          <p className="bg-gradient-to-b from-[#fb4042] to-[#ec228a] bg-clip-text font-['Rubik'] text-[length:var(--fontsize-headline-xl)] leading-[var(--lineheight-headline-xl)] font-medium text-transparent italic">
            + More
          </p>
          <p className="bg-gradient-to-b from-[#fb4042] to-[#ec228a] bg-clip-text font-['Rubik'] text-[length:var(--fontsize-headline-xl)] leading-[var(--lineheight-headline-xl)] font-medium text-transparent italic">
            All-in-one system
          </p>
        </div>
      </div>

      <AvailabilityDisclaimer
        notes={["philippines", "franchised"]}
        className={`w-full ${reveal} delay-[300ms] ${visible ? shown : hidden}`}
      />
    </div>
  );
}
