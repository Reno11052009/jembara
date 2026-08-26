"use client";

import { useActionState, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { createProjectAction } from "@/app/actions/projects";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/Button";
import type {
  ProjectCreationData,
  ProjectWorkMode,
} from "@/types/my-jobs";

const workModeOptions: Array<{
  value: ProjectWorkMode;
  label: string;
}> = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

const fieldClass =
  "w-full rounded-lg bg-canvas px-4 py-3 text-sm font-body text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-brand/30";

export default function PasangLowonganView({
  data,
}: {
  data: ProjectCreationData;
}) {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    {},
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [workMode, setWorkMode] = useState<ProjectWorkMode>("REMOTE");

  const groupedSkills = useMemo(() => {
    return data.skillOptions.reduce<Record<string, typeof data.skillOptions>>(
      (groups, skill) => {
        (groups[skill.category] ??= []).push(skill);
        return groups;
      },
      {},
    );
  }, [data]);

  function toggleSkill(skillId: string) {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : current.length < 10
          ? [...current, skillId]
          : current,
    );
  }

  return (
    <>
      <PageHeader
        title="Pasang Lowongan Baru"
        subtitle={`Publikasikan project baru untuk ${data.businessName} dan mulai menerima proposal.`}
        userName={data.ownerName}
        avatarUrl={data.ownerAvatarUrl}
      />

      <div className="rounded-xl border border-hairline bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-black text-ink">
              Informasi Project
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Project yang berhasil dibuat langsung berstatus OPEN dan tampil di marketplace.
            </p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
            Maksimal 10 skill
          </span>
        </div>

        <form action={formAction} className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-bold text-ink">
              Judul Project
              <input
                name="title"
                type="text"
                required
                minLength={5}
                maxLength={120}
                placeholder="Contoh: Website katalog produk furnitur"
                className={fieldClass}
              />
              {state.fieldErrors?.title?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.title[0]}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-base font-bold text-ink">
              Budget Tetap (Rp)
              <input
                name="budget"
                type="number"
                required
                min={50_000}
                max={1_000_000_000}
                step={50_000}
                placeholder="Contoh: 2500000"
                className={fieldClass}
              />
              {state.fieldErrors?.budget?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.budget[0]}
                </span>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-2 text-base font-bold text-ink">
            Deskripsi Project
            <textarea
              name="description"
              rows={5}
              required
              minLength={20}
              maxLength={3000}
              placeholder="Jelaskan tujuan, kebutuhan, ruang lingkup, dan hasil yang diharapkan."
              className={`${fieldClass} resize-y`}
            />
            {state.fieldErrors?.description?.[0] && (
              <span className="text-sm font-normal text-danger">
                {state.fieldErrors.description[0]}
              </span>
            )}
          </label>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-base font-bold text-ink">
              Skill Wajib
            </legend>
            {data.skillOptions.length > 0 ? (
              <div className="space-y-4 rounded-lg bg-canvas p-4">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const selected = selectedSkillIds.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleSkill(skill.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                              selected
                                ? "border-brand bg-brand text-white"
                                : "border-hairline bg-white text-ink hover:border-brand hover:text-brand"
                            }`}
                          >
                            {selected && <Check size={13} />}
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-hairline p-4 text-sm text-ink-muted">
                Master skill belum tersedia. Jalankan seed taxonomy sebelum membuat project.
              </p>
            )}
            {selectedSkillIds.map((skillId) => (
              <input key={skillId} type="hidden" name="skillIds" value={skillId} />
            ))}
            {state.fieldErrors?.skillIds?.[0] && (
              <span className="text-sm font-normal text-danger">
                {state.fieldErrors.skillIds[0]}
              </span>
            )}
          </fieldset>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-base font-bold text-ink">
              Deadline
              <input
                name="deadline"
                type="date"
                required
                className={fieldClass}
              />
              {state.fieldErrors?.deadline?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.deadline[0]}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-base font-bold text-ink">
              Mode Kerja
              <span className="relative">
                <select
                  name="workMode"
                  value={workMode}
                  onChange={(event) =>
                    setWorkMode(event.target.value as ProjectWorkMode)
                  }
                  className={`${fieldClass} appearance-none pr-10`}
                >
                  {workModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2 text-base font-bold text-ink">
              Lokasi
              <input
                name="location"
                type="text"
                required={workMode !== "REMOTE"}
                disabled={workMode === "REMOTE"}
                maxLength={120}
                placeholder={workMode === "REMOTE" ? "Tidak diperlukan" : "Contoh: Malang"}
                className={fieldClass}
              />
              {state.fieldErrors?.location?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.location[0]}
                </span>
              )}
            </label>
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
            >
              {state.error}
            </p>
          )}

          <div className="flex items-center justify-end font-display font-black">
            <Button
              type="submit"
              variant="primary"
              isLoading={isPending}
              disabled={isPending || data.skillOptions.length === 0}
            >
              Publikasikan Project
            </Button>
          </div>
        </form>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
