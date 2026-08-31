import { redirect } from "next/navigation";

export default async function MessagesPage() {
  redirect("/dashboard/messages");
}
