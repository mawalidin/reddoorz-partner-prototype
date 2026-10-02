import { useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RegisterHeroSection from "../sections/RegisterHeroSection";

export default function RegisterPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Register your RedDoorz property | RedDoorz Partner";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <Header variant="register" />
      <main className="bg-[#faf9f6] pt-[var(--header-height)] lg:pt-[calc(var(--header-height)+16px)]">
        <RegisterHeroSection />
      </main>
      <Footer />
    </>
  );
}
