import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, MapPin, Star } from "lucide-react";
import { getPublicSkillPassport } from "@/lib/public-passport";

export const metadata: Metadata = { title: "Skill Passport | Jembara", description: "Rekam jejak keterampilan dan proyek talent Jembara." };
interface Props { params: Promise<{ studentId: string }> }

async function Passport({ params }: Props) {
  const { studentId } = await params;
  const talent = await getPublicSkillPassport(studentId);
  if (!talent) notFound();

  return <main className="mx-auto max-w-5xl px-6 py-10">
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand"><ArrowLeft size={16} /> Kembali ke Jembara</Link>
    <section className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {talent.avatar ? <Image src={talent.avatar} alt={talent.name} width={96} height={96} className="h-24 w-24 rounded-2xl object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-soft text-2xl font-black text-brand">{talent.name.slice(0, 2).toUpperCase()}</div>}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl font-black text-ink">{talent.name}</h1><span className={`rounded-full px-3 py-1 text-xs font-bold ${talent.available ? "bg-success/10 text-success" : "bg-canvas text-ink-muted"}`}>{talent.available ? "Tersedia" : "Belum tersedia"}</span></div>
          <p className="mt-1 font-semibold text-brand">{talent.headline}</p>
          {talent.location && <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted"><MapPin size={15} /> {talent.location}</p>}
          {talent.education && <p className="mt-1 text-sm text-ink-muted">{talent.education}</p>}
          {talent.bio && <p className="mt-4 max-w-3xl leading-7 text-ink-muted">{talent.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">{talent.links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-full border border-hairline px-3 py-1.5 text-sm font-semibold text-brand">{label}</a>)}</div>
        </div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-canvas p-4"><p className="text-xs text-ink-muted">Rating</p><p className="mt-1 flex items-center gap-2 font-display text-xl font-black"><Star className="fill-brand text-brand" size={18} /> {talent.rating?.toFixed(1) ?? "Talent baru"}</p></div>
        <div className="rounded-xl bg-canvas p-4"><p className="text-xs text-ink-muted">Proyek Selesai</p><p className="mt-1 font-display text-xl font-black">{talent.completedProjects}</p></div>
        <div className="rounded-xl bg-canvas p-4"><p className="text-xs text-ink-muted">Skill Terverifikasi</p><p className="mt-1 font-display text-xl font-black">{talent.skills.filter((skill) => skill.verified).length}</p></div>
      </div>
    </section>
    <section className="mt-6 rounded-2xl border border-hairline bg-card p-6"><h2 className="font-display text-xl font-black">Keterampilan</h2><div className="mt-4 flex flex-wrap gap-2">{talent.skills.map((skill) => <span key={skill.id} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-2 text-sm font-semibold">{skill.name} · {skill.level.toLocaleLowerCase("id-ID")}{skill.verified && <BadgeCheck size={16} className="text-success" aria-label="Terverifikasi" />}</span>)}</div></section>
    <section className="mt-6"><h2 className="font-display text-xl font-black">Portofolio</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{talent.portfolios.map((item) => <article key={item.id} className="rounded-xl border border-hairline bg-card p-5"><h3 className="font-display font-black">{item.title}</h3>{item.description && <p className="mt-2 text-sm leading-6 text-ink-muted">{item.description}</p>}{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-bold text-brand">Lihat karya</a>}</article>)}</div></section>
    <section className="mt-6 rounded-2xl border border-hairline bg-card p-6"><h2 className="flex items-center gap-2 font-display text-xl font-black"><BriefcaseBusiness size={20} /> Rekam Jejak</h2><div className="mt-4 space-y-3">{talent.projects.map((project) => <div key={project.id} className="rounded-xl bg-canvas p-4"><p className="font-bold">{project.title}</p><p className="text-sm text-ink-muted">{project.umkm.nama_usaha}</p></div>)}</div></section>
    <section className="mt-6"><h2 className="font-display text-xl font-black">Ulasan UMKM</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{talent.reviews.map((review) => <article key={review.id} className="rounded-xl border border-hairline bg-card p-5"><p className="font-bold">{review.umkm.nama_usaha} · {review.rating.toFixed(1)}/5</p><p className="text-xs text-ink-muted">{review.project.title}</p><p className="mt-3 text-sm text-ink-muted">{review.comment || "Tidak ada komentar."}</p></article>)}</div></section>
  </main>;
}

export default function TalentPassportPage({ params }: Props) {
  return <div className="min-h-screen bg-canvas"><Suspense fallback={<main className="mx-auto max-w-5xl animate-pulse px-6 py-10"><div className="h-80 rounded-2xl bg-card" /></main>}><Passport params={params} /></Suspense></div>;
}
