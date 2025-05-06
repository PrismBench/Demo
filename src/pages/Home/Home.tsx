import { DefaultLayout } from "../../components/layout/DefaultLayout";
import HeroSection from "./sections/Hero";
import ProblemStatementSection from "./sections/ProblemStatement";
import SolutionSection from "./sections/Solution";
import ExploreMoreSection from "./sections/ExploreMore";

export function HomePage() {
  return (
    <DefaultLayout>
      <HeroSection />
      <ProblemStatementSection />
      <SolutionSection />
      <ExploreMoreSection />
    </DefaultLayout>
  );
}

export default HomePage;
