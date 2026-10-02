import { useState } from "react";
import Modal from "../../components/Modal";
import type { Address } from "../../data/mockAddresses";
import { DETAILS_PATH, navigate } from "../../router";
import { saveLocation } from "../../registration";
import LocationSearchStep from "./LocationSearchStep";
import PropertyAddressStep from "./PropertyAddressStep";

const TITLE_ID = "register-modal-title";

// Two-step flow: "Enter your address" -> "Property Address" confirmation.
// The query lives here so going Back restores what the user had typed.
export default function AddressModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Address | null>(null);

  return (
    <Modal labelledBy={TITLE_ID} onClose={onClose}>
      {/* Keyed per step so the content eases in on Next and on Back. */}
      <div
        key={selected ? "address" : "search"}
        className="animate-[content-swap_220ms_cubic-bezier(0.23,1,0.32,1)_both]"
      >
      {selected ? (
        <PropertyAddressStep titleId={TITLE_ID} address={selected} onBack={() => setSelected(null)}
          onNext={(location) => {
            saveLocation(location);
            navigate(DETAILS_PATH);
          }}
        />
      ) : (
        <LocationSearchStep
          titleId={TITLE_ID}
          query={query}
          onQueryChange={setQuery}
          onSelect={setSelected}
        />
      )}
      </div>
    </Modal>
  );
}
