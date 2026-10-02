// Holds the address confirmed in the "Property Address" step so the following
// "Complete your property" page can show it. Mirrored to sessionStorage so a
// refresh doesn't lose it. (Prototype only — no backend.)

export type PropertyLocation = {
  country: string;
  building: string;
  unit: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
};

const KEY = "registration.location";
let current: PropertyLocation | null = null;

export function saveLocation(location: PropertyLocation) {
  current = location;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(location));
  } catch {
    // storage unavailable — in-memory copy still works
  }
}

export function loadLocation(): PropertyLocation | null {
  if (current) return current;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw) as PropertyLocation;
  } catch {
    current = null;
  }
  return current;
}

export function formatLocation(l: PropertyLocation) {
  return [
    l.unit,
    l.building,
    l.street,
    l.district,
    l.city,
    [l.province, l.postalCode].filter(Boolean).join(" "),
    l.country,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

// "Submitted" flag gates the success page (prototype only — nothing is sent).
const SUBMITTED_KEY = "registration.submitted";
let submitted = false;

// The success-page confetti plays once per submission, not on every refresh.
const CONFETTI_KEY = "registration.confettiPlayed";
let confettiPlayed = false;

export function hasPlayedConfetti() {
  if (confettiPlayed) return true;
  try {
    confettiPlayed = sessionStorage.getItem(CONFETTI_KEY) === "1";
  } catch {
    // ignore
  }
  return confettiPlayed;
}

export function markConfettiPlayed() {
  confettiPlayed = true;
  try {
    sessionStorage.setItem(CONFETTI_KEY, "1");
  } catch {
    // in-memory flag still works
  }
}

export function markSubmitted() {
  submitted = true;
  // Every submission earns a fresh celebration: clear the in-memory flag too, not
  // only the stored one, or a second submit in the same page session stays silent.
  confettiPlayed = false;
  try {
    sessionStorage.setItem(SUBMITTED_KEY, "1");
    sessionStorage.removeItem(CONFETTI_KEY);
  } catch {
    // in-memory flag still works
  }
}

export function isSubmitted() {
  if (submitted) return true;
  try {
    submitted = sessionStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    // ignore
  }
  return submitted;
}

/** Start over: forget the address and the submitted state. */
export function resetRegistration() {
  current = null;
  submitted = false;
  confettiPlayed = false;
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(SUBMITTED_KEY);
    sessionStorage.removeItem(CONFETTI_KEY);
  } catch {
    // ignore
  }
}
