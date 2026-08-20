"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ProjectMilestone } from "@/types/active-project";

interface MilestoneChecklistProps {
  milestones: ProjectMilestone[];
}

export default function MilestoneChecklist({ milestones }: MilestoneChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(milestones.map((m) => [m.id, m.done]))
  );

  const toggleMilestone = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="rounded-lg bg-canvas p-4">
      <p className="font-display text-sm font-black text-ink">Milestone Project</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {milestones.map((milestone) => {
          const isChecked = checkedItems[milestone.id] ?? milestone.done;

          return (
            <li
              key={milestone.id}
              className="flex cursor-pointer items-center gap-2.5"
              onClick={() => toggleMilestone(milestone.id)}
            >
              <span
                role="checkbox"
                aria-checked={isChecked}
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                  isChecked ? "bg-brand" : "border border-hairline bg-white"
                }`}
              >
                {isChecked && (
                  <Check size={11} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span
                className={`font-body text-sm ${
                  isChecked
                    ? "text-[#7A7A7A] underline"
                    : "text-ink"
                }`}
              >
                {milestone.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}