// Footnote markers for features that are not available everywhere:
// "*" = Indonesia only (Philippines coming soon), "**" = Franchised partnerships only.
export type Availability = "philippines" | "franchised";

const NOTES: Record<Availability, { marker: string; text: string }> = {
  philippines: {
    marker: "*",
    text: "Currently only available in Indonesia, coming soon to Philippines.",
  },
  franchised: {
    marker: "**",
    text: "Only for Franchised partnerships.",
  },
};

export const availabilityMarker = (availability?: Availability) =>
  availability ? NOTES[availability].marker : "";

// Section-level legend, placed at the very bottom of the section container.
export default function AvailabilityDisclaimer({
  notes,
  className = "",
}: {
  notes: Availability[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[var(--lineheight-label-s)] font-normal text-content-tertiary lg:gap-3 lg:text-[length:var(--fontsize-body-s)] lg:leading-[var(--lineheight-body-s)] ${className}`}
    >
      {notes.map((note) => (
        <p key={note}>
          {NOTES[note].marker} {NOTES[note].text}
        </p>
      ))}
    </div>
  );
}
