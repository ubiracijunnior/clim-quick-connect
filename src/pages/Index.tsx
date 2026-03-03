import { useSearchParams } from "react-router-dom";
import { QuizApp } from "@/components/quiz/QuizApp";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HomeFooter } from "@/components/home/HomeFooter";

const Index = () => {
  const [searchParams] = useSearchParams();
  const showQuiz = searchParams.get("quiz") === "1";

  if (showQuiz) {
    return (
      <div className="w-full max-w-[480px] mx-auto">
        <QuizApp />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <HomeFooter />
    </div>
  );
};

export default Index;
