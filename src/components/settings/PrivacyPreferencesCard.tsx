import { privacyPreferences } from "@/lib/mock-privacy-settings";

export default function PrivacyPreferencesCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-2">
        Preferensi Kehadiran & Data
      </h2>

      <div>
        {privacyPreferences.map((preference, index) => (
          <div
            key={preference.id}
            className={`flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0 ${
              index === privacyPreferences.length - 1
                ? ""
                : "border-b border-[#ECECEC]"
            }`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-neutral-900 mb-1">
                {preference.title}
              </p>
              <p className="font-body text-sm text-neutral-500 max-w-xl">
                {preference.description}
              </p>
            </div>

            <div
              className={`relative shrink-0 w-12 h-7 rounded-full ${
                preference.enabled ? "bg-orange-500" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow ${
                  preference.enabled ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
