import { BriefcaseBusiness, CircleCheck, MapPin, University, Star } from "lucide-react";
import Link from "next/link";

interface ProfileCardProps {
  isPublic?: boolean;
  name: string;
  avatarUrl: string;
  headline: string;
  location: string;
  education: string;
  skills: string[];
  available: boolean;
  rating: number;
  reviewCount: number;
  totalProject: number;
}

export default function ProfileCard({
  isPublic = false,
  name,
  avatarUrl,
  headline,
  location,
  education,
  skills,
  available,
  rating,
  reviewCount,
  totalProject,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center sticky top-24">
      <img
        src={avatarUrl}
        alt={`Foto profil ${name}`}
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50"
      />
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-500 mb-3">{headline}</p>

      <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-6 ${available ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
        <CircleCheck className="w-3.5 h-3.5" />
        {available ? "Tersedia untuk Proyek" : "Belum Tersedia"}
      </div>

      <div className="w-full flex flex-col gap-3 text-sm text-gray-600 mb-6 text-left">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{location}</span>
        </div>
        {education && (
          <div className="flex items-center gap-3">
            <University className="w-4 h-4 text-gray-400" />
            <span>{education}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4 text-gray-400" fill="currentColor" />
          <span><span className="font-bold text-gray-900">{rating.toFixed(1)}</span> ({reviewCount} Ulasan)</span>
        </div>
        <div className="flex items-center gap-3">
          <BriefcaseBusiness className="w-4 h-4 text-gray-400" />
          <span>{totalProject} Proyek Selesai</span>
        </div>
      </div>

      {!isPublic ? (
        <Link href="/dashboard/settings" className="w-full block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-center">
          EDIT PROFIL
        </Link>
      ) : (
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
          HUBUNGI & REKRUT {name.split(" ")[0].toUpperCase()}
        </button>
      )}

      {/* Keahlian & Tools dipindah ke bawah tombol */}
      <div className="w-full text-left mt-6">
        <h3 className="font-bold text-lg mb-4">Keahlian & Tools</h3>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-md"
            >
              {skill}
            </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Belum ada keahlian yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
}
