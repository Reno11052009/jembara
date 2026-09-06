import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PublicProjectView from "@/components/projects/PublicProjectView";
import { getPublicProjectDetailData } from "@/lib/public-project";

export const metadata: Metadata = {
  title: "Detail Project | Jembara",
  description: "Lihat peluang project UMKM untuk talenta muda di Jembara.",
};

interface PublicProjectPageProps {
  params: Promise<{ projectId: string }>;
}

function PublicProjectSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-6 py-8 sm:py-12">
      <div className="mb-5 h-5 w-40 rounded bg-hairline" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-128 rounded-2xl border border-hairline bg-card" />
        <div className="h-64 rounded-2xl border border-hairline bg-card" />
      </div>
    </main>
  );
}

async function PublicProjectContent({ params }: PublicProjectPageProps) {
  const { projectId } = await params;
  const project = await getPublicProjectDetailData(projectId);

  if (!project) notFound();

  return <PublicProjectView project={project} />;
}

export default function PublicProjectPage({ params }: PublicProjectPageProps) {
  return (
    <Suspense fallback={<PublicProjectSkeleton />}>
      <PublicProjectContent params={params} />
    </Suspense>
  );
}
