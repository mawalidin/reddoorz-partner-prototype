import chevronDown from "../../assets/icons/chevron-down.svg";
import flagId from "../../assets/register/flag-id.png";
import ArrowLeftIcon from "../../components/ArrowLeftIcon";
import Button from "../../components/Button";
import { Field, TextField, inputClasses } from "../../components/FormField";
import type { PropertyLocation } from "../../registration";
import type { Address } from "../../data/mockAddresses";

type PropertyAddressStepProps = {
  titleId: string;
  address: Address;
  onBack: () => void;
  onNext: (location: PropertyLocation) => void;
};

export default function PropertyAddressStep({ titleId, address, onBack, onNext }: PropertyAddressStepProps) {
  return (
    <div className="flex flex-col items-start gap-5 md:gap-6">
      <Button
        variant="outline"
        size="sm"
        className="!gap-2 !px-3 !py-[9px] leading-6 lg:!gap-3 lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-l)] lg:leading-[normal]"
        onClick={onBack}
      >
        <ArrowLeftIcon className="size-4 lg:size-5" />
        Back
      </Button>

      <div className="flex w-full flex-col gap-2">
        <h2
          id={titleId}
          className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-bold md:text-[length:var(--fontsize-headline-l)] md:leading-[var(--lineheight-headline-l)] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)] text-content-primary"
        >
          Property Address
        </h2>
        <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-4 font-normal text-content-tertiary lg:text-[length:var(--fontsize-body-m)] lg:leading-5">
          Ensure address is correct and accurate before your submission.
        </p>
      </div>

      {/* Remounted per address so defaultValues reflect the new selection. */}
      <form
        key={address.id}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const value = (name: string) => String(data.get(name) ?? "").trim();
          onNext({
            country: value("country"),
            building: value("building"),
            unit: value("unit"),
            street: value("street"),
            district: value("district"),
            city: value("city"),
            province: value("province"),
            postalCode: value("postalCode"),
          });
        }}
        className="flex w-full flex-col gap-4 md:gap-6"
      >
        <Field label="Country" required>
          <span className="relative block">
            <img
              src={flagId}
              alt=""
              className="pointer-events-none absolute top-1/2 left-4 h-[12.5px] w-[18.4px] -translate-y-1/2"
            />
            <select name="country" defaultValue="Indonesia" className={`${inputClasses} appearance-none pr-10 pl-[52px]`}>
              <option>Indonesia</option>
            </select>
            <img
              src={chevronDown}
              alt=""
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            />
          </span>
        </Field>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <TextField label="Building Name" note="(If applicable)" name="building" placeholder="Enter building name" />
          <TextField label="Unit, floor, etc." note="(If applicable)" name="unit" placeholder="Enter unit, floor, etc." />
        </div>

        <TextField label="Street Address" name="street" defaultValue={address.street} />
        <TextField label="District (If applicable)" name="district" defaultValue={address.district} />
        <TextField label="City / Regency" name="city" defaultValue={address.city} />
        <TextField label="Province" name="province" defaultValue={address.province} />
        <TextField label="Postal Code" name="postalCode" defaultValue={address.postalCode} />

        <Button type="submit" size="lg" className="w-full !px-4 !py-3 lg:!px-5 lg:!py-4">
          Next
        </Button>
      </form>
    </div>
  );
}
