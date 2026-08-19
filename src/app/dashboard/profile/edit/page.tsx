import { getCachedProfileData } from "@/lib/profile";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default async function EditProfilePage() {
  const profileData = await getCachedProfileData();
  
  // Format the data to match the expected ProfileData interface
  const initialData = {
    name: profileData.name,
    headline: profileData.headline,
    location: profileData.location !== "Belum diatur" ? profileData.location : "",
    education: profileData.education !== "Pendidikan belum diatur" ? profileData.education : "",
    tingkat_pendidikan: profileData.tingkat_pendidikan || "",
    school: profileData.school || "",
    about: profileData.about,
    skills: profileData.skills,
    avatarUrl: profileData.avatarUrl
  };

  return <EditProfileForm initialData={initialData} />;
}
