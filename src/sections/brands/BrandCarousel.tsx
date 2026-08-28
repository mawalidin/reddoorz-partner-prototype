import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import iconChevronLeft from "../../assets/brands/icon-chevron-left.svg";
import iconChevronRight from "../../assets/brands/icon-chevron-right.svg";

type BrandCarouselProps = {
  images: string[];
  alt: string;
};

export default function BrandCarousel({ images, alt }: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    breakpoints: {
      "(prefers-reduced-motion: reduce)": { duration: 0 },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="group relative aspect-[416/312] w-full overflow-hidden rounded-2xl">
      <div className="size-full overflow-hidden" ref={emblaRef}>
        <div className="flex size-full touch-pan-y touch-pinch-zoom">
          {images.map((image, i) => (
            <div key={image} className="size-full shrink-0" aria-hidden={i !== selectedIndex}>
              <img
                src={image}
                alt={`${alt} property photo ${i + 1}`}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="pointer-events-auto flex items-center justify-center rounded-full bg-background-primary p-3 shadow-sm"
          aria-label={`Previous ${alt} photo`}
        >
          <img src={iconChevronLeft} alt="" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="pointer-events-auto flex items-center justify-center rounded-full bg-background-primary p-3 shadow-sm"
          aria-label={`Next ${alt} photo`}
        >
          <img src={iconChevronRight} alt="" className="size-5" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to ${alt} photo ${i + 1}`}
            aria-current={i === selectedIndex}
            className={`pointer-events-auto size-2 rounded-full transition-opacity ${i === selectedIndex ? "bg-background-primary opacity-100" : "bg-background-primary opacity-50"}`}
          />
        ))}
      </div>
    </div>
  );
}
