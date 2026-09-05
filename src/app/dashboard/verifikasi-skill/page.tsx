import PageHeader from "@/components/layout/PageHeader";
import SkillVerificationView from "@/components/dashboard/admin/skills/SkillVerificationView";
import { getSkillVerificationData } from "@/lib/admin-skills";

export const instant = false;
export default async function SkillVerificationPage() {
  const data = await getSkillVerificationData();
  return <><PageHeader title="Verifikasi Skill" subtitle="Tinjau bukti portofolio atau rekam jejak proyek sebelum memberi badge." userName={data.adminName} /><SkillVerificationView items={data.skills} /></>;
}
