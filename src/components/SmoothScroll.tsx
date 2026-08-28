import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        // Lenis honors prefers-reduced-motion itself (respectReducedMotion
        // defaults to true): smoothing disables and scroll tracks input 1:1.
        lerp: 0.1,
        duration: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
