import { CircleCheck, MapPin, GraduationCap, Star } from "lucide-react";
import Link from "next/link";

export interface ProfileCardProps {
  name: string;
  headline: string;
  location: string;
  education: string;
  avatarUrl: string;
}

export default function ProfileCard({ name, headline, location, education, avatarUrl }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
      <img 
        src={avatarUrl} 
        alt={`Profile of ${name}`} 
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50"
      />
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-500 mb-3">{headline}</p>
      
      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-6">
        <CircleCheck className="w-3.5 h-3.5" />
        Available for Projects
      </div>

      <div className="w-full flex flex-col gap-3 text-sm text-gray-600 mb-6 text-left">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-3">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span>{education}</span>
        </div>
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4 text-gray-400" fill="currentColor" />
          <span><span className="font-bold text-gray-900">4.9</span> (23 Reviews)</span>
        </div>
      </div>

      <Link href="/dashboard/profile/edit" className="w-full block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
        EDIT PROFIL
      </Link>
    </div>
  );
}