import PageHeader from "@/components/layout/PageHeader";
import ProfileCard from "@/components/profile/profile-card";
import { Star } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profil Saya"
        subtitle="Kelola informasi dan portofolio kamu di sini."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column */}
        <div className="flex w-full flex-col gap-6 lg:w-1/3">
          <ProfileCard />

          {/* Skills Card */}
          <div className="rounded-xl border border-hairline bg-card p-6">
            <h3 className="mb-4 text-lg font-bold text-ink">Keahlian & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Figma",
                "UI/UX Design",
                "Wireframing",
                "React.js",
                "Tailwind CSS",
                "JavaScript",
                "User Research",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-ink-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-6 lg:w-2/3">
          {/* About Section */}
          <div className="rounded-xl border border-hairline bg-card p-6 lg:p-8">
            <h3 className="mb-3 text-xl font-bold text-ink">Tentang Chello</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Saya adalah siswa Ilmu Komputer di SMK PGRI 03 Malang yang fokus
              mendalami dunia UI/UX Design dan Frontend Web Development. Senang
              berkolaborasi dengan UMKM dalam membangun solusi produk digital
              yang rapi, cepat, dan fungsional.
            </p>
          </div>

          {/* Portfolio Section */}
          <div>
            <h3 className="mb-4 ml-1 text-xl font-bold text-ink">
              Portofolio Pilihan
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Redesign Web Toko Sepatu", tag: "UI/UX & Frontend" },
                { title: "Apps Pemesanan Laundry", tag: "Mobile UI Design" },
                { title: "Landing Page Event UMKM", tag: "Web Development" },
                { title: "Sistem Kasir Pintar (Web)", tag: "Frontend Dev" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-hairline bg-card transition-shadow hover:shadow-md"
                >
                  <div className="h-48 overflow-hidden bg-canvas" />
                  <div className="p-4">
                    <h4 className="mb-1 font-bold text-ink">{item.title}</h4>
                    <p className="text-xs text-ink-muted">{item.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-4">
            <h3 className="mb-4 ml-1 text-xl font-bold text-ink">
              Ulasan Klien UMKM
            </h3>
            <div className="flex flex-col gap-6 rounded-xl border border-hairline bg-card p-6 lg:p-8">
              {[
                {
                  name: "Bpk. Cholik",
                  role: "Owner Toko Sepatu Jaya",
                  rating: "5.0",
                  quote:
                    "Kerjanya luar biasa cepat tanggap dan mengerti apa yang kami mau. Web toko kami sekarang terlihat modern dan keren sekali!",
                },
                {
                  name: "Ibu Chotijah",
                  role: "Manager Laundry Bersih",
                  rating: "4.8",
                  quote:
                    "Desain UI aplikasinya sangat user-friendly untuk pelanggan kami yang rata-rata ibu-ibu. Kerjasama yang sangat menyenangkan!",
                },
              ].map((review, idx, arr) => (
                <div
                  key={review.name}
                  className={
                    idx !== arr.length - 1
                      ? "border-b border-hairline pb-6"
                      : ""
                  }
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-ink">{review.name}</h4>
                      <p className="text-xs text-ink-muted">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-ink">
                      <Star className="h-4 w-4 text-brand" fill="currentColor" />
                      {review.rating}
                    </div>
                  </div>
                  <p className="text-sm text-ink-muted">
                    &quot;{review.quote}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
