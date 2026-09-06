import ProfileView from "@/components/profile/ProfileView";
import { getCachedProfileData } from "@/lib/profile";

export const instant = false;

export default async function ProfilePage() {
  const profileData = await getCachedProfileData();

  return <ProfileView profileData={profileData} />;
}
