import Button from "@/components/ui/Button";
import TransactionMessageBubble from "@/components/dashboard/admin/messages/TransactionMessageBubble";
import { TransactionMessage } from "@/types/admin-chat-monitoring";

export default function ReportedTransactionPanel({
  messages,
}: {
  messages: TransactionMessage[];
}) {
  return (
    <div className="flex flex-col rounded-xl border border-hairline bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-6 py-4">
        <h2 className="font-display text-lg font-black text-ink">
          Detail Transaksi &amp; Percakapan Terlapor
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm">
            Abaikan
          </Button>
          <Button variant="outline" size="sm">
            Abaikan Laporan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {messages.map((message) => (
          <TransactionMessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
