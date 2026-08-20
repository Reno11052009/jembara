import { ImageIcon, Star } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileCard from "@/components/profile/profile-card";
import { getCachedProfileData } from "@/lib/profile";

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export default async function ProfilePage() {
  const profileData = await getCachedProfileData();

  return (
    <>
      <PageHeader
        title="Profil"
        subtitle="Lihat bagaimana profil publik Anda tampil di mata orang lain."
        userName={profileData.name}
        avatarUrl={profileData.avatarUrl}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/3">
          <ProfileCard
            name={profileData.name}
            avatarUrl={profileData.avatarUrl}
            headline={profileData.headline}
            location={profileData.location}
            education={profileData.education}
            skills={profileData.skills}
            available={profileData.available}
            rating={profileData.rating}
            reviewCount={profileData.reviewCount}
            totalProject={profileData.totalProject}
          />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h3 className="font-bold text-xl mb-3">Tentang {profileData.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {profileData.about}
            </p>
          </section>

          <section>
            <h3 className="font-bold text-xl mb-4 ml-1">Portofolio Pilihan</h3>
            {profileData.portfolios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profileData.portfolios.map((portfolio) => {
                  const content = (
                    <>
                      <div className="h-48 bg-gray-100 relative overflow-hidden">
                        {portfolio.image ? (
                          <img
                            src={portfolio.image}
                            alt={portfolio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-10 h-10" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-1">{portfolio.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {portfolio.description || "Belum ada deskripsi."}
                        </p>
                      </div>
                    </>
                  );

                  return portfolio.link ? (
                    <a
                      key={portfolio.id}
                      href={normalizeUrl(portfolio.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      {content}
                    </a>
                  ) : (
                    <article
                      key={portfolio.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                    >
                      {content}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                Belum ada portofolio yang ditambahkan.
              </div>
            )}
          </section>

          <section className="mt-4">
            <h3 className="font-bold text-xl mb-4 ml-1">Ulasan Klien UMKM</h3>
            {profileData.reviews.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col gap-6">
                {profileData.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.reviewerName}</h4>
                        <p className="text-xs text-gray-500">{review.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Star className="w-4 h-4 text-orange-500" fill="currentColor" />
                        {review.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {review.comment || "Klien belum menambahkan komentar."}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                Belum ada ulasan dari klien.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
