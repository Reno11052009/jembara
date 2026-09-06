"use client";

import { ImageIcon, Star } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileCard from "@/components/profile/profile-card";
import { usePreferences } from "@/contexts/PreferencesContext";

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

interface ProfileViewProps {
  profileData: {
    name: string;
    role: string;
    avatarUrl: string;
    headline: string;
    location: string;
    education: string;
    about: string;
    skills: string[];
    available: boolean;
    rating: number;
    reviewCount: number;
    totalProject: number;
    portfolios: Array<{
      id: string;
      title: string;
      description?: string | null;
      image?: string | null;
      link?: string | null;
    }>;
    reviews: Array<{
      id: string;
      reviewerName: string;
      projectTitle: string;
      rating: number;
      comment?: string | null;
    }>;
  };
}

export default function ProfileView({ profileData }: ProfileViewProps) {
  const { dict: t } = usePreferences();

  return (
    <>
      <PageHeader
        title={t.profilePage.title}
        subtitle={t.profilePage.subtitle}
        userName={profileData.name}
        avatarUrl={profileData.avatarUrl}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/3">
          <ProfileCard
            name={profileData.name}
            role={profileData.role}
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
          <section className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-hairline p-6 lg:p-8">
            <h3 className="font-bold text-xl mb-3">{t.profilePage.about} {profileData.name}</h3>
            <p className="text-gray-600 dark:text-ink-muted text-sm leading-relaxed whitespace-pre-line">
              {profileData.about}
            </p>
          </section>

          <section>
            <h3 className="font-bold text-xl mb-4 ml-1">{t.profilePage.featuredPortfolio}</h3>
            {profileData.portfolios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profileData.portfolios.map((portfolio) => {
                  const content = (
                    <>
                      <div className="h-48 bg-gray-100 dark:bg-surface relative overflow-hidden">
                        {portfolio.image ? (
                          // Gambar portofolio dapat berupa data URL dari profil pengguna.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={portfolio.image}
                            alt={portfolio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-ink-muted">
                            <ImageIcon className="w-10 h-10" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 dark:text-ink mb-1">{portfolio.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-ink-muted line-clamp-2">
                          {portfolio.description || t.profilePage.noDescription}
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
                      className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-hairline overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      {content}
                    </a>
                  ) : (
                    <article
                      key={portfolio.id}
                      className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-hairline overflow-hidden group"
                    >
                      {content}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-card rounded-xl border border-dashed border-gray-200 dark:border-hairline p-8 text-center text-sm text-gray-500 dark:text-ink-muted">
                {t.profilePage.emptyPortfolios}
              </div>
            )}
          </section>

          <section className="mt-4">
            <h3 className="font-bold text-xl mb-4 ml-1">{t.profilePage.clientReviews}</h3>
            {profileData.reviews.length > 0 ? (
              <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-hairline p-6 lg:p-8 flex flex-col gap-6">
                {profileData.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="border-b border-gray-100 dark:border-hairline pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-ink">{review.reviewerName}</h4>
                        <p className="text-xs text-gray-500 dark:text-ink-muted">{review.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Star className="w-4 h-4 text-orange-500 dark:text-orange-400" fill="currentColor" />
                        {review.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-ink-muted text-sm">
                      {review.comment || t.profilePage.noReviewComment}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-card rounded-xl border border-dashed border-gray-200 dark:border-hairline p-8 text-center text-sm text-gray-500 dark:text-ink-muted">
                {t.profilePage.emptyReviews}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
