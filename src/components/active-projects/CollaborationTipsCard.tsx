interface CollaborationTipsCardProps {
  tip: string;
}

export default function CollaborationTipsCard({ tip }: CollaborationTipsCardProps) {
  return (
    <div className="rounded-xl bg-gray p-5">
      <h3 className="font-display text-sm font-black text-white">
        Tips Sukses Kolaborasi
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-white">{tip}</p>
    </div>
  );
}