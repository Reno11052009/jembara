import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";
import ShareProjectButton from "@/components/projects/ShareProjectButton";
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Jembara
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  <BriefcaseBusiness size={14} aria-hidden="true" /> Project OPEN
                </span>
                <h1 className="mt-3 font-display text-2xl font-black text-ink sm:text-3xl">
                  {project.title}
                </h1>
                <p className="mt-2 font-semibold text-ink-muted">
                  {project.businessName} · {project.businessLocation}
                </p>
              </div>
              <ShareProjectButton
                projectId={project.id}
                projectTitle={project.title}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-ink-muted">Budget Tetap</p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.budgetLabel}
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <CalendarDays size={13} aria-hidden="true" /> Deadline
                </p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.deadlineLabel}
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin size={13} aria-hidden="true" /> Mode & Lokasi
                </p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.workModeLabel} · {project.locationLabel}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="font-display text-lg font-black text-ink">
                Deskripsi Project
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-muted">
                {project.description}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-lg font-black text-ink">
                Skill Wajib
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-canvas px-3 py-1.5 text-sm font-semibold text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-hairline bg-card p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-lg font-black text-ink">
              Tertarik dengan project ini?
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Masuk sebagai pelajar untuk melihat kecocokan skill dan mengirim
              proposal kepada UMKM.
            </p>
            <Link
              href={`/dashboard/find-projects/${project.id}`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Lihat & Ajukan Proposal
            </Link>
            <p className="mt-3 text-center text-xs text-ink-muted">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-brand">
                Daftar gratis
              </Link>
            </p>
          </aside>
        </div>
    </main>
  );
}

export default function PublicProjectPage({ params }: PublicProjectPageProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-brand" />
            <span className="font-display text-lg font-black text-ink">
              Jem<span className="text-brand">Bara</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-ink hover:text-brand"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <Suspense fallback={<PublicProjectSkeleton />}>
        <PublicProjectContent params={params} />
      </Suspense>
    </div>
  );
}
