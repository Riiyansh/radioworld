import { Suspense } from "react";
import StationsContent from "./StationsContent";
import { Loader2 } from "lucide-react";

export default function StationsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    }>
      <StationsContent />
    </Suspense>
  );
}
