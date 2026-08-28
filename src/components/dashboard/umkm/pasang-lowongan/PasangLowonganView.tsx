"use client";


import { useActionState, useMemo, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { createProjectAction } from "@/app/actions/projects";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import SearchableSelect from "@/components/ui/SearchableSelect";
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
const pageLabelClassName = "flex flex-col gap-2 text-base font-bold text-ink";
const pageLabelTextClassName = "inline-flex items-center gap-1";

// Judul cuma ditolak kalau isinya angka doang (nggak ada huruf sama sekali).
const titleMustContainLetterPattern = "^(?=.*[A-Za-z]).*$";

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
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [budgetValue, setBudgetValue] = useState("");

  function handleBudgetChange(event: React.ChangeEvent<HTMLInputElement>) {
      const rawValue = event.target.value.replace(/\D/g, "");
      const formatted = new Intl.NumberFormat("id-ID").format(Number(rawValue || 0));
      setBudgetValue(formatted);
    }

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setAttemptedSubmit(true);
    if (selectedSkillIds.length === 0) {
      event.preventDefault();
    }
  }

  const showSkillRequiredError = attemptedSubmit && selectedSkillIds.length === 0;

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
        </div>

        <form action={formAction} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Judul */}
            <label className={pageLabelClassName}>
              <span className={pageLabelTextClassName}>
                Judul Project <span className="text-red-500">*</span>
              </span>
              <input
                name="title"
                type="text"
                required
                minLength={5}
                maxLength={120}
                pattern={titleMustContainLetterPattern}
                title="Judul harus mengandung huruf, nggak boleh cuma angka"
                placeholder="Contoh: Website katalog produk furnitur"
                className={fieldClass}
              />
              {state.fieldErrors?.title?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.title[0]}
                </span>
              )}
            </label>

            {/* Budget */}
            <label className={pageLabelClassName}>
              <span className={pageLabelTextClassName}>
                Budget Tetap (Rp) <span className="text-red-500">*</span>
              </span>
              <input
                name="budget"
                type="text"
                inputMode="numeric"
                required
                value={budgetValue}
                onChange={handleBudgetChange}
                placeholder="Contoh: 2.500.000"
                className={`${fieldClass} text-right`}
              />
              <input
                type="hidden"
                name="budgetRaw"
                value={budgetValue.replace(/\D/g, "")}
              />
              {state.fieldErrors?.budget?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.budget[0]}
                </span>
              )}
            </label>
            </div>

          {/* Deskripsi */}
          <label className={pageLabelClassName}>
            <span className={pageLabelTextClassName}>
              Deskripsi Project <span className="text-red-500">*</span>
            </span>
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

          {/* Skill */}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-base font-bold text-ink">
              <span className={pageLabelTextClassName}>
                Skill Wajib <span className="text-red-500">*</span>
              </span>
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
            {showSkillRequiredError && (
              <span className="text-sm font-normal text-danger">
                Pilih minimal 1 skill.
              </span>
            )}
            {state.fieldErrors?.skillIds?.[0] && (
              <span className="text-sm font-normal text-danger">
                {state.fieldErrors.skillIds[0]}
              </span>
            )}
          </fieldset>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Deadline */}
            <label className={pageLabelClassName}>
              <span className={pageLabelTextClassName}>
                Deadline <span className="text-red-500">*</span>
              </span>
              <input
                name="deadline"
                type="date"
                required
                className={`${fieldClass} [&::-webkit-datetime-edit]:w-full [&::-webkit-datetime-edit-fields-wrapper]:w-full`}
              />
              {state.fieldErrors?.deadline?.[0] && (
                <span className="text-sm font-normal text-danger">
                  {state.fieldErrors.deadline[0]}
                </span>
              )}
            </label>

            {/* Mode Kerja */}
            <SearchableSelect
              id="workMode"
              name="workMode"
              label="Mode Kerja"
              labelClassName="mt-2 inline-flex items-center gap-1 text-base font-bold text-ink"
              value={workMode}
              onChange={(code) => setWorkMode(code as ProjectWorkMode)}
              options={workModeOptions.map((option) => ({
                code: option.value,
                name: option.label,
              }))}
              placeholder="Pilih mode kerja"
              searchPlaceholder="Cari mode kerja..."
              required
            />

            {/* Lokasi */}
            <label className={pageLabelClassName}>
              <span className={pageLabelTextClassName}>
                Lokasi {workMode !== "REMOTE" && <span className="text-red-500">*</span>}
              </span>
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
    </>
  );
}