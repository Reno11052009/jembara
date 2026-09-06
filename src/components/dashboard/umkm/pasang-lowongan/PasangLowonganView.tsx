"use client";

import { useActionState, useState, type FormEvent } from "react";
import { createProjectAction } from "@/app/actions/projects";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import SearchableSelect from "@/components/ui/SearchableSelect";
import FormattedNumericInput from "@/components/ui/FormattedNumericInput";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { ProjectCreationData, ProjectWorkMode } from "@/types/my-jobs";

const workModes: Array<{ code: ProjectWorkMode; name: string }> = [
  { code: "REMOTE", name: "Remote" },
  { code: "HYBRID", name: "Hybrid" },
  { code: "ONSITE", name: "Onsite" },
];
const fieldClass = "w-full rounded-lg bg-canvas px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60";
const labelClass = "flex flex-col gap-2 text-base font-bold text-ink";

export default function PasangLowonganView({ data }: { data: ProjectCreationData }) {
  const { dict } = usePreferences();
  const [state, formAction, isPending] = useActionState(createProjectAction, {});
  const [requiredIds, setRequiredIds] = useState<string[]>([]);
  const [optionalIds, setOptionalIds] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [workMode, setWorkMode] = useState<ProjectWorkMode>("REMOTE");
  const [budget, setBudget] = useState("");
  const [attempted, setAttempted] = useState(false);
  const skillOptions = data.skillOptions.map((skill) => ({ code: skill.id, name: skill.name, group: skill.category }));

  function submit(event: FormEvent<HTMLFormElement>) {
    setAttempted(true);
    if (!requiredIds.length) event.preventDefault();
  }

  function updateRequired(values: string[]) {
    setRequiredIds(values);
    setOptionalIds((current) => current.filter((id) => !values.includes(id)));
  }

  return <>
    <PageHeader title={dict.projects.createTitle} subtitle={dict.projects.createSubtitle.replace("{businessName}", data.businessName)} userName={data.ownerName} avatarUrl={data.ownerAvatarUrl} />
    <div className="rounded-xl border border-hairline bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl font-black text-ink">{dict.projects.createTitle}</h2>
      <form action={formAction} onSubmit={submit} noValidate className="mt-6 flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className={labelClass}>
            <span>
              {dict.projects.titleLabel} <span className="text-red-500 dark:text-red-400">*</span>
            </span>
            <input name="title" required minLength={5} maxLength={120} placeholder="Contoh: Website katalog produk furnitur" className={fieldClass} />
            {state.fieldErrors?.title?.[0] && <span className="text-sm font-normal text-danger">{state.fieldErrors.title[0]}</span>}
          </label>
          <label className={labelClass}>
            <span>
              {dict.projects.budgetLabel} <span className="text-red-500 dark:text-red-400">*</span>
            </span>
            <FormattedNumericInput name="budget" required value={budget} onValueChange={setBudget} placeholder="Contoh: 2.500.000" className={`${fieldClass} text-right`} />
            <input type="hidden" name="budgetRaw" value={budget.replace(/\D/g, "")} />
            {state.fieldErrors?.budget?.[0] && <span className="text-sm font-normal text-danger">{state.fieldErrors.budget[0]}</span>}
          </label>
        </div>
        <label className={labelClass}>
          <span>
            {dict.projects.descriptionLabel} <span className="text-red-500 dark:text-red-400">*</span>
          </span>
          <textarea name="description" rows={5} required minLength={20} maxLength={3000} placeholder="Jelaskan tujuan, kebutuhan, ruang lingkup, dan hasil yang diharapkan." className={`${fieldClass} resize-y`} />
          {state.fieldErrors?.description?.[0] && <span className="text-sm font-normal text-danger">{state.fieldErrors.description[0]}</span>}
        </label>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-base font-bold text-ink">{dict.projects.skillsLabel}</legend>
          {data.skillOptions.length ? <>
            <div>
              <p className="mb-2 text-sm font-bold text-ink">
                {dict.projects.requiredSkills} <span className="text-red-500 dark:text-red-400">*</span>
              </p>
              <MultiSelectDropdown id="requiredSkills" name="requiredSkillIds" values={requiredIds} onChange={updateRequired} options={skillOptions} placeholder="Pilih skill wajib" searchPlaceholder="Cari skill..." emptyMessage="Skill tidak ditemukan" maxSelections={10} invalid={(attempted && !requiredIds.length) || Boolean(state.fieldErrors?.requiredSkillIds?.[0])} disabled={isPending} />
            </div>
            <div><p className="mb-2 text-sm font-bold text-ink">{dict.projects.optionalSkills}</p>
              <MultiSelectDropdown id="optionalSkills" name="optionalSkillIds" values={optionalIds} onChange={setOptionalIds} options={skillOptions.filter((skill) => !requiredIds.includes(skill.code))} placeholder="Pilih skill pendukung" searchPlaceholder="Cari skill..." emptyMessage="Skill tidak ditemukan" maxSelections={Math.max(0, 10 - requiredIds.length)} invalid={Boolean(state.fieldErrors?.optionalSkillIds?.[0])} disabled={isPending || requiredIds.length >= 10} />
            </div>
          </> : <p className="rounded-lg border border-dashed border-hairline p-4 text-sm text-ink-muted">Master skill belum tersedia.</p>}
          {attempted && !requiredIds.length && <span className="text-sm text-danger">Pilih minimal 1 skill wajib.</span>}
          {state.fieldErrors?.requiredSkillIds?.[0] && <span className="text-sm text-danger">{state.fieldErrors.requiredSkillIds[0]}</span>}
          {state.fieldErrors?.optionalSkillIds?.[0] && <span className="text-sm text-danger">{state.fieldErrors.optionalSkillIds[0]}</span>}
        </fieldset>
        <div className="grid gap-6 md:grid-cols-3">
          <div><DatePicker id="deadline" name="deadline" label={dict.projects.deadlineLabel} labelClassName={labelClass} value={deadline} onChange={setDeadline} required />{state.fieldErrors?.deadline?.[0] && <span className="text-sm text-danger">{state.fieldErrors.deadline[0]}</span>}</div>
          <SearchableSelect id="workMode" name="workMode" label={dict.projects.workModeLabel} labelClassName="mt-2 text-base font-bold text-ink" value={workMode} onChange={(value) => setWorkMode(value as ProjectWorkMode)} options={workModes} placeholder="Pilih mode kerja" searchPlaceholder="Cari mode kerja..." showSearch={false} required />
          <label className={labelClass}>
            <span>
              {dict.projects.locationLabel} {workMode !== "REMOTE" && <span className="text-red-500 dark:text-red-400">*</span>}
            </span>
            <input name="location" required={workMode !== "REMOTE"} disabled={workMode === "REMOTE"} maxLength={120} placeholder={workMode === "REMOTE" ? "Tidak diperlukan" : "Contoh: Bandung, Jawa Barat"} className={fieldClass} />
            {state.fieldErrors?.location?.[0] && <span className="text-sm text-danger">{state.fieldErrors.location[0]}</span>}
          </label>
        </div>
        {state.error && <p role="alert" className="rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{state.error}</p>}
        <div className="flex justify-end font-display font-black"><Button type="submit" variant="primary" isLoading={isPending} disabled={isPending || !data.skillOptions.length}>{dict.projects.publishButton}</Button></div>
      </form>
    </div>
  </>;
}
