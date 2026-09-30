import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import Container from "../components/Container";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import avatarDadang from "../assets/stories/avatar-dadang.png";
import avatarJoeCole from "../assets/stories/avatar-joe-cole.png";
import avatarMartono from "../assets/stories/avatar-martono.png";
import iconChevronLeft from "../assets/stories/icon-chevron-left.svg";
import iconChevronRight from "../assets/stories/icon-chevron-right.svg";
import iconXClose from "../assets/icons/icon-x-close.svg";
import iconPlay from "../assets/stories/icon-play.svg";
import iconQuotes from "../assets/stories/icon-quotes.svg";
import videoBanner from "../assets/stories/video-banner.png";

const REVIEWS = [
  {
    quote:
      "When the pandemic started, I was flustered on how to manage my villa. And then The Lavana came to help me manage my villa, from repairing, preparing, and the occupancy continues to increase from the first month until now.",
    avatar: avatarMartono,
    name: "Martono",
    property: "Owner of Akatara Villa Nusa Dua by The Lavana",
  },
  {
    quote:
      "By joining The Lavana, you will have the opportunity to earn profits from villa rentals. They also simplifies the usage of the application to do check-in and check-out. Everything is perfect!",
    avatar: avatarDadang,
    name: "Dadang",
    property: "Owner of Villa Royal Pandawa by The Lavana",
  },
  {
    quote:
      "Bagus sekali so far puas dengan segala kerjasamanya dari aspek sales, tamu-tamu yang datang dan juga secara revenue mendapatkan keuntungan yang sesuai harapan.",
    avatar: avatarJoeCole,
    name: "Joe Cole",
    property: "Owner of Lega Legi Town House Seminyak by The Lavana",
  },
];

// Example placeholder videos — same clip/copy repeated, matching Figma's own
// placeholder content, just to demonstrate the multi-video carousel.
const VIDEOS = [
  {
    image: videoBanner,
    title: "Partner Testimony for RedDoorz Plus near Taman Mini Anggrek",
  },
  {
    image: videoBanner,
    title: "Partner Testimony for RedDoorz Plus near Taman Mini Anggrek",
  },
  {
    image: videoBanner,
    title: "Partner Testimony for RedDoorz Plus near Taman Mini Anggrek",
  },
];

export default function PartnerStoriesSection() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    breakpoints: {
      "(prefers-reduced-motion: reduce)": { duration: 0 },
    },
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { ref, visible } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const reveal = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
  const hidden = "translate-y-[20%] opacity-0";
  const shown = "translate-y-0 opacity-100";

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (playingIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlayingIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [playingIndex]);

  return (
    <>
    <section id="partner-stories" ref={ref} className="scroll-mt-[var(--header-height)] bg-[#faf9f6] py-8 lg:py-20">
      <Container>
        <h2 className={`mb-6 text-center font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-content-primary lg:mb-10 lg:text-[length:var(--fontsize-display-m)] lg:leading-[var(--lineheight-display-m)] ${reveal} ${visible ? shown : hidden}`}>
          Partner stories
        </h2>

        <div className={`relative mb-6 lg:mb-10 ${reveal} delay-[150ms] ${visible ? shown : hidden}`}>
          <div className="overflow-hidden rounded-2xl md:rounded-3xl" ref={emblaRef}>
            <div className="flex touch-pan-y touch-pinch-zoom gap-2 lg:gap-4">
              {VIDEOS.map((video, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-[320px] shrink-0 grow-0 basis-auto overflow-hidden rounded-2xl md:aspect-auto md:h-[400px] md:w-[693px] md:rounded-3xl lg:h-[620px] lg:w-[1240px]"
                >
                  <img
                    src={video.image}
                    alt="Film crew interviewing a RedDoorz Plus property partner outdoors"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center md:gap-6 lg:gap-10">
                    <p className="max-w-[288px] font-['Rubik'] text-[length:var(--fontsize-headline-m)] leading-[var(--lineheight-headline-m)] font-semibold text-white md:max-w-[480px] md:text-[length:var(--fontsize-headline-xxl)] md:leading-[42px] lg:max-w-[800px] lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]">
                      {video.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPlayingIndex(index)}
                      className="flex items-center gap-2 rounded-full bg-background-primary px-3 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey lg:px-5 lg:py-4 lg:text-[length:var(--fontsize-label-l)]"
                    >
                      <img src={iconPlay} alt="" className="size-4 lg:size-5" />
                      Play Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous video"
              className={`pointer-events-auto hidden items-center justify-center rounded-full bg-background-primary p-[12.5px] shadow-sm transition-opacity md:flex lg:p-4 ${canScrollPrev ? "opacity-100" : "opacity-0"}`}
            >
              <img src={iconChevronLeft} alt="" className="size-5 lg:size-6" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next video"
              className={`pointer-events-auto hidden items-center justify-center rounded-full bg-background-primary p-[12.5px] shadow-sm transition-opacity md:flex lg:p-4 ${canScrollNext ? "opacity-100" : "opacity-0"}`}
            >
              <img src={iconChevronRight} alt="" className="size-5 lg:size-6" />
            </button>
          </div>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {REVIEWS.map((review, index) => (
            <div
              key={review.name}
              className={`flex w-[300px] shrink-0 snap-start flex-col gap-[15px] rounded-2xl bg-background-primary p-4 lg:w-auto lg:shrink lg:gap-12 lg:rounded-3xl lg:p-6 ${reveal} ${visible ? shown : "-translate-y-[20%] opacity-0"}`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              <img src={iconQuotes} alt="" className="size-8 lg:size-[50px]" />
              <div className="flex flex-col gap-[15px] lg:gap-6">
                <p className="min-h-[150px] font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[20px] text-content-primary lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
                  {review.quote}
                </p>
                <div className="flex items-center gap-3 lg:gap-6">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="size-10 shrink-0 rounded-lg object-cover lg:size-[72px] lg:rounded-[9px]"
                  />
                  <div className="flex flex-col gap-0 lg:gap-1">
                    <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-semibold text-content-primary lg:text-[length:var(--fontsize-headline-l)] lg:leading-[var(--lineheight-headline-l)]">
                      {review.name}
                    </p>
                    <p className="font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[var(--lineheight-label-s)] font-light text-content-primary lg:text-[length:var(--fontsize-headline-xs)] lg:leading-[var(--lineheight-headline-xs)]">
                      {review.property}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {playingIndex !== null && (
      <div
        className="video-modal-scrim fixed inset-0 z-[60] flex flex-col items-start gap-2.5 bg-[rgba(27,28,31,0.4)] md:items-center md:justify-center md:px-8 md:py-20 lg:p-20"
        onClick={() => setPlayingIndex(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Partner story video"
      >
        <div className="flex h-[65px] w-full items-center justify-end px-4 md:h-auto md:w-full md:py-4 md:px-0">
          <button
            type="button"
            onClick={() => setPlayingIndex(null)}
            aria-label="Close video"
            className="flex items-center justify-center rounded-full bg-background-primary p-[10px] shadow-sm md:p-[12.5px] lg:p-4"
          >
            <img src={iconXClose} alt="" className="size-4 md:size-5 lg:size-6" />
          </button>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 md:flex-none md:w-full md:px-0 md:py-0 lg:max-h-[calc(100vh-258px)] lg:flex-[1_0_0]">
          <div
            className="video-modal-player relative aspect-video w-full overflow-hidden rounded-2xl bg-[#d9d9d9] lg:h-full lg:w-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={VIDEOS[playingIndex].image}
              alt="Film crew interviewing a RedDoorz Plus property partner outdoors"
              className="size-full object-cover"
            />
            <div
              role="status"
              className="absolute inset-0 flex items-center justify-center bg-black/60 text-center font-['Rubik'] text-white"
            >
              Video playback isn't wired up in this prototype.
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
