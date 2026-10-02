import { useId, useState } from "react";
import chevronDown from "../assets/icons/chevron-down.svg";
import flagId from "../assets/register/flag-id.png";
import houseImage from "../assets/register/property-house.png";
import apartmentImage from "../assets/register/property-typeimage/Apartment.png";
import guestHouseImage from "../assets/register/property-typeimage/Guesthouse.png";
import homestayImage from "../assets/register/property-typeimage/Homestay.png";
import hotel12Image from "../assets/register/property-typeimage/2-3 Hotel.png";
import hotel3Image from "../assets/register/property-typeimage/3 Hotel.png";
import hotel45Image from "../assets/register/property-typeimage/4-5 Hotel.png";
import villaImage from "../assets/register/property-typeimage/Villa.png";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import { Field, LabelText, TextField, inputClasses, labelClasses } from "../components/FormField";
import { REGISTER_PATH, SUCCESS_PATH, navigate } from "../router";
import { formatLocation, markSubmitted, type PropertyLocation } from "../registration";

// Copy as written in Figma (including "Apartement"). `image` is the illustration
// shown in the grey panel when the type is selected; "Other" has none, so it
// keeps the default house.
type PropertyType = { label: string; image?: string };

const PROPERTY_TYPES: PropertyType[] = [
  { label: "1-2 Star Hotel", image: hotel12Image }, // file: "2-3 Hotel.png"
  { label: "3 Star Hotel", image: hotel3Image },
  { label: "4-5 Star Hotel", image: hotel45Image },
  { label: "Villa", image: villaImage },
  { label: "Homestay", image: homestayImage },
  { label: "Apartement", image: apartmentImage },
  { label: "Guest House", image: guestHouseImage },
  { label: "Other" },
];

function PropertyTypeField({ onChange }: { onChange: (type: PropertyType) => void }) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className={labelClasses}>
        Property Type<span className="text-brand-red">*</span>
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex flex-col rounded-lg border border-border-opaque bg-background-primary px-4 py-[14px]"
      >
        {PROPERTY_TYPES.map((type) => (
          <label key={type.label} className="flex h-9 cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="propertyType"
              value={type.label}
              required
              onChange={() => onChange(type)}
              className="size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-border-opaque bg-background-primary transition-[border-color,border-width] duration-150 ease-out checked:border-[6px] checked:border-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            />
            <span className="font-['Rubik'] text-[length:var(--fontsize-body-m)] leading-5 text-content-primary">
              {type.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ConsentCheckbox() {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0 shrink-0 lg:mt-0.5">
        <input
          type="checkbox"
          name="consent"
          required
          className="peer size-4 cursor-pointer appearance-none rounded border border-border-opaque bg-background-primary transition-colors duration-150 ease-out checked:border-brand-red checked:bg-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red lg:size-5"
        />
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full scale-[0.8] p-0.5 text-white opacity-0 transition-[opacity,scale] duration-[120ms] ease-out peer-checked:scale-100 peer-checked:opacity-100"
        >
          <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-4 text-content-primary lg:text-[length:var(--fontsize-body-m)] lg:leading-6">
        I understand we will only share your address with guests who are booked as outlined in our{" "}
        {/* Placeholder destination: no privacy-policy page exists in this prototype. */}
        <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-brand-red hover:underline">
          Privacy Policy
        </a>
        .
      </span>
    </label>
  );
}

export default function PropertyDetailsSection({ location }: { location: PropertyLocation }) {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const illustration = propertyType?.image ?? houseImage;

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 px-4 py-8 md:p-8 lg:gap-10 lg:p-20">
      <BackLink href={REGISTER_PATH}>Back</BackLink>

      {/* Native validation runs first; a valid submit goes to the success page. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          markSubmitted();
          navigate(SUCCESS_PATH);
        }}
        className="w-full overflow-hidden rounded-2xl bg-background-primary shadow-[0_4px_4px_-1px_rgba(12,12,13,0.1),0_4px_4px_-1px_rgba(12,12,13,0.05)] lg:rounded-3xl"
      >
        <div className="flex flex-col gap-6 p-4 md:p-5 lg:gap-10 lg:p-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-['Rubik'] text-[length:var(--fontsize-headline-xl)] leading-[var(--lineheight-headline-xl)] font-semibold text-content-primary lg:text-[length:var(--fontsize-headline-xxl)] lg:leading-[var(--lineheight-headline-xxl)]">
              Complete your property
            </h1>
            <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-medium text-content-secondary lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]">
              You’re almost there, review and fill in the details below.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start lg:gap-10">
            <div className="relative aspect-square w-full shrink-0 rounded-2xl bg-background-alternative md:size-[150px] md:w-[150px] lg:size-[350px] lg:w-[350px] lg:rounded-[33.6px]">
              {/* Keyed by source so a new illustration fades in on selection. */}
              <img
                key={illustration}
                src={illustration}
                alt={propertyType ? `Illustration for property type: ${propertyType.label}` : "Illustration of a small house"}
                className="absolute inset-[20%] size-[60%] animate-[fade-in_150ms_ease-out_both] object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <TextField label="Owner Full Name" name="ownerName" required autoComplete="name" placeholder="Enter full name" />

              <div className="flex flex-col gap-2">
                <LabelText label="Mobile Number" required />
                <div className="flex gap-2">
                  <span className="relative block w-[103px] shrink-0">
                    <img src={flagId} alt="" className="pointer-events-none absolute top-1/2 left-4 h-[12.5px] w-[18.4px] -translate-y-1/2" />
                    <select
                      name="countryCode"
                      aria-label="Country code"
                      defaultValue="+62"
                      className={`${inputClasses} appearance-none pr-8 pl-10`}
                    >
                      <option>+62</option>
                    </select>
                    <img src={chevronDown} alt="" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    autoComplete="tel-national"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={15}
                    onKeyDown={(event) => {
                      // Block letters/symbols as typed; keep shortcuts and navigation keys.
                      if (event.key.length === 1 && !/\d/.test(event.key) && !event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                      }
                    }}
                    onInput={(event) => {
                      // Catches paste, drag-drop and IME input.
                      const input = event.currentTarget;
                      const digits = input.value.replace(/\D/g, "");
                      if (digits !== input.value) input.value = digits;
                    }}
                    aria-label="Mobile number"
                    placeholder="Enter mobile number"
                    className={`${inputClasses} min-w-0 flex-1`}
                  />
                </div>
              </div>

              <TextField label="Property Name" note="(Optional)" name="propertyName" placeholder="Enter property name" />

              <div className="flex flex-col gap-2">
                <span className={labelClasses}>Property Location</span>
                <p className="font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-content-primary">
                  {formatLocation(location)}
                </p>
              </div>

              <PropertyTypeField onChange={setPropertyType} />

              <Field label="Number of Rooms" required>
                <input
                  type="number"
                  name="rooms"
                  required
                  min={1}
                  inputMode="numeric"
                  placeholder="Enter number of room(s)"
                  className={inputClasses}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 border-t border-border-opaque p-4 md:p-5 lg:p-10">
          <ConsentCheckbox />
          <Button
            type="submit"
            className="w-full leading-6 !px-3 !py-[9px] !text-[length:var(--fontsize-label-m)] md:w-auto lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-l)] lg:leading-[normal]"
          >
            Submit Registration
          </Button>
        </div>
      </form>
    </section>
  );
}
