import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProcessSteps from "@/components/landing/ProcessSteps";
import ServiceCategories from "@/components/landing/ServiceCategories";
import TopTalent from "@/components/landing/TopTalent";
import LatestProjects from "@/components/landing/LatestProjects";
import StatsBar from "@/components/landing/StatsBar";
import Testimonials from "@/components/landing/Testimonials";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";
import { verifySession } from "@/lib/session";

export default async function LandingPage() {
  const session = await verifySession();

  return (
    <>
      <Navbar sessionName={session?.name ?? null} />
      <Hero />
      <ProcessSteps />
      <ServiceCategories />
      <TopTalent />
      <LatestProjects />
      <StatsBar />
      <Testimonials />
      <CtaSection />
      <Footer />
    </>
  );
}
