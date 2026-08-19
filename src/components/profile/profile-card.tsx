<<<<<<< HEAD
import { CircleCheck, MapPin, GraduationCap, Star } from "lucide-react";
import Link from "next/link";
=======
import { CircleCheck, MapPin, University, Star } from "lucide-react";

const skills = [
  "Figma",
  "UI/UX Design",
  "Wireframing",
  "React.js",
  "Tailwind CSS",
  "JavaScript",
  "User Research",
];
>>>>>>> 6b377d4e35d41ab9957334ec63bf9f6dcb17e899

export interface ProfileCardProps {
  name: string;
  headline: string;
  location: string;
  education: string;
  avatarUrl: string;
}

export default function ProfileCard({ name, headline, location, education, avatarUrl }: ProfileCardProps) {
  return (
<<<<<<< HEAD
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
      <img 
        src={avatarUrl} 
        alt={`Profile of ${name}`} 
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50"
      />
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-500 mb-3">{headline}</p>
      
=======
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center sticky top-24">
      <img
        src="https://ui-avatars.com/api/?name=Chello+Arta&background=random"
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50"
      />
      <h2 className="text-xl font-bold">Chello Arta</h2>
      <p className="text-sm text-gray-500 mb-3">UI/UX Designer & Frontend Developer</p>

>>>>>>> 6b377d4e35d41ab9957334ec63bf9f6dcb17e899
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
<<<<<<< HEAD
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span>{education}</span>
=======
          <University className="w-4 h-4 text-gray-400" />
          <span>SMK PGRI 03 Malang</span>
>>>>>>> 6b377d4e35d41ab9957334ec63bf9f6dcb17e899
        </div>
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4 text-gray-400" fill="currentColor" />
          <span><span className="font-bold text-gray-900">4.9</span> (23 Reviews)</span>
        </div>
      </div>

<<<<<<< HEAD
      <Link href="/dashboard/profile/edit" className="w-full block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
        EDIT PROFIL
      </Link>
=======
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
        HUBUNGI & REKRUT CHELLO
      </button>

      {/* Keahlian & Tools dipindah ke bawah tombol */}
      <div className="w-full text-left mt-6">
        <h3 className="font-bold text-lg mb-4">Keahlian & Tools</h3>
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
      </div>
>>>>>>> 6b377d4e35d41ab9957334ec63bf9f6dcb17e899
    </div>
  );
}