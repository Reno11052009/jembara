"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortfolioAction } from "@/app/actions/portfolio";
import Button from "@/components/ui/Button";
import type { PortfolioProject } from "@/types/portfolio";
import PortfolioProjectCard from "@/components/portofolio/PortfolioProjectCard";

interface PortfolioProjectSectionProps {
  projects: PortfolioProject[];
}

export default function PortfolioProjectSection({
  projects,
}: PortfolioProjectSectionProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFeedback(null);

    startTransition(async () => {
      const result = await createPortfolioAction(formData);
      if (!result.success) {
        setFeedback({
          type: "error",
          message: result.error || "Portofolio gagal disimpan.",
        });
        return;
      }

      formRef.current?.reset();
      setIsFormOpen(false);
      setFeedback({ type: "success", message: "Portofolio berhasil ditambahkan." });
      router.refresh();
    });
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-black text-ink">Karya Terbaikmu</h2>
        <Button
          type="button"
          variant="primary"
          className="gap-1.5 px-5 py-2.5 text-xs uppercase"
          onClick={() => {
            setIsFormOpen((current) => !current);
            setFeedback(null);
          }}
        >
          {isFormOpen ? <X size={14} /> : <Plus size={14} />}
          {isFormOpen ? "Tutup Form" : "Tambah Project"}
        </Button>
      </div>

      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-hairline bg-card p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Judul karya
              <input
                name="title"
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder="Contoh: Website Katalog Kopi"
                className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Tautan karya (opsional)
              <input
                name="link"
                type="text"
                maxLength={2048}
                placeholder="https://contoh.com/karya"
                className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink md:col-span-2">
              URL gambar (opsional)
              <input
                name="image"
                type="text"
                maxLength={2048}
                placeholder="https://contoh.com/gambar.jpg"
                className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink md:col-span-2">
              Deskripsi (opsional)
              <textarea
                name="description"
                rows={4}
                maxLength={1000}
                placeholder="Jelaskan masalah, proses, dan hasil karya ini."
                className="resize-y rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            {feedback?.type === "error" && (
              <p role="alert" className="mr-auto text-sm text-danger">
                {feedback.message}
              </p>
            )}
            <Button type="submit" isLoading={isPending} disabled={isPending}>
              Simpan Portofolio
            </Button>
          </div>
        </form>
      )}

      {feedback?.type === "success" && (
        <p role="status" className="mt-3 text-sm font-medium text-success">
          {feedback.message}
        </p>
      )}

      {projects.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <PortfolioProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-sm text-ink-muted">
          Belum ada karya. Tambahkan portofolio pertama untuk memperkuat profilmu.
        </div>
      )}
    </section>
  );
}
