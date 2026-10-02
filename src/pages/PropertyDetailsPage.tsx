import { useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { REGISTER_PATH, navigate } from "../router";
import { loadLocation } from "../registration";
import PropertyDetailsSection from "../sections/PropertyDetailsSection";

export default function PropertyDetailsPage() {
  // This step needs the address confirmed in the previous one.
  const location = loadLocation();

  useEffect(() => {
    if (!location) navigate(REGISTER_PATH, { replace: true });
  }, [location]);

  useEffect(() => {
    const previous = document.title;
    document.title = "Complete your property | RedDoorz Partner";
    return () => {
      document.title = previous;
    };
  }, []);

  if (!location) return null;

  return (
    <>
      <Header variant="register" />
      <main className="bg-[#faf9f6] pt-[var(--header-height)] lg:pt-[calc(var(--header-height)+16px)]">
        <PropertyDetailsSection location={location} />
      </main>
      <Footer />
    </>
  );
}
