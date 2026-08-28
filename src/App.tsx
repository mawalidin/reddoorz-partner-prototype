import Footer from "./components/Footer";
import Header from "./components/Header";
import AwardsSection from "./sections/AwardsSection";
import BrandSection from "./sections/BrandSection";
import CalculatorSection from "./sections/CalculatorSection";
import HeroSection from "./sections/HeroSection";
import HowItWorksIntro from "./sections/HowItWorksIntro";
import MetricsSection from "./sections/MetricsSection";
import PartnerStoriesSection from "./sections/PartnerStoriesSection";
import SolutionsSection from "./sections/SolutionsSection";
import StorytellingSection from "./sections/StorytellingSection";
import ValueSection from "./sections/ValueSection";

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MetricsSection />
        <StorytellingSection />
        <SolutionsSection />
        <HowItWorksIntro />
        <PartnerStoriesSection />
        <CalculatorSection />
        <BrandSection />
        <ValueSection />
        <AwardsSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
