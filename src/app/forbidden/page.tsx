import PublicTopBar from "@/components/errors/PublicTopBar";
import ForbiddenContent from "@/components/errors/ForbiddenContent";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicTopBar />
      <div className="flex flex-1 items-center justify-center">
        <ForbiddenContent />
      </div>
    </div>
  );
}