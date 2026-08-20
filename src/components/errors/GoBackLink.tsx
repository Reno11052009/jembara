"use client";

import { useRouter } from "next/navigation";

export default function GoBackLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="font-body text-sm font-medium text-ink underline underline-offset-2 hover:text-brand"
    >
      Kembali ke halaman sebelumnya
    </button>
  );
}