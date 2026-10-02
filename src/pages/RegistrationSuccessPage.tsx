import { useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { REGISTER_PATH, navigate } from "../router";
import { isSubmitted } from "../registration";
import RegistrationSuccessSection from "../sections/RegistrationSuccessSection";

export default function RegistrationSuccessPage() {
  // Only reachable after submitting the details form.
  const submitted = isSubmitted();

  useEffect(() => {
    if (!submitted) navigate(REGISTER_PATH, { replace: true });
  }, [submitted]);

  useEffect(() => {
    const previous = document.title;
    document.title = "Thank you for applying | RedDoorz Partner";
    return () => {
      document.title = previous;
    };
  }, []);

  if (!submitted) return null;

  return (
    <>
      <Header variant="register" />
      <main className="bg-[#faf9f6] pt-[var(--header-height)] lg:pt-[calc(var(--header-height)+16px)]">
        <RegistrationSuccessSection />
      </main>
      <Footer />
    </>
  );
}
