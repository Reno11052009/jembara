import PublicTopBar from "@/components/errors/PublicTopBar";
import NotFoundContent from "@/components/errors/NotFoundContent";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicTopBar />
      <div className="flex flex-1 items-center justify-center">
        <NotFoundContent />
      </div>
    </div>
  );
}