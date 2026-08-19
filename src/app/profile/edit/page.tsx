import { redirect } from "next/navigation";

export default function ProfileEditRedirect() {
  redirect("/dashboard/profile/edit");
}
