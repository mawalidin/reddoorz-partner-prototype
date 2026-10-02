import { useEffect, useRef } from "react";
import illustration from "../assets/register/registration-complete.png";
import Button from "../components/Button";
import { navigate, REGISTER_PATH } from "../router";
import { clearConfetti, burstConfettiFrom } from "../confetti";
import { hasPlayedConfetti, markConfettiPlayed, resetRegistration } from "../registration";

// Figma: "Back to Home" / "Register A New Property" use the compact button spec
// below tablet and the larger one at desktop (same as the Submit button).
const buttonSize =
  "w-full leading-6 !px-3 !py-[9px] !text-[length:var(--fontsize-label-m)] md:w-auto lg:!px-5 lg:!py-4 lg:!text-[length:var(--fontsize-label-l)] lg:leading-[normal]";

const bodyText =
  "font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] text-content-secondary lg:text-[length:var(--fontsize-headline-s)] lg:leading-[var(--lineheight-headline-s)]";

// Placeholder contact number from Figma.
const CONTACT_LABEL = "+62 858-8088-1103";
const CONTACT_HREF = "tel:+6285880881103";

export default function RegistrationSuccessSection() {
  const illustrationRef = useRef<HTMLImageElement>(null);

  // One burst from the illustration shortly after arriving (once per submission).
  useEffect(() => {
    if (hasPlayedConfetti()) return;
    const timer = window.setTimeout(() => {
      if (!illustrationRef.current) return;
      markConfettiPlayed();
      burstConfettiFrom(illustrationRef.current);
    }, 450);
    return () => {
      window.clearTimeout(timer);
      clearConfetti();
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 md:p-8 lg:p-20">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-background-primary p-4 shadow-[0_4px_4px_-1px_rgba(12,12,13,0.1),0_4px_4px_-1px_rgba(12,12,13,0.05)] md:p-5 lg:gap-10 lg:rounded-3xl lg:p-10">
        <img
          ref={illustrationRef}
          src={illustration}
          alt="A completed application form being stamped “Complete”"
          className="size-[150px] lg:size-[250px]"
        />

        <div className="flex w-full flex-col gap-2 text-center">
          <h1 className="font-['Rubik'] text-[length:var(--fontsize-headline-xl)] leading-[var(--lineheight-headline-xl)] font-semibold text-content-primary lg:text-[length:var(--fontsize-headline-xxl)] lg:leading-[var(--lineheight-headline-xxl)]">
            Thank you for applying!
          </h1>
          <p className={`${bodyText} font-normal`}>
            Your application has been received. Hang tight, our team will get back to you!
          </p>
          <p className={`${bodyText} font-normal`}>
            For more information or property consultation please contact:{" "}
            <a href={CONTACT_HREF} className="font-semibold text-content-primary underline">
              {CONTACT_LABEL}
            </a>
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row lg:gap-4">
          <Button variant="subtle" className={buttonSize} onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button
            className={buttonSize}
            onClick={() => {
              resetRegistration();
              navigate(REGISTER_PATH);
            }}
          >
            Register A New Property
          </Button>
        </div>
      </div>
    </section>
  );
}
