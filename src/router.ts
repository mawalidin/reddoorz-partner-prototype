import type { MouseEvent } from "react";
import { useSyncExternalStore } from "react";

// Minimal History-API router for the prototype's screens ("/",
// "/register", "/register/details" and "/register/success") — avoids pulling in a routing dependency for one extra page.

export const REGISTER_PATH = "/register";
export const DETAILS_PATH = "/register/details";
export const SUCCESS_PATH = "/register/success";

export function navigate(to: string, { replace = false } = {}) {
  if (replace) history.replaceState(null, "", to);
  else history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/** onClick handler for an <a href> that should navigate client-side. */
export function navigateOnClick(to: string) {
  return (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(to);
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}
