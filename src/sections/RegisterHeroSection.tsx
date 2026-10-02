import { useState } from "react";
import heroImage from "../assets/register/hero.jpg";
import searchIcon from "../assets/register/icon-search.svg";
import BackLink from "../components/BackLink";
import AddressModal from "./register/AddressModal";

export default function RegisterHeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 px-4 py-8 md:p-8 lg:gap-10 lg:p-20">
      <BackLink href="/">Back to Home</BackLink>

      <div className="flex w-full flex-col justify-center gap-6 md:flex-row md:items-center md:gap-10">
        <div className="flex min-w-0 flex-col gap-6 md:flex-1 lg:gap-10">
          <div className="flex flex-col gap-2 lg:gap-4">
            <h1 className="font-['Rubik'] text-[length:var(--fontsize-headline-xl)] leading-[var(--lineheight-headline-xl)] font-semibold text-content-primary lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]">
              <span className="block">Register your</span>
              <span className="block">RedDoorz property</span>
            </h1>
            <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-medium text-content-secondary lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
              It’s easy just enter your property address and location below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            className="flex w-full max-w-full cursor-pointer lg:w-[500px] items-center gap-2 rounded-full border border-border-opaque bg-background-primary px-4 py-3 text-left transition-[box-shadow,scale] duration-150 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none lg:gap-3 lg:px-5 lg:py-4"
          >
            <img src={searchIcon} alt="" className="size-5 shrink-0" />
            <span className="min-w-0 flex-1 font-['Rubik'] text-[length:var(--fontsize-label-l)] leading-5 font-semibold text-[#949ca9]">
              Search location or address
            </span>
          </button>
        </div>

        <img
          src={heroImage}
          alt="Poolside villa with a traditional timber roof surrounded by tropical plants"
          className="aspect-square w-full rounded-2xl object-cover md:size-[300px] md:w-[300px] md:shrink-0 lg:size-[500px] lg:w-[500px] lg:rounded-3xl"
        />
      </div>
      {modalOpen && <AddressModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
