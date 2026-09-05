import { Suspense } from "react";
import { connection } from "next/server";
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
import SmoothScroll from "@/components/providers/SmoothScroll";
import { verifySession } from "@/lib/session";
import { getLandingData } from "@/lib/landing";

async function AuthenticatedNavbar() {
  const session = await verifySession();

  return <Navbar sessionName={session?.name ?? null} />;
}

export const instant = false;
export default async function LandingPage() {
  await connection();
  const data = await getLandingData();
  return (
    <SmoothScroll>
      <Suspense fallback={<Navbar sessionName={null} />}>
        <AuthenticatedNavbar />
      </Suspense>
      <Hero />
      <ProcessSteps />
      <ServiceCategories />
      <TopTalent talents={data.talents} />
      <LatestProjects projects={data.projects} />
      <StatsBar stats={data.stats} />
      <Testimonials testimonials={data.testimonials} />
      <CtaSection />
      <Footer />
    </SmoothScroll>
  );
}
