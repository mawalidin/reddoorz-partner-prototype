import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "plain" | "ghost" | "subtle";
type ButtonSize = "sm" | "md" | "lg" | "xl";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#fb4042] to-[#ec228a] text-white hover:brightness-105 focus-visible:outline-white",
  outline:
    "bg-background-primary text-brand-grey border border-border-opaque hover:bg-background-alternative",
  // White pill without a border, for buttons that sit on the off-white page background.
  plain: "bg-background-primary text-brand-grey hover:bg-background-alternative",
  ghost: "text-brand-grey hover:bg-background-alternative",
  // Grey pill (Figma grey40), e.g. "Back to Home" on the success page.
  subtle: "bg-background-alternative text-brand-grey hover:bg-border-opaque",
};

// Figma defines a different padding/font-size pairing per context rather than
// one universal button size — see IMPLEMENTATION_NOTES.md.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-3 text-[length:var(--fontsize-label-m)]", // Header/Topbar
  md: "px-4 py-3 text-[length:var(--fontsize-label-l)]", // Calculator "View Potential"
  lg: "px-5 py-4 text-[length:var(--fontsize-label-l)]", // Solutions "Learn More"
  xl: "px-5 py-4 text-[length:var(--fontsize-label-xl)]", // Hero-style CTA pairs
};

export default function Button({
  children,
  variant = "primary",
  size = "xl",
  icon,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-['Rubik'] font-semibold whitespace-nowrap transition-[background-color,filter,scale] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon}
    </button>
  );
}
