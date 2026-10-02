import { useEffect, useState } from "react";
import emptyImage from "../../assets/register/empty.png";
import clearIcon from "../../assets/register/icon-x.svg";
import pinLine from "../../assets/register/icon-pin-line.svg";
import pinSolid from "../../assets/register/icon-pin-solid.svg";
import searchIcon from "../../assets/register/icon-search.svg";
import {
  MIN_SEARCH_LENGTH,
  formatAddress,
  nearestAddress,
  searchAddresses,
  type Address,
} from "../../data/mockAddresses";

type LocationSearchStepProps = {
  titleId: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (address: Address) => void;
};

type LocateState = "idle" | "locating" | "error";

const DEBOUNCE_MS = 250;

const SKELETON_TEXT_WIDTHS = ["w-[88%]", "w-[72%]", "w-[80%]", "w-[64%]"];

// Placeholder rows shown while keyword results load (no Figma frame; mirrors
// the Location CTA row: 36px chip + two text lines).
function ResultsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col">
      <div className="mb-2 h-5 w-14 animate-pulse rounded bg-background-alternative" />
      {SKELETON_TEXT_WIDTHS.map((width, index) => (
        <div key={index} className="flex items-start gap-3 py-2 md:py-3">
          <div className="size-9 shrink-0 animate-pulse rounded-xl bg-background-alternative" />
          <div className="flex min-h-9 flex-1 flex-col justify-center gap-1.5">
            <div className={`h-3 animate-pulse rounded bg-background-alternative ${width}`} />
            <div className="h-3 w-[48%] animate-pulse rounded bg-background-alternative" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LocationRow({
  icon,
  loading,
  children,
  onClick,
  disabled,
  emphasis,
}: {
  icon: string;
  loading?: boolean;
  children: string;
  onClick: () => void;
  disabled?: boolean;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-start gap-3 rounded-xl py-2 text-left md:py-3 transition-colors hover:bg-background-alternative focus-visible:outline-2 focus-visible:outline-brand-red disabled:cursor-wait"
    >
      <span className="flex shrink-0 items-center justify-center rounded-xl bg-background-alternative p-2.5 transition-colors group-hover:bg-background-primary">
        {loading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-brand-red/25 border-t-brand-red" />
        ) : (
          <img src={icon} alt="" className="size-4" />
        )}
      </span>
      <span
        className={`flex min-w-0 flex-1 items-center min-h-9 font-['Rubik'] text-[length:var(--fontsize-label-m)] leading-[var(--lineheight-label-m)] text-content-primary lg:font-['Manrope'] ${
          emphasis ? "font-medium" : "font-normal"
        }`}
      >
        {children}
      </span>
    </button>
  );
}

export default function LocationSearchStep({
  titleId,
  query,
  onQueryChange,
  onSelect,
}: LocationSearchStepProps) {
  const [results, setResults] = useState<{ query: string; items: Address[] } | null>(null);
  const [locate, setLocate] = useState<LocateState>("idle");

  const trimmed = query.trim();
  const searching = trimmed.length >= MIN_SEARCH_LENGTH;
  const loadingResults = searching && results?.query !== trimmed;

  useEffect(() => {
    if (!searching) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchAddresses(trimmed).then((items) => {
        if (!cancelled) setResults({ query: trimmed, items });
      });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, searching]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocate("error");
      return;
    }
    setLocate("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onSelect(nearestAddress(coords.latitude, coords.longitude)),
      () => setLocate("error"),
      { timeout: 10_000 },
    );
  };

  return (
    <div className="flex flex-col items-start gap-5 md:items-center md:gap-6">
      <h2
        id={titleId}
        className="font-['Rubik'] text-[length:var(--fontsize-headline-s)] leading-[var(--lineheight-headline-s)] font-bold md:text-[length:var(--fontsize-headline-l)] md:leading-[var(--lineheight-headline-l)] lg:text-[length:var(--fontsize-headline-xl)] lg:leading-[var(--lineheight-headline-xl)] text-content-primary"
      >
        Enter your address
      </h2>

      <div className="flex w-full flex-col gap-2" aria-busy={loadingResults || locate === "locating"}>
        <p role="status" className="sr-only">
          {loadingResults ? "Searching…" : locate === "locating" ? "Finding your location…" : ""}
        </p>
        <label className="flex w-full cursor-text items-center gap-2 rounded-full border border-border-opaque bg-background-primary px-4 py-3 transition-shadow lg:gap-3 lg:px-5 lg:py-4 focus-within:ring-2 focus-within:ring-content-primary">
          <img src={searchIcon} alt="" className="size-5 shrink-0" />
          <span className="sr-only">Search location or address</span>
          <input
            type="text"
            autoFocus
            autoComplete="off"
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setLocate("idle");
            }}
            placeholder="Search location or address"
            className="h-5 min-w-0 flex-1 bg-transparent p-0 font-['Rubik'] text-[length:var(--fontsize-label-l)] leading-5 font-semibold text-content-primary outline-none placeholder:text-[#949ca9]"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="-m-1 shrink-0 rounded-full p-1 hover:bg-background-alternative"
            >
              <img src={clearIcon} alt="" className="size-5" />
            </button>
          )}
        </label>

        {!searching && (
          <>
            <LocationRow
              icon={pinSolid}
              onClick={useCurrentLocation}
              disabled={locate === "locating"}
              loading={locate === "locating"}
              emphasis
            >
              {locate === "locating" ? "Finding your location…" : "Use my current location"}
            </LocationRow>
            {locate === "error" && (
              <p
                role="alert"
                className="animate-[fade-in_150ms_ease-out_both] font-['Rubik'] text-[length:var(--fontsize-label-m)] leading-[var(--lineheight-label-m)] text-error"
              >
                We couldn’t get your location. Allow location access or search for your address instead.
              </p>
            )}
          </>
        )}

        {loadingResults && <ResultsSkeleton />}

        {!loadingResults && searching && results && results.items.length > 0 && (
          <div className="flex animate-[fade-in_150ms_ease-out_both] flex-col gap-2">
            <p className="font-['Manrope'] text-[length:var(--fontsize-label-m)] leading-4 font-bold text-content-primary lg:text-[length:var(--fontsize-label-l)] lg:leading-5">
              Result
            </p>
            <ul>
              {results.items.map((address) => (
                <li key={address.id}>
                  <LocationRow icon={pinLine} onClick={() => onSelect(address)}>
                    {formatAddress(address)}
                  </LocationRow>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loadingResults && searching && results && results.items.length === 0 && (
          <div className="flex animate-[pop-in_200ms_cubic-bezier(0.23,1,0.32,1)_both] flex-col items-center gap-4 p-8 text-center">
            <img src={emptyImage} alt="" className="size-[100px] object-cover" />
            <div className="flex w-full flex-col gap-2">
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-xl)] leading-[var(--lineheight-body-xl)] font-normal text-content-primary">
                “{results.query}” not found
              </p>
              <p className="font-['Rubik'] text-[length:var(--fontsize-body-s)] leading-[var(--lineheight-body-s)] font-light text-content-secondary">
                Please try a different keyword and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
