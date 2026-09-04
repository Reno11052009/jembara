import { notFound } from "next/navigation";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import PaymentCheckout from "@/components/payments/PaymentCheckout";
import { getProjectPaymentData, PaymentFlowError } from "@/lib/payments";

export const instant = false;

export default async function ProjectPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{ payment?: string }>;
}) {
  const { projectId } = await params;
  const search = searchParams ? await searchParams : undefined;
  let payment;
  try {
    payment = await getProjectPaymentData(projectId);
  } catch (error) {
    if (error instanceof PaymentFlowError) notFound();
    throw error;
  }

  return (
    <>
      <DashboardPageHeader
        title="Pembayaran Proyek"
        subtitle="Amankan dana proyek sebelum kolaborasi dimulai."
      />
      <div className="mx-auto max-w-2xl">
        <PaymentCheckout
          payment={payment}
          paymentFinished={search?.payment === "finish"}
        />
      </div>
    </>
  );
}
