import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Volume2 } from "lucide-react";

interface GeneratedResultContainerProps {
  children: ReactNode;
  onLike: () => void;
  onRegenerate: () => void;
  showActions?: boolean;
}

const GeneratedResultContainer = ({
  children,
  onLike,
  onRegenerate,
}: GeneratedResultContainerProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
      {children}

      <div className="flex gap-4 justify-center mt-6">
        <Button
          onClick={onLike}
          variant="outline"
          className="flex items-center gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-white"
        >
          <Heart className="w-4 h-4" />
          Like & Save
        </Button>
        <Button
          onClick={onRegenerate}
          variant="outline"
          className="flex items-center gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-white"
        >
          <Volume2 className="w-4 h-4" />
          Regenerate (1 credit)
        </Button>
      </div>
    </div>
  );
};

export default GeneratedResultContainer;
